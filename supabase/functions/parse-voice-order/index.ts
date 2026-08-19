import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HINDI_NUMBER_MAP: Record<string, number> = {
  'ek': 1, 'one': 1, 'do': 2, 'two': 2, 'teen': 3, 'three': 3,
  'chaar': 4, 'four': 4, 'paanch': 5, 'five': 5, 'chhe': 6, 'six': 6,
  'saat': 7, 'seven': 7, 'aath': 8, 'eight': 8, 'nau': 9, 'nine': 9,
  'das': 10, 'ten': 10, 'aadha': 0.5, 'half': 0.5, 'dhai': 2.5
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { transcript } = await req.json();
    if (!transcript || typeof transcript !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Voice transcript string required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const normalized = transcript.toLowerCase();
    const parsedEntities = [];

    // Key catalog entity matchers
    const catalogPatterns = [
      { name: 'Wheat Atta', hindiName: 'गेहूं का आटा', price: 37, keywords: ['atta', 'aata', 'flour', 'गेहूं'] },
      { name: 'Basmati Rice', hindiName: 'बासमती चावल', price: 110, keywords: ['rice', 'chawal', 'basmati', 'चावल'] },
      { name: 'Mustard Oil', hindiName: 'सरसों का तेल', price: 145, keywords: ['mustard oil', 'sarso', 'sarson', 'oil', 'tel', 'तेल'] },
      { name: 'Toor Dal', hindiName: 'अरहर दाल', price: 150, keywords: ['toor dal', 'arhar dal', 'dal', 'दाल'] },
      { name: 'Besan', hindiName: 'बेसन', price: 82.5, keywords: ['besan', ' gram flour', 'बेसन'] }
    ];

    for (const item of catalogPatterns) {
      let matched = false;
      let matchedKeyword = '';

      for (const kw of item.keywords) {
        if (normalized.includes(kw)) {
          matched = true;
          matchedKeyword = kw;
          break;
        }
      }

      if (matched) {
        let quantity = 1;
        // Check for numeric quantity or Hindi word quantity
        const numMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(kg|kilo|litre|l|packet|pkt)?/i);
        if (numMatch && numMatch[1]) {
          quantity = parseFloat(numMatch[1]);
        } else {
          for (const [w, val] of Object.entries(HINDI_NUMBER_MAP)) {
            if (normalized.includes(w)) {
              quantity = val;
              break;
            }
          }
        }

        parsedEntities.push({
          productName: item.name,
          hindiName: item.hindiName,
          price: item.price,
          quantity,
          matchedKeyword,
          confidence: 0.96
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, transcript, parsedEntities }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
