/**
 * Shared Order & Payment Types
 *
 * Common data contracts for Orders, Payments, and Transactions
 */

// ============================================================================
// ENUMS
// ============================================================================

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export type PaymentMethod =
  | 'card'
  | 'upi'
  | 'netbanking'
  | 'wallet'
  | 'cod';

export type PaymentGateway =
  | 'razorpay'
  | 'stripe'
  | 'paytm'
  | 'phonepe';

export type TransactionType =
  | 'payment'
  | 'refund'
  | 'commission'
  | 'loyalty_redemption'
  | 'payout';

// ============================================================================
// ADDRESS
// ============================================================================

export interface Address {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

// ============================================================================
// ORDER ITEM
// ============================================================================

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  dealerProductId?: string;

  // Product Snapshot
  productName: string;
  productDescription?: string;
  productImage?: string;

  // Pricing
  unitPrice: number;
  quantity: number;
  discountPercent: number;
  taxPercent: number;
  totalPrice: number;

  // Unit
  unit?: string;

  // Metadata
  specifications?: Record<string, any>;
  createdAt: Date;
}

// ============================================================================
// ORDER
// ============================================================================

export interface Order {
  id: string;
  orderNumber: string;

  // Parties
  userId: string;
  dealerId?: string;
  partnerId?: string;

  // Order Details
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  finalAmount: number;

  // Currency
  currency: string;

  // Shipping Address
  shippingAddress: Address;

  // Billing Address
  billingAddress?: Address;

  // Items
  items: OrderItem[];

  // Tracking
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;

  // Notes
  customerNotes?: string;
  adminNotes?: string;

  // Metadata
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  finalAmount: number;
  itemCount: number;
  createdAt: Date;
}

// ============================================================================
// PAYMENT
// ============================================================================

export interface Payment {
  id: string;
  orderId?: string;
  userId: string;

  // Payment Details
  amount: number;
  currency: string;
  status: PaymentStatus;

  // Payment Gateway
  paymentGateway?: PaymentGateway;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;

  // Payment Method
  paymentMethod?: PaymentMethod;
  paymentMethodDetails?: Record<string, any>;

  // Timestamps
  initiatedAt: Date;
  completedAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;

  // Error Tracking
  errorCode?: string;
  errorMessage?: string;

  // Metadata
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentInitiateRequest {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  returnUrl?: string;
}

export interface PaymentInitiateResponse {
  paymentId: string;
  gatewayOrderId: string;
  amount: number;
  currency: string;
  gatewayKey?: string; // For Razorpay
  checkoutUrl?: string; // For redirect-based flows
}

export interface PaymentVerifyRequest {
  paymentId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
}

// ============================================================================
// TRANSACTION
// ============================================================================

export interface Transaction {
  id: string;
  userId: string;
  orderId?: string;
  paymentId?: string;

  // Transaction Details
  transactionType: TransactionType;
  amount: number;
  currency: string;

  // Balance Tracking
  balanceBefore?: number;
  balanceAfter?: number;

  // Description
  description?: string;
  referenceNumber?: string;

  // Status
  status: string;

  // Metadata
  metadata?: Record<string, any>;
  createdAt: Date;
}

// ============================================================================
// ORDER CREATION
// ============================================================================

export interface CreateOrderItem {
  productId?: string;
  dealerProductId?: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
  items: CreateOrderItem[];
  dealerId?: string;
  partnerId?: string;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  customerNotes?: string;
  couponCode?: string;
  useLoyaltyPoints?: boolean;
  loyaltyPointsToUse?: number;
}

export interface CreateOrderResponse {
  order: Order;
  payment: PaymentInitiateResponse;
}

// ============================================================================
// ORDER TRACKING
// ============================================================================

export interface OrderTrackingEvent {
  status: OrderStatus;
  description: string;
  location?: string;
  timestamp: Date;
}

export interface OrderTracking {
  orderId: string;
  orderNumber: string;
  currentStatus: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  events: OrderTrackingEvent[];
}

// ============================================================================
// ORDER FILTERS
// ============================================================================

export interface OrderFilters {
  status?: OrderStatus | OrderStatus[];
  userId?: string;
  dealerId?: string;
  partnerId?: string;
  fromDate?: Date;
  toDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

// ============================================================================
// ADMIN ORDER UPDATE
// ============================================================================

export interface AdminOrderUpdate {
  status?: OrderStatus;
  trackingNumber?: string;
  adminNotes?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
}
