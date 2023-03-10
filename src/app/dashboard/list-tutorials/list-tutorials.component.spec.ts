import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTutorialsComponent } from './list-tutorials.component';

describe('ListTutorialsComponent', () => {
  let component: ListTutorialsComponent;
  let fixture: ComponentFixture<ListTutorialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTutorialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTutorialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
