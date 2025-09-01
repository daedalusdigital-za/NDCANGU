import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BidService } from '../../shared/services/bid.service';
import { 
  Tender, 
  Organization, 
  PurchaseOrder, 
  Currency, 
  BidStatus, 
  QuoteValidity,
  ItemShipped,
  BidFormData
} from '../../shared/interfaces/bid.interfaces';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-bid-management',
  templateUrl: './bid-management.component.html',
  styleUrls: ['./bid-management.component.scss']
})
export class BidManagementComponent implements OnInit {
  bidForm!: FormGroup;
  
  // Autocomplete data
  tenderSuggestions: Tender[] = [];
  organizationSuggestions: Organization[] = [];
  poSuggestions: PurchaseOrder[] = [];
  
  // Dropdown data
  currencies: Currency[] = [];
  bidStatuses: BidStatus[] = [];
  quoteValidityOptions: QuoteValidity[] = [];
  itemShippedOptions: ItemShipped[] = [];
  
  // Search subjects for debouncing
  private tenderSearchSubject = new Subject<string>();
  private organizationSearchSubject = new Subject<string>();
  private poSearchSubject = new Subject<string>();
  
  // UI state
  showTenderSuggestions = false;
  showLocalAgentSuggestions = false;
  showPrincipalSuggestions = false;
  showManufacturerSuggestions = false;
  showPoSuggestions = false;
  
  // Active search type for organization search
  activeOrgSearchType: 'local-agent' | 'principal' | 'manufacturer' | null = null;

  constructor(
    private fb: FormBuilder,
    private bidService: BidService
  ) {
    this.initializeForm();
    this.setupAutocomplete();
  }

  ngOnInit(): void {
    this.loadDropdownData();
  }

  private initializeForm(): void {
    this.bidForm = this.fb.group({
      // Tender fields
      tenderItemQty: ['', Validators.required],
      tenderChildId: [''],
      tenderDetail: [''],
      manufacturerId: [''],
      
      // Organization fields
      localAgent: [''],
      localAgentId: [''],
      principal: [''],
      principalId: [''],
      manufacturer: [''],
      manufacturerIdField: [''],
      
      // Financial fields
      currency: [''],
      costPrice: [''],
      suggestedPrice: [''],
      quotedPrice: [''],
      quoteValidity: [''],
      extendedTo: [''],
      
      // Status and dates
      bidStatus: [''],
      acceptanceDate: [''],
      
      // PO fields
      poNumber: [''],
      orderId: [''],
      
      // Additional fields
      amount: [''],
      amountPkr: [''],
      itemShipped: [''],
      remarks: ['']
    });
  }

