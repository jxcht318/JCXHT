
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import NewsPage from './pages/NewsPage';
import CharityPage from './pages/CharityPage';
import DeityDetailPage from './pages/DeityDetailPage';
import ServicePage from './pages/ServicePage';
import AdminPage from './pages/AdminPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ContactPlaceholder = () => {
  return (
    <div className="pb-24">
      {/* 橫幅改為玫瑰金風格 */}
      <section className="relative h-[35vh] flex items-center justify-center text-center overflow-hidden mb-12 bg-gradient-to-r from-[#f8cdda] to-[#d4a5a5]">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/silk-weave.png')]"></div>
        <div className="relative z-10 px-4">
          <div className="inline-block px-4 py-1 bg-white/40 backdrop-blur-md text-stone-800 font-black text-xs rounded-full mb-4 shadow-sm border border-white/50">
            2026 丙午馬年 · 誠心指引
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-serif text-stone-900 mb-4 tracking-wider drop-shadow-sm">與我聯絡</h1>
          <p className="text-stone-800/80 text-lg font-bold opacity-90 max-w-2xl mx-auto font-serif tracking-widest uppercase">Contact Us & Location</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 space-y-12">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border-4 border-stone-50">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-red-950 font-serif mb-4">大溪聚賢慈惠宮</h2>
            <div className="space-y-2 text-xl font-bold text-stone-800">
              <p>桃園市大溪區復興路二段318號<span className="text-red-800 font-black">（近百吉隧道）</span></p>
              <p>電話：(03) 388-4303</p>
              <p className="text-stone-500">電子信箱：daxijxcht@gmail.com</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-left">
            <div className="bg-amber-50 p-6 rounded-2xl border-l-4 border-amber-500">
              <h3 className="font-black text-stone-900 mb-2 flex items-center">
                <i className="fas fa-car mr-2 text-amber-600"></i> 自行開車
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">
                汽機車行台7線即可，備有大型免費停車場。
              </p>
            </div>
            <div className="bg-amber-50 p-6 rounded-2xl border-l-4 border-amber-500">
              <h3 className="font-black text-stone-900 mb-2 flex items-center">
                <i className="fas fa-bus mr-2 text-amber-600"></i> 大眾運輸
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">
                可於桃園客運大溪總站搭乘(5093、5104、5106)於「百吉站」下車步行100公尺抵達。
              </p>
            </div>
          </div>

          <div className="mb-10 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.1118396567476!2d121.30909347604617!3d24.82584864664047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346816febc850eeb%3A0x7b0273c0a89d0bfa!2z5aSn5rqqIOiBmuizouaFiOaDoOWggiAo6IGa6LOi6LKh56We5bufKQ!5e0!3m2!1szh-TW!2stw!4v1771094512927!5m2!1szh-TW!2stw" 
                width="100%" 
                height="400" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                title="本宮地圖位置"
              ></iframe>
          </div>
          
          <div className="text-center">
            <p className="text-stone-400 font-bold mb-10 text-lg uppercase tracking-widest flex items-center justify-center">
              <i className="fas fa-clock mr-3"></i> 24小時竭誠歡迎蒞臨參香
            </p>
            <Link to="/services" className="inline-block px-12 py-5 bg-[#b76e79] text-white font-black rounded-full hover:bg-[#a3626d] transition-all shadow-xl text-xl border-2 border-white/20 hover:scale-105">
              2026 馬年新春點燈預約
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/charity" element={<CharityPage />} />
            <Route path="/deities" element={<DeityDetailPage />} />
            <Route path="/services" element={<ServicePage />} />
            <Route path="/contact" element={<ContactPlaceholder />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
