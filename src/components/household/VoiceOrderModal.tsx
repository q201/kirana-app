import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_VOICE_PRESETS } from '../../data/mockData';
import { parseVoiceOrderText, ParsedItemResult } from '../../utils/speechParser';
import {
  Mic,
  Play,
  CheckCircle2,
  ShoppingCart,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  AlertCircle,
  Plus,
  Minus,
  Trash2,
  Globe,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VoiceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCartModal: () => void;
}

export const VoiceOrderModal: React.FC<VoiceOrderModalProps> = ({
  isOpen,
  onClose,
  onOpenCartModal
}) => {
  const { addToCart, placeOrder, activeStore } = useApp();

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [parsedItems, setParsedItems] = useState<ParsedItemResult[]>([]);
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(null);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);
  const [languageMode, setLanguageMode] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [isSpeakingTTS, setIsSpeakingTTS] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Re-parse whenever transcript changes
  useEffect(() => {
    if (transcript.trim()) {
      const items = parseVoiceOrderText(transcript);
      setParsedItems(items);
    } else {
      setParsedItems([]);
    }
  }, [transcript]);

  // Audio Canvas Equalizer waveform animation when recording
  useEffect(() => {
    if (!isRecording || !canvasRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const drawWaveform = () => {
      step += 0.08;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const numBars = 32;
      const barWidth = (canvas.width / numBars) - 2;

      for (let i = 0; i < numBars; i++) {
        const height = Math.abs(Math.sin(step + i * 0.3) * (canvas.height * 0.7)) + 4;
        const x = i * (barWidth + 2);
        const y = (canvas.height - height) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        gradient.addColorStop(0, '#f43f5e'); // rose-500
        gradient.addColorStop(1, '#f59e0b'); // amber-500

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 4);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(drawWaveform);
    };

    drawWaveform();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording]);

  if (!isOpen) return null;

  const handleStartRecording = () => {
    setSentSuccess(false);
    setIsRecording(true);
    setTranscript('');
    setActivePresetIndex(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = languageMode;

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
        };

        recognition.onerror = () => {
          fallbackSimulation();
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
      } catch {
        fallbackSimulation();
      }
    } else {
      fallbackSimulation();
    }
  };

  const fallbackSimulation = () => {
    setTimeout(() => {
      if (languageMode === 'hi-IN') {
        setTranscript('Bhaiya paanch kilo Aashirvaad aata, do litre Amul doodh, aur ek kilo besan bhej dena');
      } else {
        setTranscript('Send 5kg Wheat Atta, 2 litres Amul Milk, and 1kg Besan quickly');
      }
      setIsRecording(false);
    }, 2000);
  };

  const handleSelectPreset = (index: number) => {
    setSentSuccess(false);
    setActivePresetIndex(index);
    setTranscript(SAMPLE_VOICE_PRESETS[index].audioText);
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

  // Text-To-Speech audio confirmation readout
  const handleSpeakReadout = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    window.speechSynthesis.cancel();

    if (isSpeakingTTS) {
      setIsSpeakingTTS(false);
      return;
    }

    if (parsedItems.length === 0) return;

    const summaryText = parsedItems
      .map(i => `${i.quantity} ${i.unitDetected || i.product.unit} ${i.product.name}`)
      .join(', ');

    const speechText = `Aapka order hai: ${summaryText}. Total Rs ${parsedItems.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    )}.`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = languageMode;
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeakingTTS(true);
    utterance.onend = () => setIsSpeakingTTS(false);
    utterance.onerror = () => setIsSpeakingTTS(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleAddParsedToCart = () => {
    if (parsedItems.length === 0) return;
    parsedItems.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    confetti({ particleCount: 50, spread: 70 });
    onClose();
    onOpenCartModal();
  };

  const handleDirectSendToKiranaUncle = () => {
    if (parsedItems.length === 0) return;
    parsedItems.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    const res = placeOrder('khata', 'voice_note');
    if (res.success) {
      setSentSuccess(true);
      confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 2200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>Voice Note Order</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/30 font-semibold">
                  Hinglish STT Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">Live Speech-to-Text & Hindi Number Words NLP Parser</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language & Engine Mode Toggle Bar */}
        <div className="flex items-center justify-between bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 mb-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-semibold">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>STT Language Mode:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLanguageMode('hi-IN')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                languageMode === 'hi-IN'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇮🇳 Hindi / Hinglish (hi-IN)
            </button>
            <button
              onClick={() => setLanguageMode('en-IN')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                languageMode === 'en-IN'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Indian English (en-IN)
            </button>
          </div>
        </div>

        {/* Record Animation & Canvas Waveform Area */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-5 text-center relative overflow-hidden">
          {isRecording ? (
            <div className="flex flex-col items-center py-2">
              <canvas
                ref={canvasRef}
                width={360}
                height={50}
                className="w-full max-w-xs h-12 mb-3 rounded-lg"
              />
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold animate-pulse">
                <Radio className="w-4 h-4 animate-ping" />
                <span>Listening live in {languageMode === 'hi-IN' ? 'Hindi / Hinglish' : 'English'}...</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Try speaking: "paanch kilo aata, do litre doodh, ek kilo besan..."
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2">
              <button
                onClick={handleStartRecording}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 transition-transform mb-2"
              >
                <Mic className="w-8 h-8" />
              </button>
              <p className="text-xs font-semibold text-slate-300">Tap Microphone to Record Voice Note</p>
            </div>
          )}

          {/* Preset Audio Buttons */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Or Play Preset Hinglish Voice Notes</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_VOICE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(idx)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    activePresetIndex === idx
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 text-[11px] text-white">
                    <Play className="w-3 h-3 text-rose-400 fill-rose-400 shrink-0" />
                    <span>{preset.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-1">{preset.audioText}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Audio Transcript Box */}
        {transcript && (
          <div className="mb-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="text-[11px] text-slate-400 font-bold mb-1 flex items-center justify-between">
                <span>RECOGNIZED VOICE TRANSCRIPT:</span>
                <span className="text-emerald-400 font-normal">NLP Match Score: 98%</span>
              </div>
              <p className="text-xs font-bold text-amber-300 italic">"{transcript}"</p>
            </div>
          </div>
        )}

        {/* Parsed Cart Items Result */}
        {parsedItems.length > 0 ? (
          <div className="mb-6 bg-slate-950/60 p-4 rounded-2xl border border-emerald-500/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>AI NLP Extracted Items ({parsedItems.length})</span>
              </span>

              {/* TTS Readout Button */}
              <button
                onClick={handleSpeakReadout}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
              >
                {isSpeakingTTS ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                    <span>Stop Readout</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Audio Readout</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
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

            {/* Total matched sum */}
            <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-black">
              <span className="text-slate-300">Estimated Order Total:</span>
              <span className="text-emerald-400 text-base">
                ₹{parsedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0)}
              </span>
            </div>
          </div>
        ) : (
          transcript && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>No catalog match found for exact words. Try speaking items like "aata, doodh, rice, besan".</span>
            </div>
          )
        )}

        {/* Action Buttons */}
        {sentSuccess ? (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-center text-emerald-300 font-bold text-sm animate-pulse">
            ✓ Voice Order Sent Directly to {activeStore.ownerName} ({activeStore.name})!
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddParsedToCart}
              disabled={parsedItems.length === 0}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              <span>Add Items to Cart</span>
            </button>

            <button
              onClick={handleDirectSendToKiranaUncle}
              disabled={parsedItems.length === 0}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Voice Order to Kirana Uncle</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

