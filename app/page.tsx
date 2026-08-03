'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  // --- DURUMLAR (STATES) ---
  // idle: Başlangıç | armed: Kırmızı butona basıldı, space bekleniyor | recording: Space'e basılı | done: Kayıt bitti
  const [recordState, setRecordState] = useState<'idle' | 'armed' | 'recording' | 'done'>('idle');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // Ölçü ve Vurgu ayarları
  const [timeSignature, setTimeSignature] = useState<string>('4/4');
  const [activeAccents, setActiveAccents] = useState<number[]>([1]); // Default sadece 1. vuruş
  
  // Oynatma durumu
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Referanslar (Timer için)
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Gönderdiğin resimdeki genişletilmiş ölçü listesi
  const timeSignatures = [
    '2/4', '3/4', '4/4', '5/4', '6/4', '3/8', 
    '5/8', '6/8', '7/8', '9/8', '12/8', '2/2', '3/2'
  ];

  // Seçilen ölçünün üst rakamını (pay) bulup o kadar vurgu butonu oluşturmak için
  const numerator = parseInt(timeSignature.split('/')[0]) || 4;

  // --- KAYIT (SPACE TUŞU) MANTIĞI ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Sayfanın aşağı kaymasını engeller
        if (recordState === 'armed') {
          setRecordState('recording');
          startTimeRef.current = performance.now();
          
          const updateTimer = () => {
            setElapsedTime((performance.now() - startTimeRef.current) / 1000);
            animationFrameRef.current = requestAnimationFrame(updateTimer);
          };
          animationFrameRef.current = requestAnimationFrame(updateTimer);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && recordState === 'recording') {
        setRecordState('done');
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [recordState]);

  // Vurgu seçme/kaldırma mantığı
  const toggleAccent = (beat: number) => {
    setActiveAccents(prev => 
      prev.includes(beat) 
        ? prev.filter(a => a !== beat) 
        : [...prev, beat]
    );
  };

  // Yeni ölçü seçildiğinde vurguları resetle (sadece 1'i seçili bırak)
  const handleSignatureChange = (sig: string) => {
    setTimeSignature(sig);
    setActiveAccents([1]);
  };

  return (
    <main className="flex items-center justify-center w-screen h-screen bg-black overflow-hidden select-none">
      <div className="w-[1280px] h-[768px] bg-[#2A2A2A] rounded-md shadow-2xl flex flex-col border-2 border-[#1A1A1A]">
        
        {/* ÜST BAR */}
        <div className="h-6 bg-[#1A1A1A] border-b-2 border-black"></div>

        {/* KONTROL PANELİ */}
        <div className="h-[55%] bg-[#333333] p-6 flex gap-6">
          
          {/* SOL PANEL - REFERANS SÜRE */}
          <div className={`flex-1 bg-[#2C2C2C] rounded-sm shadow-inner border-t-2 border-[#444444] border-l-2 border-[#444444] border-r border-[#222222] border-b border-[#222222] p-4 flex flex-col transition-opacity duration-500 ${recordState === 'done' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <div className="bg-[#1A1A1A] px-3 py-1 self-start rounded-sm mb-4">
              <span className="text-white text-xs font-bold tracking-wider">REFERANS SÜRE</span>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#555555] rounded bg-[#222222] p-4 text-center relative">
                
                {/* Kronometre Ekranı */}
                <div className="absolute top-4 text-orange-500 font-mono text-2xl tracking-widest font-bold">
                  {elapsedTime > 0 ? elapsedTime.toFixed(5) : "0.00000"}
                </div>

                {/* Kırmızı Kayıt Butonu */}
                <div 
                  onClick={() => { if (recordState === 'idle') setRecordState('armed'); }}
                  className={`w-12 h-12 rounded-full border-4 mt-8 mb-6 cursor-pointer transition-all duration-300 flex items-center justify-center
                    ${recordState === 'idle' ? 'border-red-600 hover:bg-red-900/30' : ''}
                    ${recordState === 'armed' ? 'bg-red-600 border-red-600' : ''}
                    ${recordState === 'recording' ? 'bg-red-600 border-red-600 animate-pulse' : ''}
                  `}
                >
                  {recordState === 'idle' && <div className="w-4 h-4 bg-red-600 rounded-full opacity-50"></div>}
                </div>

                {/* Space Tuşu Yönergesi */}
                <div className={`w-64 h-12 rounded flex items-center justify-center border-b-4 transition-all duration-300
                    ${recordState === 'idle' ? 'bg-[#333] border-[#222] opacity-40' : ''}
                    ${recordState === 'armed' ? 'bg-[#555] border-[#111] animate-pulse opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : ''}
                    ${recordState === 'recording' ? 'bg-[#777] border-t-4 border-b-0 border-[#222] opacity-100 scale-95' : ''}
                  `}>
                    <span className="text-white font-bold tracking-widest text-sm">
                      {recordState === 'recording' ? 'HİSSEDİYOR...' : 'SPACE TUŞUNA BASILI TUT'}
                    </span>
                </div>
                
                <span className="text-[#666666] text-xs leading-relaxed mt-4">
                  {recordState === 'idle' ? 'Önce kayıt ikonuna tıklayarak sistemi kur.' : 'İçindeki ölçüyü hissettiğinde tuşu bırak.'}
                </span>
            </div>
          </div>

          {/* ORTA PANEL - ÖLÇÜ VE VURGU */}
          <div className={`flex-[1.5] bg-[#2C2C2C] rounded-sm shadow-inner border-t-2 border-[#444444] border-l-2 border-[#444444] border-r border-[#222222] border-b border-[#222222] p-4 flex flex-col transition-opacity duration-500 ${recordState === 'done' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <div className="bg-[#1A1A1A] px-3 py-1 self-start rounded-sm mb-4">
              <span className="text-white text-xs font-bold tracking-wider">ÖLÇÜ & VURGU</span>
            </div>
            
            {/* Ölçü Seçimi (Grid Yapısı) */}
            <div className="mb-6">
              <div className="grid grid-cols-5 gap-2">
                {timeSignatures.map(m => (
                    <div 
                      key={m} 
                      onClick={() => handleSignatureChange(m)}
                      className={`flex items-center justify-center py-2 rounded text-sm font-bold cursor-pointer transition-colors border 
                        ${timeSignature === m ? 'bg-[#DDDDDD] text-black border-white shadow-sm' : 'bg-[#1A1A1A] text-[#AAAAAA] border-[#333333] hover:bg-[#333333]'}`}
                    >
                      {m}
                    </div>
                ))}
                {/* Özel Ölçü Girişi (Daha) */}
                <div className="flex items-center justify-center py-2 rounded text-sm font-bold cursor-pointer transition-colors border bg-[#1A1A1A] text-[#AAAAAA] border-[#333333] hover:bg-[#333333]">
                  DAHA...
                </div>
              </div>
            </div>

            {/* Vurgu (Aksan) Seçimi - Dinamik olarak pay (numerator) kadar buton üretir */}
            <div className="flex-1 flex flex-col justify-end">
              <span className="text-[#888888] text-xs block mb-3 font-bold tracking-widest border-t border-[#444] pt-4">METRİK VURGU (Çoklu Seçim)</span>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: Math.min(numerator, 16) }, (_, i) => i + 1).map(a => (
                    <div 
                      key={a} 
                      onClick={() => toggleAccent(a)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-bold border-2 cursor-pointer transition-colors 
                        ${activeAccents.includes(a) ? 'border-orange-500 text-orange-500 bg-[#3a1d0f] shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'border-[#555555] text-[#777777] bg-[#111111] hover:border-[#888888]'}`}
                    >
                      {a}
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* SAĞ PANEL - KONTROLLER */}
          <div className="flex-1 bg-[#2C2C2C] rounded-sm shadow-inner border-t-2 border-[#444444] border-l-2 border-[#444444] border-r border-[#222222] border-b border-[#222222] p-4 flex flex-col">
            <div className="bg-[#1A1A1A] px-3 py-1 self-start rounded-sm mb-6">
              <span className="text-white text-xs font-bold tracking-wider">KONTROLLER</span>
            </div>
            <div className="flex justify-around items-center flex-1">
                {/* Volume Potansı */}
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[#111111] border-[5px] border-[#1A1A1A] shadow-[0_5px_15px_rgba(0,0,0,0.8)] relative flex items-center justify-center cursor-pointer">
                        <div className="w-1 h-3 bg-white absolute top-1 rounded-full"></div>
                    </div>
                    <span className="text-[#888888] text-xs mt-4 font-bold tracking-widest">VOLUME</span>
                </div>
                {/* Nudge */}
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

        {/* ALT EKRAN (SONUÇ VE OYNATMA) */}
        <div className="h-[45%] bg-[#0a0a0a] flex flex-col items-center justify-center border-t-[8px] border-[#1A1A1A] shadow-inner relative">
            
            {/* Oynatılmıyorsa kocaman Başlat butonu görünür */}
            {!isPlaying ? (
              <div 
                onClick={() => recordState === 'done' && setIsPlaying(true)}
                className={`px-16 py-6 rounded-full border-4 text-3xl font-bold tracking-[0.2em] transition-all duration-300
                  ${recordState === 'done' ? 'border-white text-white cursor-pointer hover:bg-white hover:text-black hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'border-[#333] text-[#333] cursor-not-allowed'}
                `}
              >
                BAŞLAT
              </div>
            ) : (
              /* Oynatılıyorsa sonuçlar görünür */
              <div className="flex flex-col items-center">
                <h1 className="text-6xl text-white font-light tracking-[0.2em] mb-4 uppercase">MODERATO</h1>
                <p className="text-[#666666] text-lg font-medium">Orta hızda, dengeli, ne çok hızlı ne çok yavaş (ılımlı)</p>
                <div className="flex items-baseline gap-3 mt-8">
                  <span className="text-8xl text-orange-500 font-bold tracking-tighter drop-shadow-[0_0_20px_rgba(249,115,22,0.15)]">112</span>
                  <span className="text-[#555555] text-4xl font-bold tracking-widest">BPM</span>
                </div>
                
                {/* Durdur Butonu (Mini) */}
                <div 
                  onClick={() => setIsPlaying(false)}
                  className="absolute bottom-6 right-8 px-6 py-2 border-2 border-[#333] text-[#777] rounded cursor-pointer hover:border-white hover:text-white transition-colors text-sm font-bold tracking-widest"
                >
                  DURDUR
                </div>
              </div>
            )}
            
        </div>

      </div>
    </main>
  );
}