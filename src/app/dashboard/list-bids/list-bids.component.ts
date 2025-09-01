import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-bids',
  templateUrl: './list-bids.component.html',
  styleUrls: ['./list-bids.component.scss']
})
export class ListBidsComponent implements OnInit {

  mockBids = [
    {
      id: 1,
      tenderNumber: 'TND-2024-001',
      localAgent: 'MedTech Solutions',
      principal: 'Healthcare Innovations',
      manufacturer: 'Global Medical Supply',
      quotedPrice: 15000,
      currency: 'USD',
      bidStatus: 'Lowest Open',
      acceptanceDate: '2024-01-15'
    },
    {
      id: 2,
      tenderNumber: 'TND-2024-002',
      localAgent: 'Advanced Surgical Equipment',
      principal: 'MedTech Solutions',
      manufacturer: 'Healthcare Innovations',
      quotedPrice: 25000,
      currency: 'EUR',
      bidStatus: 'Pending Review',
      acceptanceDate: null
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  editBid(bid: any): void {
    // Navigate to edit mode
    console.log('Edit bid:', bid);
  }

  deleteBid(bid: any): void {
    // Delete bid
    console.log('Delete bid:', bid);
  }

}
