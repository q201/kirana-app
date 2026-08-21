import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_HANDWRITTEN_LISTS } from '../../data/mockData';
import { scanHandwrittenListOCR, OCRScanResult } from '../../utils/ocrSimulator';
import { ParsedItemResult } from '../../utils/speechParser';
import {
  Camera,
  FileText,
  Upload,
  CheckCircle2,
  ShoppingCart,
  Send,
  X,
  Sparkles,
  Image as ImageIcon,
  Plus,
  Minus,
  Trash2,
  ScanLine,
  Sliders,
  Sun,
  Zap,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PhotoOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCartModal: () => void;
  onRequireAuth: () => void;
}

export const PhotoOrderModal: React.FC<PhotoOrderModalProps> = ({
  isOpen,
  onClose,
  onOpenCartModal,
  onRequireAuth
}) => {
  const { addToCart, placeOrder, activeStore, userProfile } = useApp();

  const [selectedListIndex, setSelectedListIndex] = useState<number>(0);
  const [customImageUrl, setCustomImageUrl] = useState<string>(SAMPLE_HANDWRITTEN_LISTS[0].imagePreview);
  const [customText, setCustomText] = useState<string>(SAMPLE_HANDWRITTEN_LISTS[0].itemsText);
  const [ocrResult, setOcrResult] = useState<OCRScanResult>(
    scanHandwrittenListOCR(SAMPLE_HANDWRITTEN_LISTS[0].itemsText)
  );
  const [parsedItems, setParsedItems] = useState<ParsedItemResult[]>(ocrResult.items);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'normal' | 'contrast' | 'b_w'>('normal');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Re-run OCR scan when text changes
  useEffect(() => {
    const scan = scanHandwrittenListOCR(customText);
    setOcrResult(scan);
    setParsedItems(scan.items);
  }, [customText]);

  // Canvas Laser Scanner Animation & OCR Bounding Box overlay
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = customImageUrl;

    let laserY = 0;
    let direction = 1;

    img.onload = () => {
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply photo contrast / B&W filter
        if (filterMode === 'contrast') {
          ctx.filter = 'contrast(160%) brightness(110%)';
        } else if (filterMode === 'b_w') {
          ctx.filter = 'grayscale(100%) contrast(200%)';
        } else {
          ctx.filter = 'none';
        }

        // Draw image fit to canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';

        // Draw dark translucent overlay
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw animated laser scan line
        laserY += 1.8 * direction;
        if (laserY >= canvas.height || laserY <= 0) {
          direction *= -1;
        }

        const laserGradient = ctx.createLinearGradient(0, laserY - 12, 0, laserY + 12);
        laserGradient.addColorStop(0, 'rgba(245, 158, 11, 0)');
        laserGradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.9)');
        laserGradient.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.fillStyle = laserGradient;
        ctx.fillRect(0, laserY - 10, canvas.width, 20);

        // Draw bright laser line
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, laserY);
        ctx.lineTo(canvas.width, laserY);
        ctx.stroke();

        // Draw OCR Line Bounding Boxes
        ocrResult.lineBoxes.forEach((boxItem, idx) => {
          const { box, confidence } = boxItem;
          // Scale box to canvas dimensions
          const scaleY = canvas.height / 240;
          const y = box.y * scaleY;
          const h = box.height * scaleY;

          if (laserY > y - 20) {
            ctx.strokeStyle = confidence > 0.9 ? '#10b981' : '#f59e0b';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(box.x, y, Math.min(canvas.width - 60, box.width), h);

            ctx.fillStyle = confidence > 0.9 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)';
            ctx.fillRect(box.x, y, Math.min(canvas.width - 60, box.width), h);

            // Label tag
            ctx.fillStyle = confidence > 0.9 ? '#10b981' : '#f59e0b';
            ctx.font = '10px sans-serif';
            ctx.fillText(`L${idx + 1}: ${Math.round(confidence * 100)}% Match`, box.x + 4, y + 14);
          }
        });

        animationFrameRef.current = requestAnimationFrame(render);
      };

      render();
    };

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, customImageUrl, filterMode, ocrResult]);

  if (!isOpen) return null;

  const handleSelectSample = (idx: number) => {
    setSelectedListIndex(idx);
    const sample = SAMPLE_HANDWRITTEN_LISTS[idx];
    setCustomImageUrl(sample.imagePreview);
    setCustomText(sample.itemsText);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImageUrl(event.target.result as string);
          setIsScanning(true);
          setTimeout(() => {
            setIsScanning(false);
          }, 1000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomText(e.target.value);
  };

  const handleQuantityChange = (index: number, delta: number) => {
    setParsedItems(prev =>
      prev.map((item, idx) => {
        if (idx === index) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (index: number) => {
    setParsedItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddItemsToCart = () => {
    if (parsedItems.length === 0) return;
    parsedItems.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    confetti({ particleCount: 50, spread: 70 });
    onClose();
    onOpenCartModal();
  };

  const handleDirectSendPhotoOrder = () => {
    if (parsedItems.length === 0) return;
    if (!userProfile?.phone || userProfile?.name === 'Guest Homemaker') {
      onClose();
      onRequireAuth();
      return;
    }
    parsedItems.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    const res = placeOrder('khata', 'photo_list');
    if (res.success) {
      setSentSuccess(true);
      confetti({ particleCount: 80, spread: 90 });
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in cursor-pointer">
      <div onClick={(e) => e.stopPropagation()} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto cursor-default">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>Handwritten Photo List OCR</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30 font-semibold flex items-center gap-1">
                  <ScanLine className="w-3 h-3 text-amber-400" />
                  <span>Canvas Scanner</span>
                </span>
              </h2>
              <p className="text-xs text-slate-400">Scan paper grocery list photo with live OCR laser beam</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sample List & Custom Photo Upload Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Select Paper List Preset or Upload Photo:</span>
            </span>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_HANDWRITTEN_LISTS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(idx)}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  selectedListIndex === idx
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <img
                  src={sample.imagePreview}
                  alt={sample.title}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="font-bold text-[11px] text-white truncate">{sample.title}</div>
                  <div className="text-[9px] text-slate-400 truncate">{sample.itemsText.split('\n')[0]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* HTML5 Canvas Scanner Beam & Photo Preview Area */}
        <div className="mb-4 bg-slate-950 border border-slate-800 rounded-2xl p-3 relative overflow-hidden text-center">
          <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400 font-bold">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>LIVE OCR LASER SCANNER</span>
            </span>

            {/* Filter Modes */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterMode('normal')}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  filterMode === 'normal' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setFilterMode('contrast')}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  filterMode === 'contrast' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                High Contrast
              </button>
              <button
                onClick={() => setFilterMode('b_w')}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  filterMode === 'b_w' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                B&W Scan
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md h-44 rounded-xl overflow-hidden border border-slate-800">
            <canvas
              ref={canvasRef}
              width={400}
              height={220}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* OCR Text Input & Preview */}
        <div className="mb-4 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Extracted OCR Lines (Editable)</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-normal">
              Overall Accuracy: {ocrResult.overallConfidence}%
            </span>
          </div>
          <textarea
            value={customText}
            onChange={handleTextChange}
            rows={3}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500/50"
            placeholder="Type or edit handwritten items..."
          />
        </div>

        {/* OCR Parsed Items Box */}
        {isScanning ? (
          <div className="p-6 text-center text-amber-400 text-xs font-bold animate-pulse">
            Scanning paper list photo with neural OCR model...
          </div>
        ) : parsedItems.length > 0 ? (
          <div className="mb-5 bg-slate-950/60 p-4 rounded-2xl border border-emerald-500/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Extracted Product Cart Items ({parsedItems.length})</span>
              </span>
              <span className="text-xs text-slate-400">Target: {activeStore.name}</span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {parsedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{item.product.name}</span>
                        {item.product.hindiName && (
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            {item.product.hindiName}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.unitDetected || item.product.unit} • ₹{item.product.price} each
                      </div>
                    </div>
                  </div>

                  {/* Quantity Modifier & Delete */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                      <button
                        onClick={() => handleQuantityChange(idx, -1)}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-black text-emerald-400 text-xs">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(idx, 1)}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-black text-amber-400 w-14 text-right">
                      ₹{item.product.price * item.quantity}
                    </span>

                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-black">
              <span className="text-slate-300">Total Bill Value:</span>
              <span className="text-emerald-400 text-base">
                ₹{parsedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0)}
              </span>
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        {sentSuccess ? (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-center text-emerald-300 font-bold text-sm animate-pulse">
            ✓ Handwritten Photo Order Sent to {activeStore.name}!
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddItemsToCart}
              disabled={parsedItems.length === 0}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              <span>Review in Cart</span>
            </button>

            <button
              onClick={handleDirectSendPhotoOrder}
              disabled={parsedItems.length === 0}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Photo Order to Kirana Shop</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

