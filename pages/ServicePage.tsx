
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SERVICES } from '../constants';
import UniversalPaymentModal from '../components/LinePayModal';
import RegistrationModal from '../components/RegistrationModal';
import { RegistrationRecord } from '../types';
import { getNetworkTimeData } from '../utils/sheetHelper';

const ServicePage: React.FC = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const initialCat = query.get('cat') || '全部';

  const [filter, setFilter] = useState(initialCat);
  const [activeRegData, setActiveRegData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [regModal, setRegModal] = useState<{isOpen: boolean, name: string, price: number}>({
    isOpen: false, name: '', price: 0
  });
  const [payModal, setPayModal] = useState<{isOpen: boolean, name: string, price: number}>({
    isOpen: false, name: '', price: 0
  });

  const categories = ['全部', '點燈', '祈福法會', '拔度法會'];

  const filteredServices = useMemo(() => {
    return filter === '全部' ? SERVICES : SERVICES.filter(s => s.category === filter);
  }, [filter]);

  // 第一步：點選線上支付後跳到登記頁面
  const handleOpenRegistration = (name: string, price: number) => {
    setRegModal({ isOpen: true, name, price });
  };

  // 第二步：完成登記資料收集，儲存至後台
  const handleRegistrationConfirm = async (data: any) => {
    setIsProcessing(true);
    const timeData = await getNetworkTimeData();
    
    const newRecord: RegistrationRecord = {
      id: `REG-${Date.now()}`,
      serviceName: regModal.name,
      amount: regModal.price,
      ...data,
      timestamp: timeData.full, 
      status: 'pending'
    };
    
    const savedRegs = JSON.parse(localStorage.getItem('temple_registrations') || '[]');
    localStorage.setItem('temple_registrations', JSON.stringify([...savedRegs, newRecord]));
    
    setActiveRegData({ ...data, recordId: newRecord.id, networkTime: timeData.full });
    
    setIsProcessing(false);
    setRegModal({ ...regModal, isOpen: false });
    setPayModal({ isOpen: true, name: regModal.name, price: regModal.price });
  };

  return (
    <div className="pb-24">
      {/* 橫幅 */}
      <section className="relative h-[35vh] flex items-center justify-center text-center overflow-hidden mb-16 bg-gradient-to-r from-[#f8cdda] to-[#d4a5a5]">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/silk-weave.png')]"></div>
        <div className="relative z-10 px-4">
          <div className="inline-block px-4 py-1 bg-white/40 backdrop-blur-md text-stone-800 font-black text-xs rounded-full mb-4 shadow-sm border border-white/50 uppercase tracking-tighter">
            Blessing & Services · 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-serif text-stone-900 mb-4 tracking-wider drop-shadow-sm">線上服務與點燈</h1>
          <p className="text-stone-800/80 text-lg font-bold opacity-90 max-w-2xl mx-auto font-serif tracking-widest uppercase">Online Services & Blessing</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 處理中 Loading 狀態 */}
        {isProcessing && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-900/40 backdrop-blur-md">
            <div className="bg-white p-10 rounded-[2rem] shadow-2xl flex flex-col items-center">
              <i className="fas fa-circle-notch fa-spin text-4xl text-[#b76e79] mb-4"></i>
              <p className="font-black text-stone-700">網路通訊中，請稍候...</p>
            </div>
          </div>
        )}

        {/* 分類過濾 */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-5 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black transition-all shadow-md text-base md:text-lg border-2 ${
                filter === cat ? 'bg-[#b76e79] text-white scale-105 border-white shadow-xl' : 'bg-white text-stone-600 border-stone-50 hover:border-[#f8cdda]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 服務卡片網格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border-2 border-transparent hover:border-[#f8cdda] transition-all flex flex-col group h-full">
              <div className="aspect-square relative overflow-hidden bg-stone-50">
                <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-4 right-4 px-4 py-1.5 bg-[#b76e79] text-white rounded-lg text-sm font-black shadow-md border border-white/20">
                  NT$ {service.price.toLocaleString()}
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur text-[10px] font-black text-[#b76e79] rounded uppercase border shadow-sm">
                    {service.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-xl md:text-2xl font-black mb-3 font-serif heading-temple leading-tight group-hover:text-red-800 transition-colors">{service.name}</h3>
                <p className="text-stone-500 text-sm mb-8 flex-grow leading-relaxed font-medium">{service.description}</p>
                <button 
                  onClick={() => handleOpenRegistration(service.name, service.price)}
                  className="w-full py-4 bg-[#b76e79] text-white font-black rounded-xl hover:bg-[#a3626d] transition-all flex items-center justify-center space-x-2 shadow-lg hover:scale-[1.02] active:scale-95"
                >
                  <i className="fas fa-signature text-sm"></i>
                  <span>立即線上登記</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredServices.length === 0 && (
          <div className="py-24 text-center">
            <i className="fas fa-hourglass-start text-5xl text-stone-200 mb-6"></i>
            <p className="text-stone-400 font-bold text-xl">該分類目前尚無項目。</p>
          </div>
        )}
      </div>

      <RegistrationModal 
        isOpen={regModal.isOpen}
        onClose={() => setRegModal({ ...regModal, isOpen: false })}
        serviceName={regModal.name}
        price={regModal.price}
        onConfirm={handleRegistrationConfirm}
      />

      <UniversalPaymentModal 
        isOpen={payModal.isOpen}
        onClose={() => setPayModal({ ...payModal, isOpen: false })}
        serviceName={payModal.name}
        amount={payModal.price}
        registrationData={activeRegData}
      />
    </div>
  );
};

export default ServicePage;
