
import React, { useState, useEffect } from 'react';
import { NEWS, CONFIG } from '../constants';
import { NewsItem } from '../types';
import { fetchNewsFromGoogleSheet } from '../utils/sheetHelper';

const NewsPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('全部');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const categories = ['全部', '堂務消息', '活動公告', '慶典公告'];

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      const localSaved = JSON.parse(localStorage.getItem('temple_news') || '[]');
      const sheetNews = await fetchNewsFromGoogleSheet(CONFIG.NEWS_SHEET_ID);
      const combined = [...localSaved, ...sheetNews, ...NEWS].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setAllNews(combined);
      setIsLoading(false);
    };
    loadNews();
  }, []);

  const filteredNews = filter === '全部' 
    ? allNews 
    : allNews.filter(item => item.category === filter);

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case '堂務消息': return 'bg-indigo-50 text-indigo-800 border-indigo-100';
      case '活動公告': return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case '慶典公告': return 'bg-rose-50 text-rose-800 border-rose-100';
      default: return 'bg-stone-50 text-stone-800 border-stone-100';
    }
  };

  // 取得封面圖輔助函式
  const getCoverImage = (item: NewsItem) => {
    if (item.imageUrls && item.imageUrls.length > 0) return item.imageUrls[0];
    return item.imageUrl;
  };

  return (
    <div className="pb-24">
      {/* 橫幅 */}
      <section className="relative h-[35vh] flex items-center justify-center text-center overflow-hidden mb-16 bg-gradient-to-r from-[#f8cdda] to-[#d4a5a5]">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/silk-weave.png')]"></div>
        <div className="relative z-10 px-4">
          <div className="inline-block px-4 py-1 bg-white/40 backdrop-blur-md text-stone-800 font-black text-xs rounded-full mb-4 shadow-sm border border-white/50">
            2026 丙午馬年 · 數位公告
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-serif text-stone-900 mb-4 tracking-wider drop-shadow-sm">最新消息與公告</h1>
          <p className="text-stone-800/80 text-lg font-bold opacity-90 max-w-2xl mx-auto font-serif tracking-widest uppercase">Latest News & Announcements</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-xl font-black transition-all shadow-md ${
                filter === cat ? 'bg-[#b76e79] text-white scale-105 border-2 border-white/50' : 'bg-white text-stone-600 border-2 border-stone-50 hover:border-[#b76e79]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-[#b76e79] mb-4"></i>
            <p className="font-bold text-stone-500">正在整理公告消息...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredNews.length === 0 ? (
              <div className="py-20 text-center text-stone-400 font-bold border-2 border-dashed border-stone-200 rounded-[2.5rem]">目前尚無公告消息</div>
            ) : (
              filteredNews.map((item) => {
                const dateObj = new Date(item.date);
                const mm = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                const dd = dateObj.getDate().toString().padStart(2, '0');
                const cover = getCoverImage(item);

                return (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-[2rem] p-6 md:p-8 shadow-md border-2 border-transparent hover:border-[#b76e79] hover:shadow-xl transition-all group cursor-pointer flex flex-col md:flex-row gap-8 items-center"
                    onClick={() => setSelectedNews(item)}
                  >
                    {/* 日期 (左) */}
                    <div className="md:w-32 flex-shrink-0 flex flex-col items-center justify-center border-stone-100 pr-0 md:pr-4 text-center">
                      <span className="text-4xl font-black text-stone-800 mb-1">{mm}/{dd}</span>
                      <p className="text-[10px] font-black text-stone-500 uppercase tracking-tighter">LUNAR {item.lunarDate}</p>
                    </div>

                    {/* 文字內容 (中) */}
                    <div className="flex-grow">
                      <span className={`inline-block px-3 py-1 text-[10px] font-black rounded-lg mb-3 border ${getCategoryStyles(item.category)}`}>
                        {item.category}
                      </span>
                      <h3 className="text-xl md:text-2xl font-black mb-3 group-hover:text-[#b76e79] transition-colors heading-temple font-serif leading-tight">{item.title}</h3>
                      <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">{item.summary}</p>
                      <button className="text-xs font-black text-stone-900 flex items-center group-hover:translate-x-4 transition-transform">
                        閱讀詳細內容 <i className="fas fa-arrow-right ml-2 text-[#b76e79]"></i>
                      </button>
                    </div>

                    {/* 圖片封面 (右) */}
                    {cover && (
                      <div className="w-full md:w-48 aspect-video md:aspect-square rounded-2xl overflow-hidden shrink-0 border border-stone-50 shadow-sm md:ml-4">
                        <img src={cover} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 公告內容詳細彈窗 */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md" onClick={() => setSelectedNews(null)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className={`h-3 w-full bg-[#b76e79]`}></div>
            <div className="overflow-y-auto p-10 md:p-16 custom-scrollbar">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className={`px-4 py-1.5 text-xs font-black rounded-lg border mb-4 inline-block ${getCategoryStyles(selectedNews.category)}`}>
                    {selectedNews.category}
                  </span>
                  <h2 className="text-4xl font-black heading-temple font-serif leading-tight mb-3">{selectedNews.title}</h2>
                  <p className="text-stone-400 font-bold text-sm uppercase tracking-widest flex items-center">
                    <i className="far fa-calendar-alt mr-2"></i> 公告日期: {selectedNews.date} (農曆: {selectedNews.lunarDate})
                  </p>
                </div>
                <button onClick={() => setSelectedNews(null)} className="text-stone-300 hover:text-[#b76e79] transition-colors p-2">
                  <i className="fas fa-times text-3xl"></i>
                </button>
              </div>
              
              <div className="prose prose-lg prose-stone max-w-none text-stone-700">
                <p className="text-xl font-black text-stone-900 mb-10 pb-6 border-b-2 border-stone-50 italic leading-relaxed">
                  {selectedNews.summary}
                </p>
                <div className="whitespace-pre-line text-lg font-medium leading-[2.2] tracking-wide mb-12">
                  {selectedNews.content || "暫無詳細內容。"}
                </div>
              </div>

              {/* 多圖展示牆 */}
              {(selectedNews.imageUrls?.length || 0) > 0 || selectedNews.imageUrl ? (
                <div className="mt-12 space-y-4">
                  <h4 className="font-black text-stone-400 text-xs uppercase tracking-widest border-b pb-2">相關照片檔案 ({Math.max(selectedNews.imageUrls?.length || 0, selectedNews.imageUrl ? 1 : 0)})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedNews.imageUrls?.map((url, idx) => (
                      <div key={idx} className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md cursor-zoom-in group" onClick={() => setZoomImage(url)}>
                        <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    ))}
                    {!selectedNews.imageUrls?.length && selectedNews.imageUrl && (
                       <div className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md cursor-zoom-in group" onClick={() => setZoomImage(selectedNews.imageUrl!)}>
                        <img src={selectedNews.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="mt-16 flex justify-between items-center border-t border-stone-50 pt-8">
                <span className="text-xs font-bold text-stone-300 italic">Ju Xian Ci Hui Temple Bulletin</span>
                <button onClick={() => setSelectedNews(null)} className="px-12 py-4 bg-[#b76e79] text-white font-black rounded-xl hover:bg-[#a3626d] transition-all shadow-xl">
                  關閉公告視窗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {zoomImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={() => setZoomImage(null)}>
          <button className="absolute top-8 right-8 text-white text-4xl hover:text-rose-400 transition-colors">
            <i className="fas fa-times"></i>
          </button>
          <img 
            src={zoomImage} 
            alt="放大檢視" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300" 
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default NewsPage;
