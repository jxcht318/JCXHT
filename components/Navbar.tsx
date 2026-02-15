
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: '首頁', path: '/' },
    { name: '堂務消息', path: '/news' },
    { name: '關懷活動', path: '/charity' },
    { name: '慶典文藝', path: '/deities' },
    { name: '服務項目', path: '/services' },
    { name: '與我聯絡', path: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-red-900 rounded-full flex items-center justify-center text-amber-400 shadow-lg group-hover:scale-110 transition-transform border-2 border-amber-500/20">
              <span className="text-xl font-black">慈</span>
            </div>
            <div className="flex flex-col">
              {/* 標題字體改為黑色/深紅 red-950 */}
              <span className="text-2xl font-black tracking-widest font-serif text-red-950 drop-shadow-sm">大溪聚賢慈惠宮</span>
              <span className="text-[10px] font-black text-red-900/60 uppercase tracking-widest">Ju Xian Ci Hui Temple</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-black transition-all hover:text-amber-600 relative py-1 ${
                    isActive 
                      ? 'text-amber-500' 
                      : 'text-red-950 hover:scale-105'
                  }`}
                >
                  {link.name}
                  {/* 符合附圖的橘黃色底線 */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-full animate-in fade-in slide-in-from-left-2 duration-300"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-red-950 hover:bg-red-50 transition-colors"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="px-6 pt-4 pb-8 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-4 text-xl font-black rounded-2xl transition-all ${
                location.pathname === link.path 
                  ? 'text-amber-600 bg-amber-50 border-l-8 border-amber-500' 
                  : 'text-red-950 hover:bg-red-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
