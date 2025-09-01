import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { 
  Tender, 
  Organization, 
  PurchaseOrder, 
  BidFormData, 
  Currency, 
  BidStatus, 
  QuoteValidity,
  ItemShipped
} from '../interfaces/bid.interfaces';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  private readonly baseUrl = '/api'; // This would be configured based on your backend

  constructor(private http: HttpClient) { }

  // Mock data for development - replace with actual API calls
  private mockTenders: Tender[] = [
    {
      'tender-number': 'TND-2024-001',
      'due-date': '2024-12-31',
      tender_children: [{
        'tender-child-id': 1,
        quantity: 100,
        part_catalogue: {
          'cat-number': 'CAT-001',
          description: 'Medical Equipment Component'
        }
      }]
    },
    {
      'tender-number': 'TND-2024-002',
      'due-date': '2024-11-30',
      tender_children: [{
        'tender-child-id': 2,
        quantity: 50,
        part_catalogue: {
          'cat-number': 'CAT-002',
          description: 'Surgical Instrument'
        }
      }]
    }
  ];

  private mockOrganizations: Organization[] = [
    { id: 1, 'organization-name': 'MedTech Solutions' },
    { id: 2, 'organization-name': 'Healthcare Innovations' },
    { id: 3, 'organization-name': 'Global Medical Supply' },
    { id: 4, 'organization-name': 'Advanced Surgical Equipment' }
  ];

  private mockPurchaseOrders: PurchaseOrder[] = [
    {
      'order-id': 1,
      'purchase-order-number': 'PO-2024-001',
      order_parent: {
        'purchase-order-number': 'PO-2024-001',
        'order-id': 1
      }
    },
    {
      'order-id': 2,
      'purchase-order-number': 'PO-2024-002',
      order_parent: {
        'purchase-order-number': 'PO-2024-002',
        'order-id': 2
      }
    }
  ];

  searchTenders(query: string): Observable<Tender[]> {
    // In a real app, this would be an HTTP call
    // return this.http.get<Tender[]>(`${this.baseUrl}/search-tender.list`, { params: { query } });
    
    const filtered = this.mockTenders.filter(tender => 
      tender['tender-number'].toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered);
  }

  searchOrganizations(query: string): Observable<Organization[]> {
    // In a real app, this would be an HTTP call
    // return this.http.get<Organization[]>(`${this.baseUrl}/search-organization.list`, { params: { query } });
    
    const filtered = this.mockOrganizations.filter(org => 
      org['organization-name'].toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered);
  }

  searchPurchaseOrders(query: string): Observable<PurchaseOrder[]> {
    // In a real app, this would be an HTTP call
    // return this.http.get<PurchaseOrder[]>(`${this.baseUrl}/search-po.list`, { params: { query } });
    
    const filtered = this.mockPurchaseOrders.filter(po => 
      po.order_parent?.['purchase-order-number'].toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered);
  }

  storeBid(bidData: BidFormData): Observable<any> {
    // In a real app, this would be an HTTP call
    // return this.http.post(`${this.baseUrl}/store-bid`, bidData);
    
    console.log('Storing bid data:', bidData);
    return of({ success: 'Bid saved successfully!' });
  }

  getCurrencies(): Currency[] {
    return [
      { id: 1, name: 'USD', code: 'USD' },
      { id: 2, name: 'EURO', code: 'EUR' },
      { id: 3, name: 'RMB', code: 'CNY' },
      { id: 4, name: 'PKR', code: 'PKR' },
      { id: 5, name: 'JPY', code: 'JPY' },
      { id: 6, name: 'CHF', code: 'CHF' },
      { id: 7, name: 'GBP', code: 'GBP' }
    ];
  }

  getQuoteValidityOptions(): QuoteValidity[] {
    return [
      { value: 60, label: '60 Days' },
      { value: 90, label: '90 Days' },
      { value: 120, label: '120 Days' },
      { value: 150, label: '150 Days' },
      { value: 180, label: '180 Days' }
    ];
  }

  getBidStatuses(): BidStatus[] {
    return [
      { id: 1, name: 'Lowest Open' },
      { id: 2, name: 'Highest Open' },
      { id: 3, name: 'Oder To' },
      { id: 4, name: 'Height Us' },
      { id: 5, name: 'Height Else' },
      { id: 6, name: 'Did Not Quote' },
      { id: 7, name: 'Refused Acceptance' },
      { id: 8, name: 'Offer Ignored' },
      { id: 9, name: 'Acceptance Issued' },
      { id: 10, name: 'No Status' },
      { id: 11, name: 'Item Filed' }
    ];
  }

  getItemShippedOptions(): ItemShipped[] {
    return [
      { value: 1, label: 'Yes' },
      { value: 0, label: 'No' },
      { value: 2, label: 'Partial' }
    ];
  }
}