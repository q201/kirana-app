import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { idempotencyEngine } from '../../utils/idempotency';
import { ShieldCheck, RefreshCw, AlertTriangle, Key, Server, Database, CheckCircle2, Copy } from 'lucide-react';

export const IdempotencySimulator: React.FC = () => {
  const { placeOrder, idempotencyLogs } = useApp();

  const [activeKey, setActiveKey] = useState<string>(idempotencyEngine.generateKey());
  const [simulateDrop, setSimulateDrop] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSendRequest = () => {
    setIsSending(true);
    setLastResult(null);

    setTimeout(() => {
      const res = placeOrder('khata', 'standard', simulateDrop, activeKey);
      setLastResult(res);
      setIsSending(false);
    }, 600);
  };

  const handleGenerateNewKey = () => {
    setActiveKey(idempotencyEngine.generateKey());
    setLastResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-black text-white">Interactive Idempotency Test Bench</h3>
        </div>
        <p className="text-xs text-slate-400">
          In poor Indian alleyway mobile coverage, users often double-click "Place Order" or network drops mid-request.
          The NestJS backend intercepts `X-Idempotency-Key` headers and checks Redis to ensure **zero duplicate charges** or orders.
        </p>

        {/* Test Control Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-xs text-slate-400 font-bold block mb-1">Current Request Idempotency Key:</label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-amber-400 font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  {activeKey}
                </span>
                <button
                  onClick={handleGenerateNewKey}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-slate-300 border border-slate-700"
                >
                  Generate New Key
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-xs">
              <input
                type="checkbox"
                checked={simulateDrop}
                onChange={e => setSimulateDrop(e.target.checked)}
                className="accent-amber-500"
              />
              <span className="font-bold text-amber-300">Simulate 504 Network Timeout Drop</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSendRequest}
              disabled={isSending}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
            >
              {isSending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Server className="w-4 h-4" />
                  <span>Send HTTP Order Request (`X-Idempotency-Key`)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Callout */}
        {lastResult && (
          <div
            className={`p-4 rounded-2xl border text-xs space-y-2 ${
              !lastResult.success
                ? 'bg-red-500/20 border-red-500/50 text-red-300'
                : lastResult.isCached
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between font-black text-sm">
              <span className="flex items-center gap-2">
                {!lastResult.success ? (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                ) : lastResult.isCached ? (
                  <Database className="w-4 h-4 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>
                  {!lastResult.success
                    ? 'HTTP 504 Gateway Timeout (Simulated Drop)'
                    : lastResult.isCached
                    ? '200 OK (Served from Redis Cache - Duplicate Request Deduplicated!)'
                    : '201 Created (New Order Processed)'}
                </span>
              </span>
            </div>

            {lastResult.order && (
              <div className="font-mono text-[11px]">
                Order ID: <strong>{lastResult.order.id}</strong> • Amount: ₹{lastResult.order.totalAmount}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Redis Key-Value Store & Request Log Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h4 className="text-sm font-black text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          <span>Redis Idempotency Audit Logs ({idempotencyLogs.length})</span>
        </h4>

        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {idempotencyLogs.map((log, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono flex items-start justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">[{log.timestamp}]</span>
                  <span className="text-amber-400 font-bold">{log.idempotencyKey}</span>
                </div>
                <div className="text-slate-300 mt-1">
                  Order ID: <span className="text-white font-bold">{log.orderId}</span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                  log.status === 'cached'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {log.status === 'cached' ? 'Redis Deduplicated' : 'New Key Created'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
