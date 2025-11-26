import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DynamicGridComponent } from './components/dynamic-grid/dynamic-grid.component';
import { TechSupportComponent } from './components/tech-support/tech-support.component';
import { PopupPreviewComponent } from './components/popup-preview/popup-preview.component';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from "primeng/button";
import { LottieModule } from 'ngx-lottie';

// Import PopupPreviewService only - other services are provided globally in CoreModule
import { PopupPreviewService } from '../services/popup-preview/popup-preview.service';

export function playerFactory(): any {
    return import('lottie-web');
}

@NgModule({
    declarations: [
        DynamicGridComponent,
        TechSupportComponent,
        PopupPreviewComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        MultiSelectModule,
        TableModule,
        CheckboxModule,
        ToolbarModule,
        MenuModule,
        PaginatorModule,
        ButtonModule,
        LottieModule.forRoot({ player: playerFactory })
    ],
    exports: [
        DynamicGridComponent,
        TechSupportComponent,
        PopupPreviewComponent,
        // Re-export PrimeNG modules for convenience
        CommonModule,
        RouterModule,
        FormsModule,
        TableModule,
        MultiSelectModule,
        CheckboxModule,
        MenuModule,
        ToolbarModule,
        PaginatorModule,
        ButtonModule
    ],
    providers: [
        PopupPreviewService
    ]
})
export class SharedModule { }
