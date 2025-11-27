import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../../services/inventory/inventory.service';
import { InventoryStats, InventoryCategory, InventoryStatus, InventoryItem } from '../../../shared/interfaces/common.interfaces';

interface CategoryStats {
  category: InventoryCategory;
  categoryText: string;
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  averageValue: number;
}

interface StatusStats {
  status: InventoryStatus;
  statusText: string;
  count: number;
  percentage: number;
  value: number;
}

@Component({
  selector: 'app-inventory-stats',
  templateUrl: './inventory-stats.component.html',
  styleUrls: ['./inventory-stats.component.scss']
})
export class InventoryStatsComponent implements OnInit {
  loading = true;
  stats?: InventoryStats;
  inventoryItems: InventoryItem[] = [];

  // Computed statistics
  categoryStats: CategoryStats[] = [];
  statusStats: StatusStats[] = [];
  topLowStockItems: InventoryItem[] = [];
  topValueItems: InventoryItem[] = [];

  // Chart data (for potential future chart integration)
  categoryChartData: any[] = [];
  statusChartData: any[] = [];

  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadInventoryStats();
  }

  private loadInventoryStats(): void {
    this.loading = true;

    // Load both stats and items for detailed analysis
    Promise.all([
      this.inventoryService.getInventoryStats().toPromise(),
      this.inventoryService.getAllItems().toPromise()
    ]).then(([stats, items]) => {
      this.stats = stats;
      this.inventoryItems = items || [];
      this.calculateDetailedStats();
      this.loading = false;
    }).catch(error => {
      console.error('Error loading inventory statistics:', error);
      this.toastr.error('Failed to load inventory statistics');
      this.loading = false;
    });
  }

  private calculateDetailedStats(): void {
    if (!this.inventoryItems.length) {
      this.resetStats();
      return;
    }

    this.calculateCategoryStats();
    this.calculateStatusStats();
    this.calculateTopItems();
    this.prepareChartData();
  }

  private resetStats(): void {
    this.categoryStats = [];
    this.statusStats = [];
    this.topLowStockItems = [];
    this.topValueItems = [];
    this.categoryChartData = [];
    this.statusChartData = [];
  }

  private calculateCategoryStats(): void {
    const categoryMap = new Map<InventoryCategory, CategoryStats>();

    // Initialize category stats
    Object.values(InventoryCategory).forEach(category => {
      if (typeof category === 'number') {
        categoryMap.set(category, {
          category,
          categoryText: this.getCategoryText(category),
          totalItems: 0,
          totalValue: 0,
          lowStockItems: 0,
          averageValue: 0
        });
      }
    });

    // Calculate stats for each category
    this.inventoryItems.forEach(item => {
      const categoryStats = categoryMap.get(item.category);
      if (categoryStats) {
        categoryStats.totalItems++;
        categoryStats.totalValue += item.unitPrice * item.stockAvailable;

        if (this.isLowStock(item)) {
          categoryStats.lowStockItems++;
        }
      }
    });

    // Calculate averages and convert to array
    this.categoryStats = Array.from(categoryMap.values()).map(stats => ({
      ...stats,
      averageValue: stats.totalItems > 0 ? stats.totalValue / stats.totalItems : 0
    })).filter(stats => stats.totalItems > 0); // Only include categories with items
  }

  private calculateStatusStats(): void {
    const statusMap = new Map<InventoryStatus, StatusStats>();
    const totalItems = this.inventoryItems.length;

    // Initialize status stats
    Object.values(InventoryStatus).forEach(status => {
      if (typeof status === 'number') {
        statusMap.set(status, {
          status,
          statusText: this.getStatusText(status),
          count: 0,
          percentage: 0,
          value: 0
        });
      }
    });

    // Calculate stats for each status
    this.inventoryItems.forEach(item => {
      const statusStats = statusMap.get(item.status);
      if (statusStats) {
        statusStats.count++;
        statusStats.value += item.unitPrice * item.stockAvailable;
      }
    });

    // Calculate percentages and convert to array
    this.statusStats = Array.from(statusMap.values()).map(stats => ({
      ...stats,
      percentage: totalItems > 0 ? (stats.count / totalItems) * 100 : 0
    })).filter(stats => stats.count > 0); // Only include statuses with items
  }

  private calculateTopItems(): void {
    // Top 5 low stock items (lowest stock relative to minimum)
    this.topLowStockItems = this.inventoryItems
      .filter(item => this.isLowStock(item) && item.status === InventoryStatus.Active)
      .sort((a, b) => {
        const aRatio = a.stockAvailable / Math.max(a.reorderLevel, 1);
        const bRatio = b.stockAvailable / Math.max(b.reorderLevel, 1);
        return aRatio - bRatio;
      })
      .slice(0, 5);

    // Top 5 highest value items (by total stock value)
    this.topValueItems = this.inventoryItems
      .filter(item => item.status === InventoryStatus.Active)
      .sort((a, b) => (b.unitPrice * b.stockAvailable) - (a.unitPrice * a.stockAvailable))
      .slice(0, 5);
  }

  private prepareChartData(): void {
    // Prepare data for category chart
    this.categoryChartData = this.categoryStats.map(stats => ({
      name: stats.categoryText,
      value: stats.totalValue,
      count: stats.totalItems
    }));

    // Prepare data for status chart
    this.statusChartData = this.statusStats.map(stats => ({
      name: stats.statusText,
      value: stats.count,
      percentage: stats.percentage
    }));
  }

  private isLowStock(item: InventoryItem): boolean {
    return item.stockAvailable <= item.reorderLevel;
  }

  getCategoryText(category: InventoryCategory): string {
    const categoryTexts: Record<number, string> = {
      [InventoryCategory.MedicalSupplies]: 'Medical Supplies',
      [InventoryCategory.Consumables]: 'Consumables',
      [InventoryCategory.Equipment]: 'Equipment',
      [InventoryCategory.Pharmaceuticals]: 'Pharmaceuticals',
      [InventoryCategory.Other]: 'Other'
    };
    return categoryTexts[category] || 'Unknown';
  }

  private getStatusText(status: InventoryStatus): string {
    const statusTexts: Record<number, string> = {
      [InventoryStatus.Active]: 'Active',
      [InventoryStatus.Inactive]: 'Inactive',
      [InventoryStatus.Discontinued]: 'Discontinued'
    };
    return statusTexts[status] || 'Unknown';
  }

  getStatusClass(status: InventoryStatus): string {
    const statusClasses: Record<number, string> = {
      [InventoryStatus.Active]: 'status-active',
      [InventoryStatus.Inactive]: 'status-inactive',
      [InventoryStatus.Discontinued]: 'status-discontinued'
    };
    return statusClasses[status] || '';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-ZA').format(value);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  refresh(): void {
    this.loadInventoryStats();
  }

  navigateToLowStock(): void {
    // Navigate to inventory list with low stock filter
    // This would be implemented with router navigation
    console.log('Navigate to low stock items');
  }

  navigateToCategory(category: InventoryCategory): void {
    // Navigate to inventory list filtered by category
    console.log('Navigate to category:', category);
  }

  exportStats(): void {
    // Export statistics to CSV or Excel
    console.log('Export statistics');
    this.toastr.info('Export functionality coming soon!');
  }

  /**
   * Calculate average item value
   */
  get averageItemValue(): number {
    if (!this.stats || !this.stats.totalItems || this.stats.totalItems === 0) {
      return 0;
    }
    return this.stats.totalValue / this.stats.totalItems;
  }
}
