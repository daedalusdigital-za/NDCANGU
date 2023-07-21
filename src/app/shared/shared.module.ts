import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicGridComponent } from './components/dynamic-grid/dynamic-grid.component';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from "primeng/button";
import { LottieModule } from 'ngx-lottie';

export function playerFactory(): any {
    return import('lottie-web');
  }
@NgModule({
    declarations: [
        DynamicGridComponent
    ],
    imports: [
        CommonModule,
        MultiSelectModule,
        FormsModule,
        TableModule,
        CheckboxModule,
        ToolbarModule,
        MenuModule,
        PaginatorModule,
        ButtonModule,
        LottieModule.forRoot({ player: playerFactory })
    ],
    exports: [DynamicGridComponent]
})
export class SharedModule { }