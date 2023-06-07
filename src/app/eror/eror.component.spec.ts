import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErorComponent } from './eror.component';

describe('ErorComponent', () => {
  let component: ErorComponent;
  let fixture: ComponentFixture<ErorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
