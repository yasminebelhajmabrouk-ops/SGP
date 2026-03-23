import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableauBordRoutingModule } from './tableau-bord-routing.module';
import { DashboardComponent } from './components/dashboard.component';
import { DashboardService } from './services/dashboard.service';

@NgModule({
  imports: [CommonModule, TableauBordRoutingModule, DashboardComponent],
  providers: [DashboardService]
})
export class TableauBordModule {}
