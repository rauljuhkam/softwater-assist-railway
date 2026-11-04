import React from 'react';
import { Info } from 'lucide-react';

export const FooterDisclaimer: React.FC = () => {
  return (
    <footer className="w-full px-4 py-2 border-t border-slate-100 bg-white/60 text-slate-500 text-[11px] leading-relaxed flex items-center justify-center gap-1.5 flex-shrink-0">
      <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
      <p className="max-w-3xl text-center">
        <span className="font-medium text-slate-700">Softening is not disinfection.</span> A softener reduces hardness minerals; it does not remove bacteria, viruses or most contaminants. Have your water tested by a certified lab to understand its safety. Sources:{' '}
        <a
          href="https://www.epa.gov/watersense/cation-exchange-water-softeners"
          target="_blank"
          rel="noreferrer"
          className="text-brand-600 hover:underline"
        >
          EPA WaterSense
        </a>
        ,{' '}
        <a
          href="https://extension.psu.edu/water-softening"
          target="_blank"
          rel="noreferrer"
          className="text-brand-600 hover:underline"
        >
          Penn State Extension
        </a>
        .
      </p>
    </footer>
  );
};
