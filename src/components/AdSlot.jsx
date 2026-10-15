import React from 'react';

/**
 * Policy-Compliant Google AdSense Reserved Slot
 * 
 * - Reserved fixed height and responsive container prevents Cumulative Layout Shift (CLS).
 * - Explicit "Advertisement" disclaimer prevents deceptive or accidental clicks.
 * - Ready for Google AdSense <ins class="adsbygoogle"> script tag injection.
 * - Keeps ads disabled by default until verified client & slot IDs are provided.
 */
export default function AdSlot({ slotId, format = 'horizontal', className = '' }) {
  // Flag to activate once user provides real Google AdSense Publisher & Slot IDs
  const isAdConfigured = Boolean(slotId);

  return (
    <div className={`my-8 flex flex-col items-center justify-center ${className}`}>
      <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mb-1">
        Advertisement
      </span>
      
      <div 
        className={`w-full max-w-4xl border border-dashed border-slate-200/90 rounded-xl bg-slate-50/60 flex items-center justify-center text-slate-400 text-xs overflow-hidden transition-all ${
          format === 'horizontal' ? 'min-h-[90px] sm:min-h-[100px]' : 'min-h-[250px]'
        }`}
        aria-label="Advertisement container"
      >
        {isAdConfigured ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className="text-center p-4">
            <span className="text-slate-400 font-medium block">Ad Space Reserved</span>
            <span className="text-[11px] text-slate-400">
              Responsive Google AdSense container (non-intrusive placement)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
