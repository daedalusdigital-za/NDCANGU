import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-tutorials',
  templateUrl: './list-tutorials.component.html',
  styleUrls: ['./list-tutorials.component.scss']
})
export class ListTutorialsComponent implements OnInit {
  
  // Tutorial data
  tutorials = [
    {
      id: 1,
      title: 'BioHermes A1C EZ 2.0 Demonstration',
      description: 'Complete walkthrough of the standard operation procedure for BioHermes A1C EZ 2.0 medical device',
      duration: '5:30',
      videoUrl: 'https://www.youtube.com/embed/JgBfj-4gNHY',
      category: 'Demonstration',
      views: 1234,
      uploadDate: '2 days ago',
      featured: true
    },
    {
      id: 2,
      title: 'BioHermes Test Instructions',
      description: 'Step-by-step guide on how to properly use the BioHermes testing device',
      duration: '3:45',
      videoUrl: 'https://www.youtube.com/embed/HlWaHlb1Cc8',
      category: 'Instructions',
      views: 856,
      uploadDate: '1 week ago',
      featured: false
    },
    {
      id: 3,
      title: 'Device Setup & Configuration',
      description: 'Learn how to properly set up and configure your medical devices for optimal performance',
      duration: '2:30',
      thumbnailUrl: 'assets/images/img-6.png',
      category: 'Setup Guide',
      views: 642,
      uploadDate: '3 days ago',
      featured: false
    }
  ];

  filteredTutorials = [...this.tutorials];
  activeFilter = 'All';
  searchQuery = '';

  constructor() { }

  ngOnInit(): void {
    this.filteredTutorials = this.tutorials;
  }

  // Filter tutorials by category
  filterTutorials(category: string): void {
    this.activeFilter = category;
    
    if (category === 'All') {
      this.filteredTutorials = this.tutorials;
    } else {
      this.filteredTutorials = this.tutorials.filter(tutorial => 
        tutorial.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    // Apply search filter if there's a search query
    if (this.searchQuery) {
      this.searchTutorials();
    }
  }

  // Search tutorials
  searchTutorials(): void {
    if (!this.searchQuery.trim()) {
      this.filterTutorials(this.activeFilter);
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredTutorials = this.tutorials.filter(tutorial =>
      tutorial.title.toLowerCase().includes(query) ||
      tutorial.description.toLowerCase().includes(query) ||
      tutorial.category.toLowerCase().includes(query)
    );
  }

  // Get total duration of all tutorials
  getTotalDuration(): string {
    const totalMinutes = this.tutorials.reduce((total, tutorial) => {
      const [minutes, seconds] = tutorial.duration.split(':').map(Number);
      return total + minutes + (seconds / 60);
    }, 0);

    return `${Math.floor(totalMinutes)}m`;
  }

  // Format view count
  formatViews(views: number): string {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  }

  // Handle resource downloads/navigation
  downloadResource(resourceType: string): void {
    switch (resourceType) {
      case 'manual':
        // Implement PDF download logic
        console.log('Downloading user manual...');
        break;
      case 'guide':
        // Navigate to quick start guide
        console.log('Opening quick start guide...');
        break;
      case 'faq':
        // Navigate to FAQ page
        console.log('Opening FAQ page...');
        break;
    }
  }

}
