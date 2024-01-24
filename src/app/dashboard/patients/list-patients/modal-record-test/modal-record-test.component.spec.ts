import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRecordTestComponent } from './modal-record-test.component';

describe('ModalRecordTestComponent', () => {
  let component: ModalRecordTestComponent;
  let fixture: ComponentFixture<ModalRecordTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRecordTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRecordTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
