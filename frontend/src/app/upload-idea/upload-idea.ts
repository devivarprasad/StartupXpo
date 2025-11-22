import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // 1. Import HttpClient
import { lastValueFrom } from 'rxjs'; // 2. Import helper to convert Observable to Promise

@Component({
  selector: 'app-upload-idea',
  standalone: true,
  imports: [CommonModule, FormsModule], // Ensure HttpClientModule is in your main app config
  templateUrl: './upload-idea.html',
  styleUrl: './upload-idea.css'
})
export class UploadIdeaComponent {
  
  // Backend Base URL (Change this to your actual backend port)
  private apiUrl = 'http://localhost:8080/api'; 

  isSubmitting = false; // To show a loading spinner or disable button

  form = {
    startupName: '',
    shortDescription: '',
    category: '',
    funding: null,
  };

  categories: string[] = [
    'FinTech', 'HealthTech', 'EdTech', 'AI/ML',
    'E-commerce', 'SaaS', 'Travel', 'Other'
  ];

  pitchDeckFile: File | null = null;
  selectedFileName: string | null = null;

  // 3. Inject HttpClient
  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      this.pitchDeckFile = file;
      this.selectedFileName = file.name;
    } else {
      this.pitchDeckFile = null;
      this.selectedFileName = null;
      alert('Only PDF files are allowed.');
    }
  }

  async submitIdea() {
    if (!this.pitchDeckFile) {
      alert('Please upload your pitch deck PDF.');
      return;
    }

    this.isSubmitting = true;

    try {
      // --- STEP 1: Get Presigned URL from Backend ---
      console.log('1. Requesting upload URL...');
      
      const presignRequest = {
        fileName: this.pitchDeckFile.name,
        contentType: this.pitchDeckFile.type
      };

      // We use lastValueFrom to turn the Observable into a Promise we can 'await'
      const presignResponse = await lastValueFrom(
        this.http.post<{ uploadUrl: string, key: string }>(
          `${this.apiUrl}/files/presigned-upload`, 
          presignRequest
        )
      );

      // --- STEP 2: Upload File directly to S3 ---
      console.log('2. Uploading to S3...', presignResponse.uploadUrl);

      // IMPORTANT: You MUST set the Content-Type header to match what you sent in Step 1
      // S3 rejects the upload if the headers don't match the signature.
      await lastValueFrom(
        this.http.put(presignResponse.uploadUrl, this.pitchDeckFile, {
          headers: { 'Content-Type': this.pitchDeckFile.type }
        })
      );

      // --- STEP 3: Submit Form Data + S3 Key to Backend ---
      console.log('3. Saving submission to Database...');

      const submissionPayload = {
        startupName: this.form.startupName,
        shortDescription: this.form.shortDescription,
        category: this.form.category,
        funding: this.form.funding,
        // LINKING: Here we map the file key we got from Step 1
        s3Key: presignResponse.key,
        originalFileName: this.pitchDeckFile.name
      };

      await lastValueFrom(
        this.http.post(`${this.apiUrl}/startups/submit-idea`, submissionPayload)
      );

      alert('Idea submitted successfully!');
      this.resetForm();

    } catch (error) {
      console.error('Submission failed', error);
      alert('Failed to submit idea. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetForm() {
    this.form = {
      startupName: '',
      shortDescription: '',
      category: '',
      funding: null,
    };
    this.pitchDeckFile = null;
    this.selectedFileName = null;
  }
}