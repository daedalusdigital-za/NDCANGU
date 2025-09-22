import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TrainingReportsComponent } from './training-reports.component';

describe('TrainingReportsComponent', () => {
  let component: TrainingReportsComponent;
  let fixture: ComponentFixture<TrainingReportsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'info', 'warning', 'error']);

    await TestBed.configureTestingModule({
      declarations: [TrainingReportsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingReportsComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockToastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct data', () => {
    component.ngOnInit();
    
    expect(component.trainers.length).toBe(6);
    expect(component.trainingRegisters.length).toBe(6);
    expect(component.trainingReports.length).toBe(3);
    expect(component.activeTrainersCount).toBe(6);
    expect(component.selectedTab).toBe('registers');
  });

  it('should calculate statistics correctly', () => {
    component.ngOnInit();
    
    expect(component.totalSessions).toBe(6);
    expect(component.totalParticipants).toBe(158); // Sum of all participants
    expect(component.averageAttendanceRate).toBeGreaterThan(0);
  });

  it('should switch tabs correctly', () => {
    component.selectTab('reports');
    expect(component.selectedTab).toBe('reports');
    
    component.selectTab('registers');
    expect(component.selectedTab).toBe('registers');
  });

  it('should handle view register action', () => {
    const mockRegister = component.trainingRegisters[0];
    component.viewRegister(mockRegister);
    
    expect(mockToastr.info).toHaveBeenCalledWith(
      `Viewing register for: ${mockRegister.sessionTitle}`, 
      'Training Register'
    );
  });

  it('should handle download register action', () => {
    const mockRegister = component.trainingRegisters[0];
    component.downloadRegister(mockRegister);
    
    expect(mockToastr.success).toHaveBeenCalledWith(
      `Downloading ${mockRegister.registerFile}`, 
      'Download Started'
    );
  });

  it('should handle generate report action', () => {
    component.generateReport('Monthly');
    
    expect(mockToastr.info).toHaveBeenCalledWith(
      'Generating Monthly report...', 
      'Report Generation'
    );
  });
});
