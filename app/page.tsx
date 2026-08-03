export default function Home() {
  return (
    /* Arka plan: Simsiyah bir stüdyo masası gibi, içeriği tam ortaya hizalar */
    <main className="flex items-center justify-center min-h-screen bg-black">
      
      {/* Ana Cihaz Kasası: Tam 1280x768 kilitli, kenarları hafif yuvarlak */}
      <div className="w-[1280px] h-[768px] bg-[#2A2A2A] rounded-md shadow-2xl overflow-hidden flex flex-col border-2 border-[#1A1A1A]">

        {/* 1. ÜST BAR: Çok ince, sadece küçük logomuz/yazımız var */}
        <div className="h-10 bg-[#1A1A1A] border-b border-black flex items-center px-6">
          <span className="text-[#888888] text-xs tracking-[0.3em] font-bold">WINKEL</span>
        </div>

        {/* 2. DİJİTAL EKRAN: Tempo bilgisinin devasa yazacağı orta bölüm */}
        <div className="h-[45%] bg-[#111111] flex flex-col items-center justify-center border-b-[6px] border-[#1A1A1A]">
            <h1 className="text-6xl text-white font-light tracking-[0.2em] mb-3">MODERATO</h1>
            <p className="text-[#666666] text-lg font-medium">Orta hızda, dengeli, ne çok hızlı ne çok yavaş (ılımlı)</p>
            <div className="text-8xl text-[#DDDDDD] font-bold mt-6 tracking-tight">112</div>
        </div>

        {/* 3. DONANIM PANELİ: Potansların ve ayarların olacağı alt bölüm */}
        <div className="flex-1 bg-[#333333] p-6 flex gap-6">
          
          {/* Sol Panel Örneği */}
          <div className="flex-1 bg-[#2C2C2C] rounded-sm shadow-inner border-t-2 border-[#444444] border-l-2 border-[#444444] border-r border-[#222222] border-b border-[#222222] p-4 flex flex-col">
            <div className="bg-[#1A1A1A] px-3 py-1 self-start rounded-sm mb-4">
              <span className="text-white text-xs font-bold tracking-wider">KONTROLLER</span>
            </div>
            {/* Buraya potanslar ve Nudge tuşları gelecek */}
          </div>

          {/* Sağ Panel Örneği */}
          <div className="flex-1 bg-[#2C2C2C] rounded-sm shadow-inner border-t-2 border-[#444444] border-l-2 border-[#444444] border-r border-[#222222] border-b border-[#222222] p-4 flex flex-col">
            <div className="bg-[#1A1A1A] px-3 py-1 self-start rounded-sm mb-4">
              <span className="text-white text-xs font-bold tracking-wider">ÖLÇÜ VE VURGU</span>
            </div>
            {/* Buraya ölçü seçenekleri ve metrik vurgu ayarları gelecek */}
          </div>

        </div>

      </div>
    </main>
  );
}