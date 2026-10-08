import { useState } from 'react';

export default function Brand({ compact = false }: { compact?: boolean }) {
  const [logoUnavailable, setLogoUnavailable] = useState(false);
  return <div className="flex items-center gap-3 min-w-0" aria-label="Corizo Links">
    {logoUnavailable ? <span className="text-xl font-semibold text-slate-900">Corizo</span> :
      <img src="/assets/hdr-logo.png" alt="Corizo" className={compact ? 'w-[104px] max-h-9 object-contain shrink-0' : 'w-[136px] max-h-11 object-contain shrink-0'} onError={() => setLogoUnavailable(true)} />}
    <div className="border-l border-slate-200 pl-3 min-w-0">
      <p className={compact ? 'text-sm font-semibold text-slate-900' : 'text-lg font-semibold tracking-tight text-slate-900'}>Links</p>
      {compact && <p className="text-[11px] text-slate-500">Workspace</p>}
    </div>
  </div>;
}
