
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-red-800 rounded-full flex items-center justify-center text-white">
                <span className="text-sm font-bold">慈</span>
              </div>
              <span className="text-xl font-bold font-serif text-white tracking-widest">大溪聚賢慈惠宮</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              慈悲顯聖，聚賢共修。本宮致力於宏揚瑤池金母聖教，並投入地方慈善公益與社會教化，為信眾提供心靈寄託之所。
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/p/%E8%81%9A%E8%B3%A2%E6%85%88%E6%83%A0%E5%A0%82-100067094255879/?locale=zh_TW" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-green-600 transition-colors">
                <i className="fab fa-line"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-pink-600 transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-red-700 pl-3">網站地圖</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/news" className="hover:text-red-500 transition-colors">最新消息</Link></li>
              <li><Link to="/charity" className="hover:text-red-500 transition-colors">關懷活動</Link></li>
              <li><Link to="/deities" className="hover:text-red-500 transition-colors">慶典文藝</Link></li>
              <li><Link to="/services" className="hover:text-red-500 transition-colors">服務項目</Link></li>
              <li><Link to="/contact" className="hover:text-red-500 transition-colors">本堂位置</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-red-700 pl-3">線上服務</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services?cat=點燈" className="hover:text-red-500 transition-colors">線上點燈</Link></li>
              <li><Link to="/services?cat=拔度法會" className="hover:text-red-500 transition-colors">拔度法會</Link></li>
              <li><Link to="/services?cat=祈福法會" className="hover:text-red-500 transition-colors">祈福消災</Link></li>
              <li><Link to="/charity" className="hover:text-red-500 transition-colors">慈善捐助</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-red-700 pl-3">聯繫資訊</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt mt-1 text-red-600"></i>
                <span>桃園市大溪區復興路二段318號<br/><span className="text-xs opacity-60">（近百吉隧道）</span></span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-phone-alt text-red-600"></i>
                <span>03-388-4303</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-red-600"></i>
                <span className="lowercase">daxijxcht@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-clock text-red-600"></i>
                <span>24小時竭誠歡迎</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-60">
          <p>© 2026 大溪聚賢慈惠宮 (歲次丙午馬年). All Rights Reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
             <Link to="/admin" className="hover:text-white transition-colors underline">管理登入</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
