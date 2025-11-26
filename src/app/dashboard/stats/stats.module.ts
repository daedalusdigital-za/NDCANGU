import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StatsRoutingModule } from './stats-routing.module';
import { AddStatsComponent } from './add-stats/add-stats.component';
import { ListStatsComponent } from './list-stats/list-stats.component';

/**
 * StatsModule
 *
 * Feature module for statistics and document upload functionality.
 * Consolidates add-stats and list-stats components.
 */
@NgModule({
  declarations: [
    AddStatsComponent,
    ListStatsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StatsRoutingModule
  ]
})
export class StatsModule { }
