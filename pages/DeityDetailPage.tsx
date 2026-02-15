
import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { DEITIES } from '../constants';

const DeityDetailPage: React.FC = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get('id');

  const selectedDeity = useMemo(() => {
    return DEITIES.find(d => d.id === id) || DEITIES[0];
  }, [id]);

  return (
    <div className="pb-24">
      {/* 橫幅 */}
      <section className="relative h-[35vh] flex items-center justify-center text-center overflow-hidden mb-16 bg-gradient-to-r from-[#f8cdda] to-[#d4a5a5]">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/silk-weave.png')]"></div>
        <div className="relative z-10 px-4">
          <div className="inline-block px-4 py-1 bg-white/40 backdrop-blur-md text-stone-800 font-black text-xs rounded-full mb-4 shadow-sm border border-white/50">
            2026 丙午馬年 · 諸神護佑
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-serif text-stone-900 mb-4 tracking-wider drop-shadow-sm">慶典文藝與神祇</h1>
          <p className="text-stone-800/80 text-lg font-bold opacity-90 max-w-2xl mx-auto font-serif tracking-widest uppercase">Cultural & Deities</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-12 text-sm text-stone-500 flex items-center space-x-2 font-black">
          <Link to="/" className="hover:text-stone-900 transition-colors uppercase tracking-widest">首頁</Link>
          <i className="fas fa-chevron-right text-[10px] opacity-40"></i>
          <span className="text-stone-900">{selectedDeity.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 側邊欄：諸神座次列表 */}
          <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-24">
            <h3 className="text-2xl font-black mb-6 border-b-4 border-[#b76e79] pb-4 heading-temple font-serif flex items-center">
               <i className="fas fa-list-ol mr-3 text-sm"></i> 諸神座次
            </h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {DEITIES.map(d => (
                <Link
                  key={d.id}
                  to={`/deities?id=${d.id}`}
                  className={`block px-6 py-4 rounded-xl text-base font-black transition-all shadow-sm border-2 ${
                    selectedDeity.id === d.id 
                      ? 'bg-[#b76e79] text-white scale-105 border-white shadow-xl translate-x-2' 
                      : 'bg-white text-stone-600 hover:bg-rose-50 hover:text-stone-900 border-stone-50 hover:border-[#f8cdda]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{d.name}</span>
                    {selectedDeity.id === d.id && <i className="fas fa-dharmachakra animate-spin-slow"></i>}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 內容區 */}
          <div className="lg:col-span-9 bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-stone-100 animate-in fade-in duration-700">
            <div className="aspect-[21/9] w-full relative group">
              <img src={selectedDeity.imageUrl} alt={selectedDeity.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent opacity-80"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <h1 className="text-4xl md:text-5xl font-black font-serif mb-4 tracking-wide drop-shadow-lg">{selectedDeity.name}</h1>
                <p className="text-[#f8cdda] text-xl font-black tracking-[0.4em] uppercase">{selectedDeity.title}</p>
              </div>
            </div>

            <div className="p-8 md:p-16">
              <div className="prose prose-xl max-w-none text-stone-700 leading-relaxed mb-16">
                <p className="text-2xl font-black mb-8 text-stone-900 border-l-8 border-[#b76e79] pl-8 italic">
                  {selectedDeity.description}
                </p>
                <div className="whitespace-pre-line text-lg font-medium leading-[2.2]">
                  {selectedDeity.fullDescription}
                </div>
              </div>

              {/* 功德區 */}
              <div className="bg-stone-50 rounded-[2rem] p-10 border border-stone-200">
                <h3 className="text-3xl font-black font-serif mb-10 flex items-center heading-temple text-stone-900">
                  <i className="fas fa-magic text-[#b76e79] mr-4"></i> 馬年神恩功德
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {selectedDeity.merits.map((merit, idx) => (
                    <div key={idx} className="flex items-center space-x-5 bg-white p-6 rounded-2xl shadow-sm border border-stone-100 group hover:shadow-md transition-all">
                      <div className="w-12 h-12 rounded-xl bg-[#b76e79] flex items-center justify-center text-white text-xl font-black flex-shrink-0 group-hover:rotate-[360deg] transition-all duration-700 border border-white/20">
                        {idx + 1}
                      </div>
                      <span className="font-black text-stone-900 text-xl">{merit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/services" 
                  className="px-12 py-5 bg-[#b76e79] text-white font-black rounded-full hover:bg-[#a3626d] transition-all flex items-center justify-center shadow-xl text-xl hover:scale-105 border-2 border-white/20"
                >
                   前往 2026 馬年祈福點燈 <i className="fas fa-pray ml-4"></i>
                </Link>
                <Link 
                  to="/contact" 
                  className="px-12 py-5 bg-stone-900 text-white font-black rounded-full hover:bg-black transition-all flex items-center justify-center shadow-xl text-xl hover:scale-105"
                >
                   蒞臨本宮參香 <i className="fas fa-map-marker-alt ml-4"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeityDetailPage;
