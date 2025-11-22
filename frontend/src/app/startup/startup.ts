import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Interface for a startup item
 */
export interface StartupItem {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  founder: string;
  funding: string;
}

@Component({
  selector: 'app-startup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './startup.html',
  styleUrl: './startup.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartupComponent {
  /** The active tab from parent */
  @Input() activeTab: string = '';

  /** Search term for filtering startups */
  searchTerm = '';
  /** Selected industry filter */
  selectedIndustry = '';
  /** Selected location filter */
  selectedLocation = '';
  /** Current page for pagination */
  currentPage = 1;
  /** Total number of pages */
  totalPages = 1;

  /** List of saved startups */
  savedStartups: StartupItem[] = [];
  /** List of filtered startups */
  filteredStartups: StartupItem[] = [];

  /** Available industries */
  readonly industries: string[] = ['Healthcare', 'AI/ML', 'Analytics', 'Fintech', 'E-commerce', 'Education'];
  /** Available locations */
  readonly locations: string[] = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Boston, MA', 'Seattle, WA'];

  /** Handles search input */
  onSearch(): void {
    // TODO: Implement search logic
  }

  /** Handles filter changes */
  onFilterChange(): void {
    // TODO: Implement filter logic
  }

  /** View a startup's details */
  viewStartup(startupId: string): void {
    // TODO: Implement view logic
  }

  /** Connect with a startup */
  connectWithStartup(startupId: string): void {
    // TODO: Implement connect logic
  }

  /** Save a startup */
  saveStartup(startupId: string): void {
    // TODO: Implement save logic
  }

  /** Check if a startup is saved */
  isStartupSaved(startupId: string): boolean {
    return this.savedStartups.some(startup => startup.id === startupId);
  }

  /** Get page numbers for pagination */
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /** Go to a specific page */
  goToPage(page: number): void {
    this.currentPage = page;
    // TODO: Implement pagination logic
  }
}
