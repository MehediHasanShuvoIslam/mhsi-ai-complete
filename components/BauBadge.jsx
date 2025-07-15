'use client';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const BauBadge = () => {
  const fallbackLogo = '/assets/bau_logo.png'; // fallback path

  console.log('assets.bau_logo:', assets.bau_logo); // debug

  return (
    <div className="fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-3 flex items-center gap-3 shadow-lg">
      <Image
        src={assets.bau_logo || fallbackLogo}
        alt="BAU Logo"
        width={40}
        height={40}
        className="rounded-full"
        unoptimized // optional, remove if optimization works fine
      />
      <div className="leading-tight text-right">
        <p className="font-semibold text-sm">Bangladesh Agricultural University</p>
        <p className="text-xs text-white/80">AET-61 • BAU-64</p>
      </div>
    </div>
  );
};

export default BauBadge;
