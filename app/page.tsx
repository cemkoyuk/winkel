export default function Home() {
  return (
    /* Ana taşıyıcı: Tüm ekranı kaplar (w-screen h-screen) ve taşan her şeyi gizler (overflow-hidden). Kayma hissi tamamen biter. */
    <main className="flex items-center justify-center w-screen h-screen bg-black overflow-hidden">
      
      {/* ANA CİHAZ KASASI */}
      <div className="w-[1280px] h-[768px] bg-[#2A2A2A] rounded-md shadow-2xl flex flex-col border-2 border-[#1A1A1A]">

        {/* 1. ÜST BAR (Yazı tamamen kaldırıldı, sadece donanımsal bir çıta hissiyatı için ince bir siyah şerit bırakıldı) */}
        <div className="h-6 bg-[#1A1A1A] border-b-2 border-black"></div>

        {/* 2. KONTROL PANELİ */}
        <div className="h-[55%] bg-[#333333] p-6 flex gap-6">
          
          {/* SOL PANEL - REFERANS SÜRE (Space Tuşu) */}
          <div className="flex-1 bg-[#2C2C2C] rounded-sm shadow-inner border-t-2 border-[#444444] border-l-2 border-[#444444] border-r border-[#222222] border-b border-[#222222] p-4 flex flex-col">
            <div className="bg-[#1A1A1A] px-3 py-1 self-start rounded-sm mb-4">
              <span className="text-white text-xs font-bold tracking-wider">REFERANS SÜRE</span>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#555555] rounded bg-[#222222] p-4 text-center">
                <span className="text-[#888888] text-xs font-bold mb-4 uppercase tracking-widest">İçindeki ritmi hisset</span>
                <div className="w-48 h-12 bg-[#444444] rounded flex items-center justify-center border-b-4 border-[#111111] shadow-lg mb-4 cursor-pointer hover:bg-[#555555] transition-colors">
                    <span className="text-white font-bold tracking-widest text-sm">SPACE TUŞUNA BAS</span>
                </div>
                <span className="text-[#666666] text-xs leading-relaxed">Klavyede SPACE tuşuna basılı tut, içindeki ölçüyü<br/>hissettiğinde bırak.</span>
            </div>
          </div>

          {/* ORTA PANEL - ÖLÇÜ VE VURGU */}
          <div className="flex-1 bg-[#2C2C2C] rounded-sm shadow-inner border-t-2 border-[#444444] border-l-2 border-[#444444] border-r border-[#222222] border-b border-[#222222] p-4 flex flex-col">
            <div className="bg-[#1A1A1A] px-3 py-1 self-start rounded-sm mb-6">
              <span className="text-white text-xs font-bold tracking-wider">ÖLÇÜ & VURGU</span>
            </div>
            
            {/* Ölçü Seçimi */}
            <div className="mb-8">
              <span className="text-[#888888] text-xs block mb-3 font-bold tracking-widest">ÖLÇÜ BİRİMİ</span>
              <div className="flex gap-2">
                {['2/4', '3/4', '4/4', '6/8'].map(m => (
                    <div key={m} className={`flex-1 text-center py-2 rounded text-sm font-bold border-t cursor-pointer transition-colors ${m === '4/4' ? 'bg-[#DDDDDD] text-black border-white' : 'bg-[#1A1A1A] text-[#AAAAAA] border-[#444444] hover:bg-[#333333]'}`}>
                      {m}
                    </div>
                ))}
              </div>
            </div>

            {/* Vurgu (Aksan) Seçimi */}
            <div>
              <span className="text-[#888888] text-xs block mb-3 font-bold tracking-widest">METRİK VURGU (AKSAN)</span>
              <div className="flex gap-3">
                {['1', '2', '3', '4'].map(a => (
                    <div key={a} className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-bold border-2 cursor-pointer transition-colors ${a === '1' ? 'border-orange-500 text-orange-500 bg-[#3a1d0f]' : 'border-[#555555] text-[#777777] bg-[#111111] hover:border-[#888888]'}`}>
                      {a}
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* SAĞ PANEL - SES VE NUDGE AYARLARI */}
          <div className="flex-1 bg-[#2C2C2C] rounded-sm shadow-inner border-t-2 border-[#444444] border-l-2 border-[#444444] border-r border-[#222222] border-b border-[#222222] p-4 flex flex-col">
            <div className="bg-[#1A1A1A] px-3 py-1 self-start rounded-sm mb-6">
              <span className="text-white text-xs font-bold tracking-wider">KONTROLLER</span>
            </div>
            
            <div className="flex justify-around items-center flex-1">
                
                {/* Volume Potansı Görseli */}
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[#111111] border-[5px] border-[#1A1A1A] shadow-[0_5px_15px_rgba(0,0,0,0.8)] relative flex items-center justify-center cursor-pointer">
                        {/* Potans üstündeki beyaz çizgi */}
                        <div className="w-1 h-3 bg-white absolute top-1 rounded-full"></div>
                    </div>
                    <span className="text-[#888888] text-xs mt-4 font-bold tracking-widest">VOLUME</span>
                </div>

                {/* Mute Butonu */}
                <div className="flex flex-col items-center">
                     <div className="w-14 h-10 bg-[#3a0f0f] border-t border-red-500 rounded flex items-center justify-center shadow-lg mb-2 cursor-pointer hover:bg-red-900 transition-colors">
                        <span className="text-red-300 text-xs font-bold tracking-widest">MUTE</span>
                     </div>
                </div>

                {/* Nudge Butonları */}
                <div className="flex flex-col items-center">
                     <div className="flex gap-1 mb-2">
                        <div className="w-10 h-10 bg-[#1A1A1A] rounded flex items-center justify-center text-[#AAAAAA] font-bold border-t border-[#444444] shadow-md cursor-pointer hover:bg-[#333333]">&lt;</div>
                        <div className="w-10 h-10 bg-[#1A1A1A] rounded flex items-center justify-center text-[#AAAAAA] font-bold border-t border-[#444444] shadow-md cursor-pointer hover:bg-[#333333]">&gt;</div>
                     </div>
                     <span className="text-[#888888] text-xs mt-2 font-bold tracking-widest">NUDGE</span>
                </div>

            </div>
          </div>

        </div>

        {/* 3. DİJİTAL EKRAN (Sonuçlar) */}
        <div className="h-[45%] bg-[#0a0a0a] flex flex-col items-center justify-center border-t-[8px] border-[#1A1A1A] shadow-inner relative">
            <h1 className="text-6xl text-white font-light tracking-[0.2em] mb-4">MODERATO</h1>
            <p className="text-[#666666] text-lg font-medium">Orta hızda, dengeli, ne çok hızlı ne çok yavaş (ılımlı)</p>
            <div className="text-8xl text-orange-500 font-bold mt-8 tracking-tighter drop-shadow-[0_0_20px_rgba(249,115,22,0.15)]">
              112
            </div>
            {/* Minik BPM yazısı */}
            <span className="absolute bottom-10 right-10 text-[#333333] text-2xl font-bold tracking-widest">BPM</span>
        </div>

      </div>
    </main>
  );
}