  private setupAutocomplete(): void {
    // Tender search
    this.tenderSearchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => query ? this.bidService.searchTenders(query) : [])
      )
      .subscribe(results => {
        this.tenderSuggestions = results;
        this.showTenderSuggestions = results.length > 0;
      });
    
    // Organization search
    this.organizationSearchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => query ? this.bidService.searchOrganizations(query) : [])
      )
      .subscribe(results => {
        this.organizationSuggestions = results;
        this.updateOrgSuggestionVisibility(results.length > 0);
      });
    
    // PO search
    this.poSearchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => query ? this.bidService.searchPurchaseOrders(query) : [])
      )
      .subscribe(results => {
        this.poSuggestions = results;
        this.showPoSuggestions = results.length > 0;
      });
  }

  private loadDropdownData(): void {
    this.currencies = this.bidService.getCurrencies();
    this.bidStatuses = this.bidService.getBidStatuses();
    this.quoteValidityOptions = this.bidService.getQuoteValidityOptions();
    this.itemShippedOptions = this.bidService.getItemShippedOptions();
  }

  // Helper methods for input event handling
  onTenderInputChange(event: any): void {
    const value = event.target?.value || '';
    this.onTenderSearch(value);
  }

  onOrganizationInputChange(event: any, type: 'local-agent' | 'principal' | 'manufacturer'): void {
    const value = event.target?.value || '';
    this.onOrganizationSearch(value, type);
  }

  onPoInputChange(event: any): void {
    const value = event.target?.value || '';
    this.onPoSearch(value);
  }

  // Tender autocomplete methods
  onTenderSearch(query: string): void {
    if (query.trim()) {
      this.tenderSearchSubject.next(query);
    } else {
      this.tenderSuggestions = [];
      this.showTenderSuggestions = false;
    }
  }

  selectTender(tender: Tender): void {
    const firstChild = tender.tender_children?.[0];
    if (firstChild) {
      const suggestionText = `${tender['tender-number']} | Due: ${tender['due-date']} | Qty: ${firstChild.quantity} | Cat#: ${firstChild.part_catalogue?.['cat-number']} | Desc: ${firstChild.part_catalogue?.description}`;
      
      this.bidForm.patchValue({
        tenderItemQty: suggestionText,
        tenderChildId: firstChild['tender-child-id'],
        tenderDetail: tender['tender-number']
      });
    }
    
    this.showTenderSuggestions = false;
  }

  // Organization autocomplete methods
  onOrganizationSearch(query: string, type: 'local-agent' | 'principal' | 'manufacturer'): void {
    this.activeOrgSearchType = type;
    if (query.trim()) {
      this.organizationSearchSubject.next(query);
    } else {
      this.organizationSuggestions = [];
      this.hideAllOrgSuggestions();
    }
  }

  selectOrganization(org: Organization): void {
    if (this.activeOrgSearchType === 'local-agent') {
      this.bidForm.patchValue({
        localAgent: org['organization-name'],
        localAgentId: org.id
      });
    } else if (this.activeOrgSearchType === 'principal') {
      this.bidForm.patchValue({
        principal: org['organization-name'],
        principalId: org.id
      });
    } else if (this.activeOrgSearchType === 'manufacturer') {
      this.bidForm.patchValue({
        manufacturer: org['organization-name'],
        manufacturerIdField: org.id
      });
    }
    
    this.hideAllOrgSuggestions();
  }

  // PO autocomplete methods
  onPoSearch(query: string): void {
    if (query.trim()) {
      this.poSearchSubject.next(query);
    } else {
      this.poSuggestions = [];
      this.showPoSuggestions = false;
    }
  }

  selectPo(po: PurchaseOrder): void {
    const poNumber = po.order_parent?.['purchase-order-number'] || '';
    const orderId = po.order_parent?.['order-id'] || '';
    
    this.bidForm.patchValue({
      poNumber: poNumber,
      orderId: orderId
    });
    
    this.showPoSuggestions = false;
  }

  // Helper methods
  private updateOrgSuggestionVisibility(show: boolean): void {
    if (this.activeOrgSearchType === 'local-agent') {
      this.showLocalAgentSuggestions = show;
    } else if (this.activeOrgSearchType === 'principal') {
      this.showPrincipalSuggestions = show;
    } else if (this.activeOrgSearchType === 'manufacturer') {
      this.showManufacturerSuggestions = show;
    }
  }

  private hideAllOrgSuggestions(): void {
    this.showLocalAgentSuggestions = false;
    this.showPrincipalSuggestions = false;
    this.showManufacturerSuggestions = false;
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showTenderSuggestions = false;
      this.hideAllOrgSuggestions();
      this.showPoSuggestions = false;
    }, 200); // Delay to allow click events to fire
  }

  // Form submission
  onSubmit(): void {
    if (this.bidForm.valid) {
      const formValue = this.bidForm.value;
      
      // Validate required fields
      if (!formValue.tenderDetail && (!formValue.tenderItemQty || formValue.tenderItemQty.trim() === '')) {
        alert('Please select a Tender from the suggestions (click an item) before saving.');
        return;
      }
      
      const tenderChildInt = parseInt(formValue.tenderChildId, 10);
      if (isNaN(tenderChildInt) || tenderChildInt <= 0) {
        alert('Please select the Tender item (ensure you click the suggestion so the item is attached).');
        return;
      }

      // Generate client token
      const clientToken = 'ct_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      
      // Prepare bid data
      const bidData: BidFormData = {
        data: [{
          'tender-number': formValue.tenderItemQty?.trim() || '',
          'tender-Detail': formValue.tenderDetail || formValue.tenderItemQty?.trim() || '',
          'tender-child-id': tenderChildInt,
          'local-agent-id': formValue.localAgentId ? parseInt(formValue.localAgentId, 10) : null,
          'principal-id': formValue.principalId ? parseInt(formValue.principalId, 10) : null,
          'manufacturer-id': formValue.manufacturerIdField ? parseInt(formValue.manufacturerIdField, 10) : null,
          'currency-id': formValue.currency ? parseInt(formValue.currency, 10) : null,
          'cost-price-per-unit': formValue.costPrice ? parseFloat(formValue.costPrice) : null,
          'suggested-price-per-unit': formValue.suggestedPrice ? parseFloat(formValue.suggestedPrice) : null,
          'price-per-unit': formValue.quotedPrice ? parseFloat(formValue.quotedPrice) : null,
          'quote-validity': formValue.quoteValidity ? parseInt(formValue.quoteValidity, 10) : null,
          'extended-to': formValue.extendedTo || null,
          'bid-status': formValue.bidStatus ? parseInt(formValue.bidStatus, 10) : null,
          'acceptance-date': formValue.acceptanceDate || null,
          'order-id': formValue.orderId || formValue.poNumber || null,
          'item-shipped': formValue.itemShipped ? parseInt(formValue.itemShipped, 10) : null,
          amount: formValue.amount ? parseFloat(formValue.amount) : null,
          amount_pkr: formValue.amountPkr ? parseFloat(formValue.amountPkr) : null,
          remarks: (formValue.remarks || '') + (formValue.remarks ? '\n' : '') + '[client-token:' + clientToken + ']',
          'client-token': clientToken
        }]
      };

      // Submit the bid
      this.bidService.storeBid(bidData).subscribe({
        next: (response) => {
          if (response && response.success) {
            alert(response.success);
            this.bidForm.reset();
          } else {
            alert('Saved but no success message returned');
          }
        },
        error: (error) => {
          console.error('Bid save failed', error);
          if (error.status === 422 && error.error && error.error.errors) {
            const errors = error.error.errors;
            let text = '';
            Object.keys(errors).forEach(key => {
              text += errors[key][0] + '\n';
            });
            alert('Validation errors:\n' + text);
          } else {
            alert('Save failed. Please try again.');
          }
        }
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
