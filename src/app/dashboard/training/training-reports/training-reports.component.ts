import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  province: string;
  qualification: string;
  experience: number;
  status: string;
  location: string;
  bio: string;
}

@Component({
  selector: 'app-training-reports',
  templateUrl: './training-reports.component.html',
  styleUrls: ['./training-reports.component.scss']
})
export class TrainingReportsComponent implements OnInit {

  trainers: Trainer[] = [];
  activeTrainersCount: number = 0;

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadTrainers();
  }

  // Load trainers data and calculate active count
  loadTrainers(): void {
    this.trainers = [
      {
        id: 1,
        name: 'ZIBA',
        email: 'ziba@Promedtechnologies.co.za',
        phone: '+27721234567',
        province: 'Gauteng',
        qualification: 'MD',
        experience: 8,
        status: 'Active',
        location: 'Johannesburg',
        bio: 'Experienced medical trainer with focus on community health'
      },
      {
        id: 2,
        name: 'LINDANI',
        email: 'lindani@Promedtechnologies.co.za',
        phone: '+27721234568',
        province: 'KwaZulu-Natal',
        qualification: 'MD, PhD',
        experience: 12,
        status: 'Active',
        location: 'Durban',
        bio: 'Medical specialist with extensive training background'
      },
      {
        id: 3,
        name: 'KEHOLIHLE',
        email: 'keholihle@Promedtechnologies.co.za',
        phone: '+27721234569',
        province: 'Western Cape',
        qualification: 'MD, MSc',
        experience: 6,
        status: 'Active',
        location: 'Cape Town',
        bio: 'Community health advocate specializing in medical training'
      },
      {
        id: 4,
        name: 'SELBY',
        email: 'selby@Promedtechnologies.co.za',
        phone: '+27721234570',
        province: 'Eastern Cape',
        qualification: 'MD',
        experience: 10,
        status: 'Active',
        location: 'Port Elizabeth',
        bio: 'Medical trainer with focus on rural health programs'
      },
      {
        id: 5,
        name: 'MASI',
        email: 'masi@Promedtechnologies.co.za',
        phone: '+27721234571',
        province: 'Limpopo',
        qualification: 'MD, MSc',
        experience: 7,
        status: 'Active',
        location: 'Polokwane',
        bio: 'Healthcare professional with training expertise'
      },
      {
        id: 6,
        name: 'DYLAN',
        email: 'dylan@Promedtechnologies.co.za',
        phone: '+27721234572',
        province: 'Mpumalanga',
        qualification: 'MD',
        experience: 5,
        status: 'Active',
        location: 'Nelspruit',
        bio: 'Medical professional specializing in training programs'
      }
    ];

    // Calculate active trainers count
    this.activeTrainersCount = this.trainers.filter(trainer => trainer.status === 'Active').length;
  }

}
