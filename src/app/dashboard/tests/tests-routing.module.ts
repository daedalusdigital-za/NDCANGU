import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTestsComponent } from './add-tests/add-tests.component';
import { ListTestsComponent } from './list-tests/list-tests.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListTestsComponent
      },
      {
        path: 'add',
        component: AddTestsComponent
      },
      { path: '', redirectTo: '', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestsRoutingModule { }
