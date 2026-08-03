'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  // --- DURUMLAR (STATES) ---
  const [recordState, setRecordState] = useState<'idle' | 'armed' | 'recording' | 'done'>('idle');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // Ölçü ve Vurgu ayarları (Başlangıçta boş/seçilmemiş)
  const [numeratorInput, setNumeratorInput] = useState<string>('');
  const [denominatorInput, setDenominatorInput] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [activeAccents, setActiveAccents] = useState<number[]>([1]);
  
  // Oynatma durumu
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Zamanlayıcı referansları
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Aktif pay (Sayısal hesaplama için fallback 4)
  const numVal = parseInt(numeratorInput) || 4;
  const bpm = elapsedTime > 0 ? Math.max(20, Math.round(60 / (elapsedTime / numVal))) : 112;
  
  // BPM'e göre tempo terimi
  const getTempoInfo = (currentBpm: number) => {
    if (currentBpm < 45) return { term: "Grave", desc: "Çok ağır, ciddi, vakur ve derin bir ağırlıkta." };
    if (currentBpm < 55) return { term: "Lento", desc: "Yavaş, durgun, sakin ve ağırbaşlı." };
    if (currentBpm < 66) return { term: "Larghetto", desc: "Largo'dan biraz daha hızlı, nispeten daha rahat genişlikte." };
    if (currentBpm < 76) return { term: "Adagio", desc: "Rahat, acele etmeden, yavaş ve lirik." };
    if (currentBpm < 108) return { term: "Andante", desc: "Yürüyüş hızında, doğal insan adımı ritminde, sakin." };
    if (currentBpm <= 120) return { term: "Moderato", desc: "Orta hızda, dengeli, ne çok hızlı ne çok yavaş (ılımlı)." };
    if (currentBpm < 156) return { term: "Allegro", desc: "Hızlı, neşeli, parlak, canlı ve belirgin bir hızda." };
    if (currentBpm < 176) return { term: "Vivace", desc: "Oldukça hızlı, neşeli, atılgan ve hayat dolu." };
    return { term: "Presto", desc: "Çok hızlı, aceleci ve süratli." };
  };

  const tempoInfo = getTempoInfo(bpm);

  // --- KAYIT (SPACE TUŞU) MANTIĞI ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (recordState === 'armed') {
          setRecordState('recording');
          setIsPlaying(false);
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
        setRecordState('done'); // Bittiğinde ekranda süre kalmaya devam eder
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

  // Vurgu seçme/kaldırma
  const toggleAccent = (beat: number) => {
    setActiveAccents(prev => 
      prev.includes(beat) ? prev.filter(a => a !== beat) : [...prev, beat]
    );
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPreset(val);
    if (val) {
      const [num, den] = val.split('/');
      setNumeratorInput(num);
      setDenominatorInput(den);
      setActiveAccents([1]);
    } else {
      setNumeratorInput('');
      setDenominatorInput('');
    }
  };

  const handleManualInput = (type: 'num' | 'den', val: string) => {
    setSelectedPreset(''); // Manuel girilirse dropdown'ı resetle
    if (type === 'num') setNumeratorInput(val);
    else setDenominatorInput(val);
    setActiveAccents([1]);
  };

  // İstediğin tam liste ölçüler
  const timeSignatures = [
    "1/4", "2/4", "3/4", "4/4", "5/4", "6/4",
    "3/8", "4/8", "5/8", "6/8", "7/8", "9/8", "12/8",
    "1/2", "2/2", "3/2"
  ];

  return (
    <main className="flex items-center justify-center w-screen h-screen bg-black overflow-hidden select-none">
      <style>{`
        @keyframes swing {
          0% { transform: rotate(-35deg); }
          100% { transform: rotate(35deg); }
        }
      `}</style>

      <div className="w-[1280px] h-[768px] bg-[#2A2A2A] rounded-md shadow-2xl p-6 border-4 border-[#1A1A1A] flex gap-6">
        
        {/* 1. SOL SÜTUN (KAYIT ALANI) */}
        <div className="flex-1 bg-[#222222] rounded shadow-inner border-t-2 border-[#444] border-l-2 border-[#444] border-r border-[#111] border-b border-[#111] p-8 flex flex-col items-center justify-between">
          <div className="text-center w-full">
            <span className="text-[#888888] text-sm font-bold tracking-widest uppercase">kayda girmek için kırmızı tuşa dokun</span>
          </div>

          <div className="flex flex-col items-center mt-8">
            <span className={`font-bold tracking-widest mb-4 transition-colors duration-300 ${recordState === 'recording' ? 'text-red-500 animate-pulse' : 'text-[#555]'}`}>
              {recordState === 'recording' ? 'ON AIR' : 'OFF AIR'}
            </span>
            
            {/* Büyük Kırmızı Yuvarlak */}
            <div 
              onClick={() => setRecordState('armed')}
              className={`w-40 h-40 rounded-full border-[6px] cursor-pointer transition-all duration-300 flex items-center justify-center
                ${recordState === 'idle' || recordState === 'done' ? 'border-red-600 hover:bg-red-900/25' : ''}
                ${recordState === 'armed' ? 'bg-red-600/40 border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.5)]' : ''}
                ${recordState === 'recording' ? 'bg-red-600 border-red-500 animate-pulse shadow-[0_0_50px_rgba(220,38,38,0.8)]' : ''}
              `}
            >
              {recordState === 'idle' && <div className="w-6 h-6 bg-red-600 rounded-full opacity-30"></div>}
            </div>
          </div>

          <div className="w-full flex flex-col items-center mt-8">
            <div className={`w-[90%] border-2 p-6 text-center transition-all duration-300
              ${recordState === 'idle' || recordState === 'done' ? 'border-[#444] opacity-50' : 'border-[#888] opacity-100'}
            `}>
              <span className="text-white text-base tracking-wider leading-relaxed">
                {recordState === 'recording' ? 'hissediliyor...' : 'space tuşuna basılı tut ve içinden ilk ölçünü mırıldan'}
              </span>
            </div>
          </div>

          <div className="w-full text-center mt-auto pb-4">
            <span className="text-white font-mono text-7xl font-bold tracking-wider">
              {elapsedTime.toFixed(5)}
            </span>
          </div>
        </div>

        {/* 2. ORTA SÜTUN (ÖLÇÜ VE VURGU) */}
        <div className={`flex-1 bg-[#222222] rounded shadow-inner border-t-2 border-[#444] border-l-2 border-[#444] border-r border-[#111] border-b border-[#111] p-8 flex flex-col transition-opacity duration-500 ${recordState === 'done' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          
          <div className="flex-1 flex flex-col items-center pt-6">
            <span className="text-[#888] text-sm font-bold tracking-widest mb-4">ölçü gir</span>
            
            {/* Boş ve Opaklığı Düşük Manuel Girdiler */}
            <div className="flex items-center gap-4 mb-6">
              <input 
                type="number" 
                placeholder=""
                value={numeratorInput} 
                onChange={(e) => handleManualInput('num', e.target.value)}
                className="w-20 h-20 bg-transparent border-2 border-white/30 text-white text-4xl text-center outline-none focus:border-orange-500 placeholder-white/20" 
              />
              <span className="text-white/40 text-4xl font-light">/</span>
              <input 
                type="number" 
                placeholder=""
                value={denominatorInput} 
                onChange={(e) => handleManualInput('den', e.target.value)}
                className="w-20 h-20 bg-transparent border-2 border-white/30 text-white text-4xl text-center outline-none focus:border-orange-500 placeholder-white/20" 
              />
            </div>

            <span className="text-[#888] text-sm font-bold tracking-widest mb-4">ya da</span>

            {/* Dropdown Menü (İlk satır: Seçiniz) */}
            <div className="w-52 relative border-2 border-white/40">
              <select 
                value={selectedPreset}
                onChange={handlePresetSelect}
                className="w-full bg-transparent text-white text-base p-3 outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-[#222] text-gray-500">seçiniz</option>
                {timeSignatures.map(sig => (
                  <option key={sig} value={sig} className="bg-[#222] text-white">{sig}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-3 h-3 border-b-2 border-r-2 border-white transform rotate-45"></div>
              </div>
            </div>
          </div>

          {/* Metrik Vurgu */}
          <div className="w-full flex flex-col items-center pb-8">
            <span className="text-[#888] text-sm font-bold tracking-widest mb-4">Metrik vurgu</span>
            <div className="flex gap-3 flex-wrap justify-center">
              {Array.from({ length: Math.min(numVal, 16) }, (_, i) => i + 1).map(a => (
                <div 
                  key={a} 
                  onClick={() => toggleAccent(a)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full text-base font-bold border-2 cursor-pointer transition-colors 
                    ${activeAccents.includes(a) ? 'border-white bg-white text-black' : 'border-[#666] text-[#666] hover:border-white hover:text-white'}`}
                >
                  {a}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 3. SAĞ SÜTUN (PLAY VE SONUÇLAR) */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Oynatma Bölümü */}
          <div className={`flex-1 bg-[#222222] rounded shadow-inner border-t-2 border-[#444] border-l-2 border-[#444] border-r border-[#111] border-b border-[#111] flex flex-col items-center justify-center transition-opacity duration-500 ${recordState === 'done' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <span className="text-white text-sm font-bold tracking-widest mb-6 uppercase">
              {isPlaying ? 'Metronomu Durdur' : 'Metronomu Başlat'}
            </span>
            <div 
              onClick={() => recordState === 'done' && setIsPlaying(!isPlaying)}
              className="w-28 h-28 rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
            >
              {!isPlaying ? (
                <div className="w-0 h-0 border-t-[20px] border-t-transparent border-l-[35px] border-l-white border-b-[20px] border-b-transparent ml-3"></div>
              ) : (
                <div className="flex gap-3">
                  <div className="w-3 h-12 bg-white"></div>
                  <div className="w-3 h-12 bg-white"></div>
                </div>
              )}
            </div>
          </div>

          {/* Tempo Bölümü (Yalnızca Play'e basıldığında görünür) */}
          <div className="flex-1 bg-[#222222] rounded shadow-inner border-t-2 border-[#444] border-l-2 border-[#444] border-r border-[#111] border-b border-[#111] flex flex-col items-center justify-center p-6 text-center">
            {isPlaying ? (
              <>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-white text-7xl font-bold">{bpm}</span>
                  <span className="text-[#888] text-xl">bpm</span>
                </div>
                <h2 className="text-white text-5xl italic font-serif mb-4 lowercase">{tempoInfo.term}</h2>
                <p className="text-[#888] text-sm leading-relaxed max-w-[80%]">{tempoInfo.desc}</p>
              </>
            ) : (
              <span className="text-[#555] italic">Metronom başlatılmadı...</span>
            )}
          </div>

          {/* Sarkaç (Pendulum) Bölümü */}
          <div className="flex-1 bg-[#222222] rounded shadow-inner border-t-2 border-[#444] border-l-2 border-[#444] border-r border-[#111] border-b border-[#111] relative overflow-hidden flex items-end justify-center pb-4">
             <div 
                className="w-1 bg-[#888] origin-bottom absolute bottom-0 h-[150px] flex flex-col items-center"
                style={{ 
                  animation: isPlaying ? `swing ${60 / bpm}s ease-in-out infinite alternate` : 'none',
                  transform: isPlaying ? 'none' : 'rotate(20deg)' 
                }}
             >
                <div className="w-5 h-5 bg-white rounded-full -mt-2"></div>
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}