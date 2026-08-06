'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [recordState, setRecordState] = useState<'idle' | 'armed' | 'recording' | 'done'>('idle');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  const [countedBars, setCountedBars] = useState<number>(1);
  const [numeratorInput, setNumeratorInput] = useState<string>('');
  const [denominatorInput, setDenominatorInput] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [activeAccents, setActiveAccents] = useState<number[]>([1]);
  
  // YENİ: Metronom Tekrar Modu ('once' = kaç ölçü seçildiyse o kadar çal, 'loop' = sürekli çal)
  const [loopMode, setLoopMode] = useState<'once' | 'loop'>('once');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  const recordStateRef = useRef(recordState);
  useEffect(() => {
    recordStateRef.current = recordState;
  }, [recordState]);

  const numVal = parseInt(numeratorInput) || 0;
  
  const exactBpm = elapsedTime > 0 && numVal > 0 
    ? Math.max(10, (60 * numVal * countedBars) / elapsedTime) 
    : 112;
    
  const bpmInt = Math.floor(exactBpm);
  const bpmDec = (exactBpm % 1).toFixed(2).substring(2);
  
  const getTempoInfo = (currentBpm: number) => {
    if (currentBpm <= 20) return { term: "Larghissimo", desc: "Aşırı yavaş, olabilecek en geniş ve en derin ritim.", bg: "#0d1b2a", text: "#ffffff" };
    if (currentBpm <= 45) return { term: "Grave", desc: "Çok ağır, ciddi, vakur ve derin bir ağırlıkta.", bg: "#1b263b", text: "#ffffff" };
    if (currentBpm <= 50) return { term: "Largo", desc: "Geniş, büyük, yayayarak ve oldukça yavaş.", bg: "#312244", text: "#ffffff" };
    if (currentBpm <= 55) return { term: "Lento", desc: "Yavaş, durgun, sakin ve ağırbaşlı.", bg: "#4a4e69", text: "#ffffff" };
    if (currentBpm <= 66) return { term: "Larghetto", desc: "Largo'dan biraz daha hızlı, nispeten daha rahat genişlikte.", bg: "#7209b7", text: "#ffffff" };
    if (currentBpm <= 76) return { term: "Adagio", desc: "Rahat, acele etmeden, yavaş ve lirik.", bg: "#560bad", text: "#ffffff" };
    if (currentBpm <= 80) return { term: "Adagietto", desc: "Adagio'dan biraz daha hızlı, hafif hafif akan yavaşlık.", bg: "#3a0ca3", text: "#ffffff" };
    if (currentBpm <= 85) return { term: "Marcia moderato", desc: "Askeri marş temposunda, düzenli ve ılımlı adım hızında.", bg: "#4361ee", text: "#ffffff" };
    if (currentBpm <= 92) return { term: "Andantino", desc: "Andante'den biraz daha hızlı (tarihsel olarak bazen daha yavaş).", bg: "#4cc9f0", text: "#082a35" };
    if (currentBpm <= 108) return { term: "Andante", desc: "Yürüyüş hızında, doğal insan adımı ritminde, sakin.", bg: "#2dc653", text: "#082d11" };
    if (currentBpm <= 112) return { term: "Andante moderato", desc: "Yürüyüş hızı ile orta hızın tam arasında dengeli bir tempo.", bg: "#aacc00", text: "#222a00" };
    if (currentBpm <= 120) return { term: "Moderato", desc: "Orta hızda, dengeli, ne çok hızlı ne çok yavaş (ılımlı).", bg: "#ffea00", text: "#332f00" };
    if (currentBpm <= 124) return { term: "Animato", desc: "Canlı, hareketli, ruh dolu ve heyecanlı.", bg: "#ffb700", text: "#3b2a00" };
    if (currentBpm <= 138) return { term: "Allegro", desc: "Hızlı, neşeli, parlak, canlı ve belirgin bir hızda.", bg: "#ff6d00", text: "#3d1900" };
    if (currentBpm <= 144) return { term: "Allegro assai", desc: "Çok hızlı, Allegro sınırlarını iyice zorlayan kararlılıkta.", bg: "#e63946", text: "#ffffff" };
    if (currentBpm <= 160) return { term: "Allegro vivace", desc: "Allegro'dan daha canlı, hızlı ve kıvrak adımlarla.", bg: "#d90429", text: "#ffffff" };
    if (currentBpm <= 176) return { term: "Vivace", desc: "Oldukça hızlı, neşeli, atılgan ve hayat dolu.", bg: "#ff006e", text: "#ffffff" };
    if (currentBpm <= 180) return { term: "Vivo", desc: "Canlı, ateşli, enerjik ve çok hızlı.", bg: "#bc00dd", text: "#ffffff" };
    if (currentBpm <= 200) return { term: "Presto", desc: "Çok hızlı, aceleci ve süratli.", bg: "#00f5d4", text: "#003b33" };
    return { term: "Prestissimo", desc: "Mümkün olan en yüksek hızda, adeta çılgınca ve durdurulamaz.", bg: "#ccff33", text: "#222b00" };
  };

  const tempoInfo = getTempoInfo(exactBpm);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        if (recordStateRef.current === 'armed') {
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
      if (e.code === 'Space') {
        e.preventDefault();
        if (recordStateRef.current === 'recording') {
          setRecordState('done');
          cancelAnimationFrame(animationFrameRef.current);
          setElapsedTime((performance.now() - startTimeRef.current) / 1000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const currentBeatInBarRef = useRef<number>(1);
  const timerIDRef = useRef<number | null>(null);
  
  const activeAccentsRef = useRef<number[]>(activeAccents);
  const bpmRef = useRef<number>(exactBpm);
  const numValRef = useRef<number>(numVal);
  const loopModeRef = useRef<'once' | 'loop'>(loopMode);
  const countedBarsRef = useRef<number>(countedBars);
  const playedBeatCountRef = useRef<number>(0);

  useEffect(() => {
    activeAccentsRef.current = activeAccents;
    bpmRef.current = exactBpm;
    numValRef.current = numVal;
    loopModeRef.current = loopMode;
    countedBarsRef.current = countedBars;
  }, [activeAccents, exactBpm, numVal, loopMode, countedBars]);

  const scheduleNote = (beatNumber: number, time: number) => {
    if (!audioCtxRef.current) return;
    
    const osc = audioCtxRef.current.createOscillator();
    const envelope = audioCtxRef.current.createGain();

    const isAccent = activeAccentsRef.current.includes(beatNumber);
    osc.frequency.value = isAccent ? 1200 : 800;
    
    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(envelope);
    envelope.connect(audioCtxRef.current.destination);

    osc.start(time);
    osc.stop(time + 0.1);
  };

  const nextNote = () => {
    const secondsPerBeat = 60.0 / bpmRef.current;
    nextNoteTimeRef.current += secondsPerBeat;
    
    currentBeatInBarRef.current++;
    if (currentBeatInBarRef.current > numValRef.current) {
      currentBeatInBarRef.current = 1;
    }
  };

  const scheduler = () => {
    if (!audioCtxRef.current) return;
    
    const totalBeatsToPlay = numValRef.current * countedBarsRef.current;

    while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + 0.1) {
      // Eğer 'once' modu seçildiyse ve belirlenen ölçü kadar vuruş çalındıysa durdur
      if (loopModeRef.current === 'once' && playedBeatCountRef.current >= totalBeatsToPlay) {
        const stopDelay = Math.max(0, (nextNoteTimeRef.current - audioCtxRef.current.currentTime) * 1000);
        timerIDRef.current = window.setTimeout(() => {
          setIsPlaying(false);
        }, stopDelay);
        return;
      }

      scheduleNote(currentBeatInBarRef.current, nextNoteTimeRef.current);
      playedBeatCountRef.current++;
      nextNote();
    }
    timerIDRef.current = window.setTimeout(scheduler, 25.0);
  };

  useEffect(() => {
    if (isPlaying) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      
      playedBeatCountRef.current = 0;
      currentBeatInBarRef.current = 1;
      nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.05;
      scheduler();
    } else {
      if (timerIDRef.current !== null) {
        window.clearTimeout(timerIDRef.current);
        timerIDRef.current = null;
      }
    }
    
    return () => {
      if (timerIDRef.current !== null) {
        window.clearTimeout(timerIDRef.current);
      }
    };
  }, [isPlaying]);

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
    setSelectedPreset(''); 
    if (type === 'num') setNumeratorInput(val);
    else setDenominatorInput(val);
    setActiveAccents([1]);
  };

  const timeSignatures = [
    "1/4", "2/4", "3/4", "4/4", "5/4", "6/4",
    "3/8", "4/8", "5/8", "6/8", "7/8", "9/8", "12/8",
    "1/2", "2/2", "3/2"
  ];

  const isRightColumnActive = recordState === 'done' && numVal > 0;

  return (
    <main className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-black overflow-hidden select-none">
      <style>{`
        @keyframes swing {
          0% { transform: rotate(-35deg); }
          100% { transform: rotate(35deg); }
        }
        body, html {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
          background-color: black;
        }
      `}</style>

      <div className="w-[1280px] h-[768px] bg-black p-6 flex gap-6">
        
        {/* 1. SOL SÜTUN */}
        <div className="flex-1 bg-[#222222] rounded shadow-inner border-t-2 border-[#444] border-l-2 border-[#444] border-r border-[#111] border-b border-[#111] p-8 flex flex-col items-center justify-between">
          <div className="text-center w-full">
            <span className="text-[#888888] text-sm font-bold tracking-widest uppercase">
              {recordState === 'done' ? 'yeni kayıt başlat' : 'kayda girmek için kırmızı tuşa dokun'}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className={`font-bold tracking-widest mb-4 transition-colors duration-300 
              ${recordState === 'recording' ? 'text-red-500 animate-pulse' : recordState === 'armed' ? 'text-orange-500 animate-pulse' : 'text-[#555]'}`}>
              {recordState === 'recording' ? 'ON AIR' : recordState === 'armed' ? 'READY' : 'OFF AIR'}
            </span>
            
            <div 
              onClick={() => {
                if (isPlaying) setIsPlaying(false);
                setRecordState('armed');
              }}
              className={`w-40 h-40 rounded-full border-[6px] cursor-pointer transition-all duration-300 flex items-center justify-center
                ${recordState === 'idle' || recordState === 'done' ? 'border-red-600 hover:bg-red-900/25' : ''}
                ${recordState === 'armed' ? 'bg-red-600/40 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.5)]' : ''}
                ${recordState === 'recording' ? 'bg-red-600 border-red-500 animate-pulse shadow-[0_0_50px_rgba(220,38,38,0.8)]' : ''}
              `}
            >
              {(recordState === 'idle' || recordState === 'done') && <div className="w-6 h-6 bg-red-600 rounded-full opacity-30"></div>}
            </div>
          </div>

          <div className="w-full flex flex-col items-center">
            <div className={`w-[95%] border-2 p-6 text-center rounded shadow-lg transition-all duration-300
              ${recordState === 'recording' ? 'border-white bg-white opacity-100 shadow-[0_0_25px_rgba(255,255,255,0.4)]' : recordState === 'armed' ? 'border-orange-500 bg-[#3a1d0f] shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'border-[#555] bg-[#2A2A2A] opacity-50'}
            `}>
              <span className={`text-lg font-extrabold tracking-wider uppercase leading-snug block 
                ${recordState === 'recording' ? 'text-[#222222]' : recordState === 'armed' ? 'text-orange-400 animate-pulse' : 'text-white'}
              `}>
                {recordState === 'recording' ? 'HİSSEDİLİYOR...' : 'SPACE TUŞUNA BASILI TUT VE İÇİNDEN İLK ÖLÇÜNÜ MIRILDAN'}
              </span>
            </div>
          </div>

          <div className="w-full text-center pb-2">
            <span className="text-white font-mono text-7xl font-bold tracking-wider">
              {elapsedTime.toFixed(5)}
            </span>
          </div>
        </div>

        {/* 2. ORTA SÜTUN */}
        <div className={`flex-1 flex flex-col gap-6 transition-opacity duration-500 ${recordState === 'done' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          
          <div className="flex-[0.9] bg-[#222222] rounded shadow-inner border-t-2 border-[#444] border-l-2 border-[#444] border-r border-[#111] border-b border-[#111] p-4 flex flex-col items-center justify-center">
            <span className="text-[#888] text-sm font-bold tracking-widest mb-4 uppercase">KAÇ ÖLÇÜ SAYDIN?</span>
            <div className="flex gap-3 flex-wrap justify-center">
              {[1, 2, 3, 4].map(b => (
                <div 
                  key={b} 
                  onClick={() => setCountedBars(b)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full text-base font-bold border-2 cursor-pointer transition-colors 
                    ${countedBars === b ? 'border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-[#666] text-[#666] hover:border-white hover:text-white'}`}
                >
                  {b}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-[1.2] bg-[#222222] rounded shadow-inner border-t-2 border-[#444] border-l-2 border-[#444] border-r border-[#111] border-b border-[#111] p-4 flex flex-col items-center justify-center">
            <span className="text-[#888] text-sm font-bold tracking-widest mb-4 uppercase">ölçü gir</span>
            
            <div className="flex items-center gap-4 mb-4">
              <input 
                type="number" 
                placeholder=""
                value={numeratorInput} 
                onChange={(e) => handleManualInput('num', e.target.value)}
                className="w-16 h-16 bg-transparent border-2 border-white/30 text-white text-3xl text-center outline-none focus:border-orange-500 placeholder-white/20 rounded" 
              />
              <span className="text-white/40 text-4xl font-light">/</span>
              <input 
                type="number" 
                placeholder=""
                value={denominatorInput} 
                onChange={(e) => handleManualInput('den', e.target.value)}
                className="w-16 h-16 bg-transparent border-2 border-white/30 text-white text-3xl text-center outline-none focus:border-orange-500 placeholder-white/20 rounded" 
              />
            </div>

            <span className="text-[#888] text-xs font-bold tracking-widest mb-4 uppercase">ya da</span>

            <div className="w-48 relative border-2 border-white/40 rounded">
              <select 
                value={selectedPreset}
                onChange={handlePresetSelect}
                className="w-full bg-transparent text-white text-base p-2 outline-none appearance-none cursor-pointer"
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

          <div className="flex-1 bg-[#222222] rounded shadow-inner border-t-2 border-[#444] border-l-2 border-[#444] border-r border-[#111] border-b border-[#111] p-4 flex flex-col items-center justify-center">
            {numVal > 0 ? (
              <>
                <span className="text-[#888] text-sm font-bold tracking-widest mb-4 uppercase">Metrik vurgu</span>
                <div className="flex gap-2 flex-wrap justify-center">
                  {Array.from({ length: Math.min(numVal, 16) }, (_, i) => i + 1).map(a => (
                    <div 
                      key={a} 
                      onClick={() => toggleAccent(a)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold border-2 cursor-pointer transition-colors 
                        ${activeAccents.includes(a) ? 'border-white bg-white text-black' : 'border-[#666] text-[#666] hover:border-white hover:text-white'}`}
                    >
                      {a}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <span className="text-[#444] text-xs italic">Ölçü seçildiğinde vurgular görünecek</span>
            )}
          </div>

        </div>

        {/* 3. SAĞ SÜTUN */}
        <div className="flex-1 flex flex-col gap-6">
          {/* METRONOMU BAŞLAT KUTUSU VE REPEAT SEÇENEKLERİ */}
          <div className={`flex-1 bg-white rounded shadow-inner flex flex-col items-center justify-between p-5 transition-opacity duration-500 ${isRightColumnActive ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            
            <div className="w-full flex items-center justify-between">
              <span className="text-[#222222] text-xs font-bold tracking-widest uppercase">
                {isPlaying ? 'Metronomu Durdur' : 'Metronomu Başlat'}
              </span>

              {/* DÖNGÜ MODU BUTONLARI */}
              <div className="flex gap-2">
                {/* 1. Seçenek: Seçilen Ölçü Kadar Çal (Varsayılan) */}
                <button 
                  onClick={() => setLoopMode('once')}
                  title="Seçilen ölçü sayısı kadar çal ve dur"
                  className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                    loopMode === 'once' 
                      ? 'bg-[#222222] text-[#22c55e] border-2 border-[#22c55e] shadow-md' 
                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                  }`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 5h8a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H7" />
                    <polyline points="10 18 7 15 10 12" />
                    <text x="12.5" y="11" fontSize="8" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">1</text>
                    <circle cx="12.5" cy="20" r="1.3" fill="currentColor" />
                  </svg>
                </button>

                {/* 2. Seçenek: Sürekli Repeat Et */}
                <button 
                  onClick={() => setLoopMode('loop')}
                  title="Sürekli tekrar et"
                  className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                    loopMode === 'loop' 
                      ? 'bg-[#222222] text-[#22c55e] border-2 border-[#22c55e] shadow-md' 
                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                  }`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 6h8a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7" />
                    <polyline points="10 20 7 17 10 14" />
                  </svg>
                </button>
              </div>
            </div>

            <div 
              onClick={() => isRightColumnActive && setIsPlaying(!isPlaying)}
              className="w-24 h-24 my-auto rounded-full border-4 border-[#222222] flex items-center justify-center cursor-pointer hover:bg-black/5 transition-colors shadow-lg"
            >
              {!isPlaying ? (
                <div className="w-0 h-0 border-t-[18px] border-t-transparent border-l-[30px] border-l-[#222222] border-b-[18px] border-b-transparent ml-2"></div>
              ) : (
                <div className="flex gap-2.5">
                  <div className="w-2.5 h-10 bg-[#222222]"></div>
                  <div className="w-2.5 h-10 bg-[#222222]"></div>
                </div>
              )}
            </div>
          </div>

          {/* DİNAMİK RENKLENEN TEMPO KUTUSU */}
          <div 
            className={`flex-1 rounded shadow-inner border-t-2 border-l-2 border-r border-b flex flex-col items-center justify-center p-6 text-center transition-all duration-700 
              ${isPlaying ? 'opacity-100' : 'opacity-30 border-[#444] border-r-[#111] border-b-[#111]'}`}
            style={{ 
              backgroundColor: isPlaying ? tempoInfo.bg : '#222222',
              borderColor: isPlaying ? `${tempoInfo.bg}88` : undefined
            }}
          >
            {isPlaying ? (
              <>
                <div className="flex items-baseline mb-2" style={{ color: tempoInfo.text }}>
                  <span className="text-7xl font-bold leading-none">{bpmInt}</span>
                  <sup className="text-3xl font-bold leading-none relative -top-4">.{bpmDec}</sup>
                  <span className="text-xl ml-2 opacity-80 font-medium">bpm</span>
                </div>
                <h2 className="text-4xl italic font-serif mb-3 lowercase transition-colors duration-700" style={{ color: tempoInfo.text }}>
                  {tempoInfo.term}
                </h2>
                <p className="text-xs leading-relaxed max-w-[85%] font-medium transition-colors duration-700" style={{ color: tempoInfo.text, opacity: 0.9 }}>
                  {tempoInfo.desc}
                </p>
              </>
            ) : (
              <span className="text-[#555] italic">Metronom başlatılmadı...</span>
            )}
          </div>

          <div className={`flex-1 bg-[#222222] rounded shadow-inner border-t-2 border-[#444] border-l-2 border-[#444] border-r border-[#111] border-b border-[#111] relative overflow-hidden flex items-end justify-center pb-4 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-30'}`}>
             <div 
                className="w-1 bg-[#888] origin-bottom absolute bottom-0 h-[150px] flex flex-col items-center"
                style={{ 
                  animation: isPlaying ? `swing ${60 / exactBpm}s ease-in-out infinite alternate` : 'none',
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