import { IdempotencyLog, Order } from '../types';

class IdempotencyEngine {
  private cache: Map<string, IdempotencyLog> = new Map();
  private logs: IdempotencyLog[] = [];

  public generateKey(): string {
    return 'idemp_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
  }

  public processOrderRequest(
    key: string,
    orderPayload: Partial<Order>,
    simulateNetworkDrop: boolean = false
  ): { success: boolean; isCached: boolean; order?: Order; error?: string; log: IdempotencyLog } {
    
    // Check if key exists in Redis/Memory cache
    if (this.cache.has(key)) {
      const existing = this.cache.get(key)!;
      const updatedLog: IdempotencyLog = {
        ...existing,
        status: 'cached',
        timestamp: new Date().toLocaleTimeString()
      };
      
      this.logs.unshift(updatedLog);
      return {
        success: true,
        isCached: true,
        order: existing.responsePayload.order,
        log: updatedLog
      };
    }

    if (simulateNetworkDrop) {
      const failedLog: IdempotencyLog = {
        idempotencyKey: key,
        timestamp: new Date().toLocaleTimeString(),
        status: 'processing',
        orderId: 'FAILED_NETWORK_TIMEOUT',
        requestBody: orderPayload,
        responsePayload: { error: 'Network Connection Timeout 504 (Simulated Drop)' }
      };
      return {
        success: false,
        isCached: false,
        error: 'Network Timeout (504). Please retry with same Idempotency Key.',
        log: failedLog
      };
    }

    // Process new order
    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: orderId,
      idempotencyKey: key,
      customerName: orderPayload.customerName || 'Neighborhood Customer',
      customerPhone: orderPayload.customerPhone || '+91 99887 76655',
      address: orderPayload.address || 'House #42, Lane 3, Mohalla',
      items: orderPayload.items || [],
      totalAmount: orderPayload.totalAmount || 0,
      paymentMethod: orderPayload.paymentMethod || 'khata',
      paymentStatus: orderPayload.paymentMethod === 'khata' ? 'added_to_khata' : 'paid',
      status: 'pending',
      orderType: orderPayload.orderType || 'standard',
      createdAt: 'Just now',
      idempotentRetryCount: 0
    };

    const logEntry: IdempotencyLog = {
      idempotencyKey: key,
      timestamp: new Date().toLocaleTimeString(),
      status: 'new_creation',
      orderId: newOrder.id,
      requestBody: orderPayload,
      responsePayload: { status: 201, order: newOrder }
    };

    this.cache.set(key, logEntry);
    this.logs.unshift(logEntry);

    return {
      success: true,
      isCached: false,
      order: newOrder,
      log: logEntry
    };
  }

  public getLogs(): IdempotencyLog[] {
    return this.logs;
  }
}

export const idempotencyEngine = new IdempotencyEngine();
