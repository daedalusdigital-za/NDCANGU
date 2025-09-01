export interface TenderChild {
  'tender-child-id': number;
  quantity: number;
  part_catalogue?: {
    'cat-number': string;
    description: string;
  };
}

export interface Tender {
  'tender-number': string;
  'due-date': string;
  tender_children?: TenderChild[];
}

export interface Organization {
  id: number;
  'organization-name': string;
}

export interface PurchaseOrder {
  'order-id': number;
  'purchase-order-number': string;
  order_parent?: {
    'purchase-order-number': string;
    'order-id': number;
  };
}

export interface BidData {
  'tender-number': string;
  'tender-Detail': string;
  'tender-child-id': number;
  'local-agent-id': number | null;
  'principal-id': number | null;
  'manufacturer-id': number | null;
  'currency-id': number | null;
  'cost-price-per-unit': number | null;
  'suggested-price-per-unit': number | null;
  'price-per-unit': number | null;
  'quote-validity': number | null;
  'extended-to': string | null;
  'bid-status': number | null;
  'acceptance-date': string | null;
  'order-id': string | null;
  'item-shipped': number | null;
  amount: number | null;
  amount_pkr: number | null;
  remarks: string;
  'client-token': string;
}

export interface BidFormData {
  data: BidData[];
}

export interface Currency {
  id: number;
  name: string;
  code: string;
}

export interface BidStatus {
  id: number;
  name: string;
}

export interface QuoteValidity {
  value: number;
  label: string;
}

export interface ItemShipped {
  value: number;
  label: string;
}