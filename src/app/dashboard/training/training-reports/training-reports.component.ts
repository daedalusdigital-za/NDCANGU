import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-training-reports',
  templateUrl: './training-reports.component.html',
  styleUrls: ['./training-reports.component.scss']
})
export class TrainingReportsComponent implements OnInit {

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

}
