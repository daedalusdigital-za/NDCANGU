import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTestsComponent } from './list-tests/list-tests.component';
import { AddTestsComponent } from './add-tests/add-tests.component';
import { TestsRoutingModule } from './tests-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ListTestsComponent,
    AddTestsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TestsRoutingModule
  ]
})
export class TestsModule { }
