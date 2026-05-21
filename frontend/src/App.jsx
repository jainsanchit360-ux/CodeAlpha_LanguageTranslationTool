import { useState, useEffect, useRef } from 'react';

const LANGUAGES = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ru: "Russian",
  ar: "Arabic",
  hi: "Hindi",
  pt: "Portuguese"
};

function App() {
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef(null);

  const translateText = async (text, src, tgt) => {
    if (!text.trim()) {
      setTranslatedText('');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          source_lang: src,
          target_lang: tgt
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setTranslatedText(data.translated_text);
      } else {
        console.error("Translation error:", data.detail);
        setTranslatedText("Error: Could not translate text.");
      }
    } catch (error) {
      console.error("Failed to connect to API:", error);
      setTranslatedText("Error: Could not connect to translation service. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      translateText(sourceText, sourceLang, targetLang);
    }, 800);
    
    return () => clearTimeout(debounceTimer.current);
  }, [sourceText, sourceLang, targetLang]);

  const handleCopy = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
    }
  };

  const handleSpeak = () => {
    if (translatedText) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = targetLang;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col items-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        
        <header className="text-center space-y-4 my-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            Global Translate
          </h1>
          <p className="text-slate-400 text-lg">Break down language barriers instantly.</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          
          {/* Left Panel */}
          <div className="glass flex flex-col h-[500px] overflow-hidden group hover:border-slate-600 transition-colors duration-300">
            <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/40">
              <select 
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="bg-transparent text-slate-200 text-lg font-medium outline-none cursor-pointer hover:text-white transition-colors"
              >
                <option value="auto" className="bg-slate-800">Detect Language</option>
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code} className="bg-slate-800">{name}</option>
                ))}
              </select>
            </div>
            
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text here..."
              className="flex-1 w-full p-6 bg-transparent resize-none outline-none text-xl md:text-2xl text-slate-100 placeholder:text-slate-500 focus:ring-0"
            />
          </div>

          {/* Swap Button (Desktop only for visual flair) */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center">
            <button 
              className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-110 active:scale-95"
              onClick={() => {
                if (sourceLang !== 'auto') {
                  const tempLang = sourceLang;
                  setSourceLang(targetLang);
                  setTargetLang(tempLang);
                  setSourceText(translatedText);
                }
              }}
              title="Swap Languages"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </button>
          </div>

          {/* Right Panel */}
          <div className="glass flex flex-col h-[500px] overflow-hidden group hover:border-slate-600 transition-colors duration-300">
            <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/40 flex justify-between items-center">
              <select 
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-transparent text-slate-200 text-lg font-medium outline-none cursor-pointer hover:text-white transition-colors"
              >
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code} className="bg-slate-800">{name}</option>
                ))}
              </select>

              <div className="flex gap-3">
                <button 
                  onClick={handleCopy}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none"
                  title="Copy Translation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                </button>
                <button 
                  onClick={handleSpeak}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none"
                  title="Listen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 w-full p-6 relative">
              {isLoading && (
                <div className="absolute top-6 left-6 flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-indigo-400 font-medium text-sm animate-pulse">Translating...</span>
                </div>
              )}
              <div 
                className={`w-full h-full text-xl md:text-2xl transition-opacity duration-300 overflow-y-auto whitespace-pre-wrap ${isLoading ? 'opacity-50' : 'opacity-100'} ${translatedText ? 'text-slate-100' : 'text-slate-500'}`}
              >
                {translatedText || (isLoading ? '' : "Translation will appear here...")}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;
