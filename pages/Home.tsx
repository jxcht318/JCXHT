
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NEWS, DEITIES, SERVICES, CHARITY_ACTIVITIES } from '../constants';
import { getNetworkTimeData } from '../utils/sheetHelper';
import { NewsItem, DeityInfo } from '../types';

const Home: React.FC = () => {
  const [currentLunar, setCurrentLunar] = useState<string>('校對中...');
  const [currentGanzhi, setCurrentGanzhi] = useState<string>('丙午');
  const [displayNews, setDisplayNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const syncTime = async () => {
      const timeData = await getNetworkTimeData();
      setCurrentLunar(timeData.lunar);
      setCurrentGanzhi(timeData.yearGanZhi);
    };
    syncTime();

    // 加載消息（包含本地發布）
    const localSaved = JSON.parse(localStorage.getItem('temple_news') || '[]');
    const combined = [...localSaved, ...NEWS].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setDisplayNews(combined.slice(0, 3));
  }, []);

  // 篩選首頁展示的三尊神祇：瑤池金母、關聖帝君、五路財神
  const featuredDeityIds = ['yaochi', 'guansheng', 'five-wealth'];
  const homeDeities = DEITIES.filter(d => featuredDeityIds.includes(d.id))
    .sort((a, b) => featuredDeityIds.indexOf(a.id) - featuredDeityIds.indexOf(b.id));

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case '堂務消息': return 'bg-indigo-50 text-indigo-800 border-indigo-100';
      case '活動公告': return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case '慶典公告': return 'bg-rose-50 text-rose-800 border-rose-100';
      default: return 'bg-stone-50 text-stone-800 border-stone-100';
    }
  };

  const historyImageUrl = "https://images.unsplash.com/photo-1590429517178-f3d9178f9f03?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="flex flex-col">
      {/* 2026 丙午馬年 Hero Section */}
      <section className="relative h-[68vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-400/20 via-transparent to-red-900/10"></div>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/gold-scale.png')]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl px-4 sm:px-6 mt-12">
          <div className="inline-block px-8 py-2.5 bg-red-800 text-amber-50 font-black text-sm rounded-full mb-6 shadow-2xl animate-bounce border-2 border-amber-400/50">
            歲次{currentGanzhi} · 今日農曆 {currentLunar}
          </div>
          <h2 className="text-red-950 text-3xl sm:text-4xl font-black mb-4 tracking-[0.5em] drop-shadow-sm font-serif">
            大溪聚賢慈惠宮
          </h2>
          <h1 className="text-red-950 text-5xl sm:text-6xl md:text-6xl font-black font-serif mb-8 leading-tight animate-slide-up drop-shadow-[0_2px_10px_rgba(251,191,36,0.4)]">
            火馬騰雲 <span className="text-red-900">好運降臨</span>
          </h1>
          <p className="text-red-900 text-xl md:text-2xl font-bold mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            慈惠顯聖庇萬民 · {currentGanzhi}祈福迎祥瑞
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <Link 
              to="/services" 
              className="px-12 py-4 bg-red-800 text-amber-50 font-black rounded-full hover:bg-stone-950 hover:text-amber-400 transition-all shadow-2xl hover:scale-105 border-2 border-amber-500/30"
            >
              2026 新春點燈 · 補運
            </Link>
            <Link 
              to="/news" 
              className="px-12 py-4 bg-white/50 backdrop-blur-xl text-red-950 border-2 border-red-950 font-black rounded-full hover:bg-red-950 hover:text-white transition-all shadow-xl"
            >
              新春公告
            </Link>
          </div>
        </div>
      </section>

      {/* 諸神護佑區塊 (僅展示 瑤池金母、關聖帝君、五路財神) */}
      <section className="py-24 bg-stone-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black font-serif text-red-900 mb-6">諸神護佑 · 靈感顯赫</h2>
            <div className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full mb-8"></div>
            <p className="text-stone-500 font-bold tracking-widest uppercase text-sm">Ju Xian Deities & Guardians</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {homeDeities.map((deity) => (
              <Link 
                key={deity.id} 
                to={`/deities?id=${deity.id}`}
                className="group relative overflow-hidden rounded-[2.5rem] bg-white shadow-xl border border-stone-100 hover:shadow-2xl transition-all duration-700"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={deity.imageUrl} alt={deity.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/10 to-transparent opacity-60"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <span className="text-amber-400 text-xs font-black tracking-widest mb-2 block uppercase">{deity.title}</span>
                  <h3 className="text-3xl font-black font-serif mb-4">{deity.name}</h3>
                  <p className="text-white/80 text-sm font-medium line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {deity.description}
                  </p>
                  <div className="flex items-center text-amber-400 text-xs font-black uppercase tracking-tighter">
                    查看詳情 <i className="fas fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
             <Link 
               to="/deities" 
               className="px-12 py-4 bg-white border-2 border-red-900 text-red-900 font-black rounded-full hover:bg-red-900 hover:text-white transition-all shadow-lg"
             >
               查看完整諸神座次
             </Link>
          </div>
        </div>
      </section>

      {/* 本堂沿革區塊 */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-red-900/10 rounded-[3rem] blur-2xl"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] lg:aspect-auto">
                <img 
                  src={historyImageUrl} 
                  alt="聚賢慈惠宮景色" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 text-white">
                  <p className="text-xl font-serif italic border-l-4 border-amber-500 pl-4">「青山綠水、靈氣十足，確是修身養性最佳道場。」</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-black font-serif text-red-900 mb-6 tracking-tight">本堂沿革</h2>
                <div className="w-20 h-1.5 bg-amber-500 rounded-full"></div>
              </div>
              
              <div className="space-y-6 text-stone-700 leading-loose text-lg font-medium">
                <p>
                  聚賢慈惠堂位於大溪慈湖，青山綠水、景色綺麗，香客至於此間，靈氣十足。
                </p>
                <p>
                  民國七十一年奉瑤池金母懿旨接旨，由開山堂主 <span className="text-red-900 font-black">李緞津</span> 創立，至今已屆數十餘載，信徒遍佈四方。
                </p>
                <div className="bg-amber-50 p-8 rounded-3xl border-l-8 border-red-800 shadow-sm mt-8 text-base">
                  <p className="text-red-950 font-black mb-2 flex items-center">
                    <i className="fas fa-heart text-amber-600 mr-3"></i> 慈善功德會
                  </p>
                  本堂積極參與慈善事業，成立「聚賢瑤池愛心功德會」，定期發放物資，關懷社會弱勢族群。
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 最新消息區塊 */}
      <section className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b-4 border-amber-400 pb-6">
            <h2 className="text-4xl font-black font-serif heading-temple flex items-center">
              <i className="fas fa-horse text-red-800 mr-5"></i> 最新消息
            </h2>
            <Link to="/news" className="text-red-900 font-black hover:underline flex items-center text-lg">
              全部公告 <i className="fas fa-chevron-right ml-2 text-sm"></i>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayNews.map((item) => {
               const dateObj = new Date(item.date);
               const mm = (dateObj.getMonth() + 1).toString().padStart(2, '0');
               const dd = dateObj.getDate().toString().padStart(2, '0');
               return (
                <div key={item.id} className="group bg-white rounded-[2rem] overflow-hidden border border-stone-100 hover:border-amber-400 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                  {item.imageUrls && item.imageUrls.length > 0 ? (
                    <div className="h-48 overflow-hidden relative">
                       <img src={item.imageUrls[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                       <div className="absolute top-4 right-4 px-3 py-1 bg-red-900/80 text-white text-[10px] font-black rounded-lg backdrop-blur-sm border border-white/20">
                          {item.category}
                       </div>
                    </div>
                  ) : item.imageUrl ? (
                    <div className="h-48 overflow-hidden relative">
                       <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                       <div className="absolute top-4 right-4 px-3 py-1 bg-red-900/80 text-white text-[10px] font-black rounded-lg backdrop-blur-sm border border-white/20">
                          {item.category}
                       </div>
                    </div>
                  ) : (
                    <div className="h-2 bg-red-900"></div>
                  )}
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-stone-400 font-black text-xs uppercase">
                        {item.date} · 農曆 {item.lunarDate}
                      </div>
                      <span className={`px-3 py-1 text-[10px] font-black rounded-lg border ${getCategoryStyles(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-black mb-4 group-hover:text-red-800 transition-colors heading-temple font-serif leading-tight line-clamp-2 min-h-[3.5rem]">{item.title}</h3>
                    <p className="text-stone-500 text-sm line-clamp-3 mb-8 flex-grow leading-relaxed">{item.summary}</p>
                    <Link to={`/news`} className="text-red-900 font-black text-sm flex items-center group-hover:translate-x-3 transition-transform">
                      詳情 <i className="fas fa-arrow-right ml-2"></i>
                    </Link>
                  </div>
                </div>
               );
            })}
          </div>
        </div>
      </section>

      {/* 2026 丙午祈福區塊 */}
      <section className="py-24 bg-stone-950 text-amber-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cloud.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl font-black font-serif mb-8 text-amber-400 leading-tight">2026 {currentGanzhi}祈福 · 火馬騰雲</h2>
          <p className="text-amber-100/90 text-xl mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
            恭迎歲次{currentGanzhi}年，今日農曆 {currentLunar}。本宮邀請十方大德線上點燈，祈求流年平安。
          </p>
          <Link 
            to="/services" 
            className="inline-block px-14 py-6 bg-red-800 text-amber-50 font-black rounded-full text-2xl hover:bg-amber-500 hover:text-stone-950 transition-all shadow-2xl hover:scale-105 border-4 border-amber-400/50"
          >
            立即預約 2026 點燈
          </Link>
        </div>
      </section>

      {/* 聯絡資訊區塊 - 更新版 */}
      <section className="py-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-12">
              <h2 className="text-5xl font-black font-serif text-red-900 mb-8 tracking-widest">聯絡資訊</h2>
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center text-white mr-6 shadow-lg flex-shrink-0 mt-1">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-stone-800 block">桃園市大溪區復興路二段318號</span>
                    <span className="text-red-800 font-black text-sm">（近百吉隧道）</span>
                  </div>
                </div>
                <div className="flex items-center group">
                  <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center text-white mr-6 shadow-lg flex-shrink-0">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <span className="text-xl font-bold text-stone-800">03-388-4303</span>
                </div>
                <div className="flex items-center group">
                  <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center text-white mr-6 shadow-lg flex-shrink-0">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <span className="text-xl font-bold text-stone-800">daxijxcht@gmail.com</span>
                </div>
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white mr-6 shadow-lg flex-shrink-0 mt-1">
                    <i className="fas fa-car"></i>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-stone-800 block">自行開車</span>
                    <span className="text-stone-600 text-sm font-medium">汽機車行台7線即可，備有大型免費停車場。</span>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white mr-6 shadow-lg flex-shrink-0 mt-1">
                    <i className="fas fa-bus"></i>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-stone-800 block">大眾運輸</span>
                    <span className="text-stone-600 text-sm font-medium leading-relaxed">可於桃園客運大溪總站搭乘(5093、5104、5106)於「百吉站」下車步行100公尺抵達。</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white sticky top-24">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.1118396567476!2d121.30909347604617!3d24.82584864664047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346816febc850eeb%3A0x7b0273c0a89d0bfa!2z5aSn5rqqIOiBmuizouaFiOaDoOWggiAo6IGa6LOi6LKh56We5bufKQ!5e0!3m2!1szh-TW!2stw!4v1771094512927!5m2!1szh-TW!2stw" 
                width="100%" 
                height="480" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                title="大溪聚賢慈惠宮準確位置"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
