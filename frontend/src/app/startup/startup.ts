import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

// Define the shape of the data based on your JSON response
interface Startup {
  id: number;
  startupName: string;
  shortDescription: string;
  category: string;
  funding: number;
  s3Key: string;
  originalFileName: string;
  userId: number | null;
}

@Component({
  selector: 'app-startup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './startup.html',
  styleUrls: ['./startup.css']
})
export class StartupComponent implements OnInit {

  startups: Startup[] = [];
  isLoading = true;
  
  // Tracks which specific startup is currently downloading (to show spinner/text)
  downloadingId: number | null = null;

  // Adjust to your backend port
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStartups();
  }

  fetchStartups() {
    this.isLoading = true;
  
    this.http.get<Startup[]>(`${this.apiUrl}/startups/all`)
      .subscribe({
        next: (data) => {
          this.startups = data;
        },
        error: (error) => {
          console.error('Error fetching startups:', error);
          alert('Could not load startups.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
  
  async downloadPitchDeck(startup: Startup) {
    if (this.downloadingId === startup.id) return; // Prevent double clicks

    this.downloadingId = startup.id;

    try {
      console.log(`Requesting download link for: ${startup.originalFileName}`);

      // 1. Call your existing backend endpoint to get the Presigned URL
      // Endpoint: /api/files/presigned-download?key=...&fileName=...
      const params = {
        key: startup.s3Key,
        fileName: startup.originalFileName
      };

      const response = await lastValueFrom(
        this.http.get<{ downloadUrl: string }>(`${this.apiUrl}/files/presigned-download`, { params })
      );

      // 2. Trigger the download in the browser
      // We create a temporary hidden link and click it programmatically
      const link = document.createElement('a');
      link.href = response.downloadUrl;
      // The 'download' attribute is technically redundant here because 
      // the S3 URL already has 'Content-Disposition: attachment', 
      // but it's good practice.
      link.download = startup.originalFileName; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download the file. Please try again.');
    } finally {
      this.downloadingId = null; // Reset button state
    }
  }
}