import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Training {
  id: number;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  trainer: string;
  maxParticipants: number;
  registeredParticipants: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  color: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  trainings: Training[] = [];
  selectedDate: Date = new Date();
  viewMode: 'month' | 'week' | 'day' = 'month';
  
  // Sample training data
  sampleTrainings: Training[] = [
    {
      id: 1,
      title: 'HIV/AIDS Awareness Training',
      description: 'Comprehensive training on HIV/AIDS prevention and care',
      date: new Date(2025, 6, 18), // July 18, 2025
      endDate: new Date(2025, 6, 18),
      location: 'Chris Hani Baragwanath Hospital',
      trainer: 'Dr. Sarah Johnson',
      maxParticipants: 50,
      registeredParticipants: 35,
      status: 'scheduled',
      category: 'Healthcare',
      color: '#1e3a8a'
    },
    {
      id: 2,
      title: 'Mental Health First Aid',
      description: 'Training on mental health awareness and first aid',
      date: new Date(2025, 6, 22), // July 22, 2025
      endDate: new Date(2025, 6, 22),
      location: 'Charlotte Maxeke Hospital',
      trainer: 'Dr. Michael Brown',
      maxParticipants: 30,
      registeredParticipants: 28,
      status: 'scheduled',
      category: 'Mental Health',
      color: '#3b82f6'
    },
    {
      id: 3,
      title: 'Nutrition and Wellness Workshop',
      description: 'Nutrition education and wellness promotion',
      date: new Date(2025, 6, 25), // July 25, 2025
      endDate: new Date(2025, 6, 25),
      location: 'Groote Schuur Hospital',
      trainer: 'Dr. Linda Williams',
      maxParticipants: 40,
      registeredParticipants: 22,
      status: 'scheduled',
      category: 'Wellness',
      color: '#60a5fa'
    },
    {
      id: 4,
      title: 'Emergency Response Training',
      description: 'Training on emergency response procedures',
      date: new Date(2025, 6, 20), // July 20, 2025
      endDate: new Date(2025, 6, 20),
      location: 'Tygerberg Hospital',
      trainer: 'Dr. James Anderson',
      maxParticipants: 25,
      registeredParticipants: 25,
      status: 'ongoing',
      category: 'Emergency',
      color: '#1d4ed8'
    }
  ];

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.trainings = this.sampleTrainings;
  }

  onDateSelect(date: Date): void {
    this.selectedDate = date;
  }

  getTrainingsForDate(date: Date): Training[] {
    return this.trainings.filter(training => 
      training.date.toDateString() === date.toDateString()
    );
  }

  onTrainingClick(training: Training): void {
    // Navigate to training details or edit
    this.router.navigate(['/dashboard/training/view', training.id]);
  }

  addNewTraining(): void {
    this.router.navigate(['/dashboard/training/add']);
  }

  changeViewMode(mode: 'month' | 'week' | 'day'): void {
    this.viewMode = mode;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'scheduled': return '#1e3a8a';
      case 'ongoing': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getUpcomingTrainings(): Training[] {
    const today = new Date();
    return this.trainings
      .filter(training => training.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }

  getTodayTrainings(): Training[] {
    const today = new Date();
    return this.trainings.filter(training => 
      training.date.toDateString() === today.toDateString()
    );
  }
}
