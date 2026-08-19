import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { idempotencyKey, customerName, customerPhone, address, items, totalAmount, paymentMethod, orderType } = await req.json();

    if (!idempotencyKey || !items || items.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required order fields or items array' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // 1. Check idempotency cache
    const { data: existingOrder } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('idempotency_key', idempotencyKey)
      .single();

    if (existingOrder) {
      return new Response(
        JSON.stringify({ success: true, isCached: true, order: existingOrder }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 2. Insert new order
    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: orderId,
      idempotency_key: idempotencyKey,
      customer_name: customerName || 'Sunita Sharma',
      customer_phone: customerPhone || '+91 99887 76655',
      address: address || 'House #42, Lane 3, Pocket B, Sarita Vihar',
      items,
      total_amount: totalAmount,
      payment_method: paymentMethod || 'khata',
      payment_status: paymentMethod === 'khata' ? 'added_to_khata' : 'pending',
      status: 'accepted',
      order_type: orderType || 'standard',
      assigned_delivery_boy: 'db-1'
    };

    const { data: insertedOrder, error: insertError } = await supabaseClient
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // 3. Create Khata Ledger Entry if paymentMethod === 'khata'
    if (paymentMethod === 'khata') {
      await supabaseClient.from('khata_entries').insert([{
        id: 'kh-' + Date.now(),
        customer_id: 'cust_42',
        customer_name: customerName || 'Sunita Sharma',
        customer_phone: customerPhone || '+91 99887 76655',
        order_id: orderId,
        date: new Date().toISOString().split('T')[0],
        description: `${(orderType || 'standard').replace('_', ' ').toUpperCase()} Order (${orderId})`,
        amount: totalAmount,
        type: 'debit',
        balance_after: 330 + totalAmount,
        items_summary: items.map((i: any) => `${i.productName} x${i.quantity}`).join(', ')
      }]);
    }

    return new Response(
      JSON.stringify({ success: true, isCached: false, order: insertedOrder }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
