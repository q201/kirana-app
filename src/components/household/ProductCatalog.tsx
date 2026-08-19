import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, Minus, Tag } from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const { products, cart, addToCart, updateCartQuantity, activeStore, languageMode } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Staples',
    'Pulses',
    'Oils',
    'Oils/Sweeteners',
    'Spices',
    'Beverages',
    'Snacks',
    'Personal Care',
    'Cleaning'
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.item_name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.item_name_hi.includes(searchQuery) ||
      product.item_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCartQuantity = (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>{languageMode === 'hi' ? 'मोहल्ला स्टोर कैटलॉग' : 'Mohalla Store Catalog'}</span>
              <span className="text-xs font-normal text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {activeStore.name}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {languageMode === 'hi'
                ? 'घर की डिलीवरी के लिए आवश्यक सामान ऑर्डर करें'
                : 'Order daily household essentials for neighborhood home delivery'}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={languageMode === 'hi' ? "खोजें (आटा, चावल, दाल, तेल)..." : "Search Atta, Rice, Dal, Oil..."}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => {
          const qty = getCartQuantity(product.id);
          const primaryName = languageMode === 'hi' ? product.item_name_hi : product.item_name_en;
          const secondaryName = languageMode === 'hi' ? product.item_name_en : product.item_name_hi;

          return (
            <div
              key={product.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-xl group relative"
            >
              <div>
                {/* Product Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-slate-950 border border-slate-800/80">
                  <img
                    src={product.image}
                    alt={product.item_name_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Item Code Badge */}
                  <span className="absolute top-2 left-2 bg-slate-950/90 backdrop-blur text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{product.item_code}</span>
                  </span>
                </div>

                {/* Category & Name */}
                <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">
                  {product.category}
                </div>
                <h3 className="font-bold text-sm text-white leading-snug">
                  {primaryName}
                </h3>
                <div className="text-xs text-amber-300 font-semibold mb-1">
                  {secondaryName}
                </div>
                <div className="text-[11px] text-slate-400 mb-3">Unit: {product.unit}</div>
              </div>

              {/* Price & Quantity Controls */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 leading-none">Rate</div>
                  <div className="text-sm font-black text-emerald-400">₹{product.price.toFixed(1)}</div>
                </div>

                {qty === 0 ? (
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-bold rounded-xl text-xs border border-amber-500/30 flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{languageMode === 'hi' ? 'जोड़ें' : 'ADD'}</span>
                  </button>
                ) : (
                  <div className="flex items-center bg-slate-950 rounded-xl border border-amber-500/40 p-1">
                    <button
                      onClick={() => updateCartQuantity(product.id, qty - 1)}
                      className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-amber-400">{qty}</span>
                    <button
                      onClick={() => updateCartQuantity(product.id, qty + 1)}
                      className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
