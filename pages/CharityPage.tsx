
import React, { useState, useEffect } from 'react';
import { CHARITY_ACTIVITIES } from '../constants';
import { CharityActivity, VolunteerRecord, CharityDonationRecord } from '../types';
import { getNetworkTimeData } from '../utils/sheetHelper';
import UniversalPaymentModal from '../components/LinePayModal';

const CharityPage: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<CharityActivity | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [allActivities, setAllActivities] = useState<CharityActivity[]>([]);
  
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const [donationData, setDonationData] = useState({ name: '', phone: '', address: '', amount: 1000 });
  const [vFormData, setVFormData] = useState({ name: '', phone: '', email: '', address: '', experience: '' });
  const [activePaymentInfo, setActivePaymentInfo] = useState<any>(null);

  useEffect(() => {
    const localCharity = JSON.parse(localStorage.getItem('temple_charity') || '[]');
    const combined = [...localCharity, ...CHARITY_ACTIVITIES].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setAllActivities(combined);
  }, []);

  const getCoverImage = (act: CharityActivity) => {
    if (act.imageUrls && act.imageUrls.length > 0) return act.imageUrls[0];
    return act.imageUrl || '';
  };

  const submitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    const timeData = await getNetworkTimeData();
    const record: CharityDonationRecord = {
      id: `DON-${Date.now()}`,
      ...donationData,
      timestamp: timeData.full,
      status: 'pending'
    };
    
    const saved = JSON.parse(localStorage.getItem('temple_donations') || '[]');
    localStorage.setItem('temple_donations', JSON.stringify([...saved, record]));
    
    setActivePaymentInfo({ 
      ...donationData, 
      recordId: record.id, 
      networkTime: timeData.full, 
      type: 'charity_donation' 
    });
    
    setShowDonationModal(false);
    setShowPaymentModal(true);
  };

  const submitVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const timeData = await getNetworkTimeData();
      const newRecord: VolunteerRecord = {
        id: `VOL-${Date.now()}`,
        name: vFormData.name,
        phone: vFormData.phone,
        email: vFormData.email || '',
        address: vFormData.address,
        experience: vFormData.experience,
        timestamp: timeData.full
      };

      const saved = JSON.parse(localStorage.getItem('temple_volunteers') || '[]');
      localStorage.setItem('temple_volunteers', JSON.stringify([...saved, newRecord]));
      
      alert("【登記成功】感謝您的發心！資料已存入志工名冊，本宮將儘速與您聯繫。");
      setShowVolunteerModal(false);
      setVFormData({ name: '', phone: '', email: '', address: '', experience: '' });
    } catch (error) {
      alert("提交異常，請稍後再試。");
    }
  };

  return (
    <div className="pb-24">
      <section className="relative h-[35vh] flex items-center justify-center text-center overflow-hidden mb-16 bg-gradient-to-r from-[#f8cdda] to-[#d4a5a5]">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/silk-weave.png')]"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-black font-serif text-stone-900 mb-4 tracking-wider">慈悲關懷・社會服務</h1>
          <p className="text-stone-800/80 text-lg font-bold font-serif tracking-widest uppercase">JU XIAN CI HUI CHARITY</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {/* 慈善捐助 */}
          <div className="bg-white rounded-[2.5rem] p-12 shadow-xl border-2 border-transparent hover:border-[#f8cdda] transition-all group flex flex-col justify-between">
            <div>
              <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-800 mb-8 border border-stone-100 group-hover:bg-[#b76e79] group-hover:text-white transition-all">
                <i className="fas fa-heart text-4xl"></i>
              </div>
              <h2 className="text-3xl font-black font-serif mb-6 heading-temple">慈善捐助</h2>
              <p className="text-stone-600 mb-10 text-lg leading-relaxed font-medium">本宮積極參與社會公益與物資發放，期盼十方大德共襄盛舉，將溫暖傳遞至需要的角落。</p>
            </div>
            <button onClick={() => setShowDonationModal(true)} className="w-full py-4 bg-[#b76e79] text-white font-black rounded-xl hover:bg-[#a3626d] transition-all shadow-lg">立即參與捐助</button>
          </div>

          {/* 社會服務 */}
          <div className="bg-white rounded-[2.5rem] p-12 shadow-xl border-2 border-transparent hover:border-[#f8cdda] transition-all group flex flex-col justify-between">
            <div>
              <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-800 mb-8 border border-stone-100 group-hover:bg-[#b76e79] group-hover:text-white transition-all">
                <i className="fas fa-hands-helping text-4xl"></i>
              </div>
              <h2 className="text-3xl font-black font-serif mb-6 heading-temple">社會服務</h2>
              <p className="text-stone-600 mb-10 text-lg leading-relaxed font-medium">誠摯邀請信眾加入志工行列，一同參與環境維護與偏鄉關懷，讓愛心發光發熱。</p>
            </div>
            <button onClick={() => setShowVolunteerModal(true)} className="w-full py-4 bg-stone-900 text-white font-black rounded-xl hover:bg-black transition-all shadow-lg">加入志工行列</button>
          </div>
        </div>

        <h2 className="text-4xl font-black font-serif text-center mb-16 heading-temple">關懷足跡紀實</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {allActivities.map((act) => (
            <div key={act.id} className="group overflow-hidden rounded-[2rem] bg-white shadow-lg border border-stone-100 cursor-pointer flex flex-col hover:shadow-2xl hover:scale-[1.02] transition-all" onClick={() => setSelectedActivity(act)}>
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <img src={getCoverImage(act)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{act.date}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-stone-50 text-stone-500 rounded font-bold border">{act.type}</span>
                </div>
                <h3 className="font-black text-xl mb-3 heading-temple line-clamp-1 group-hover:text-[#b76e79] transition-colors">{act.title}</h3>
                <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">{act.description}</p>
                <div className="mt-4 pt-4 border-t border-stone-50 text-[10px] font-black text-[#b76e79] flex items-center">
                  閱讀全文與圖集 <i className="fas fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 關懷紀實 詳細內文彈窗 */}
      {selectedActivity && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-md overflow-y-auto" onClick={() => setSelectedActivity(null)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl my-8 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
             <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="px-4 py-1.5 bg-stone-100 text-stone-800 text-xs font-black rounded-lg mb-4 inline-block uppercase tracking-widest border">
                      {selectedActivity.type}
                    </span>
                    <h2 className="text-4xl font-black heading-temple font-serif leading-tight mb-2">{selectedActivity.title}</h2>
                    <p className="text-stone-400 font-bold text-sm tracking-widest"><i className="fas fa-calendar-day mr-2"></i>活動日期: {selectedActivity.date}</p>
                  </div>
                  <button onClick={() => setSelectedActivity(null)} className="text-stone-300 hover:text-stone-900 p-2">
                    <i className="fas fa-times text-3xl"></i>
                  </button>
                </div>

                <div className="prose prose-xl max-w-none text-stone-700 mb-12">
                   <p className="text-xl font-black text-stone-800 border-l-8 border-[#b76e79] pl-6 italic mb-10 leading-relaxed">
                     {selectedActivity.description}
                   </p>
                   <div className="whitespace-pre-line text-lg font-medium leading-[2] tracking-wide">
                     {selectedActivity.content || "本活動紀實全文整理中，敬請期待。"}
                   </div>
                </div>

                {/* 紀實相簿圖集 (最多20張) */}
                {((selectedActivity.imageUrls?.length || 0) > 0 || selectedActivity.imageUrl) && (
                  <div className="mt-12 space-y-6">
                    <h4 className="font-black text-stone-400 text-xs uppercase tracking-widest border-b-2 pb-2">活動紀實相簿 ({Math.max(selectedActivity.imageUrls?.length || 0, selectedActivity.imageUrl ? 1 : 0)} 影像)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedActivity.imageUrls?.map((url, idx) => (
                        <div key={idx} className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-lg cursor-zoom-in group" onClick={() => setZoomImage(url)}>
                          <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      ))}
                      {!selectedActivity.imageUrls?.length && selectedActivity.imageUrl && (
                        <div className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-lg cursor-zoom-in group" onClick={() => setZoomImage(selectedActivity.imageUrl!)}>
                          <img src={selectedActivity.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-16 flex justify-center border-t border-stone-50 pt-10">
                   <button onClick={() => setSelectedActivity(null)} className="px-12 py-4 bg-stone-900 text-white font-black rounded-xl hover:bg-black transition-all shadow-xl">
                      返回紀實列表
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

      {/* 表單彈窗保持原狀... */}
      {showDonationModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-[#b76e79] p-8 text-white"><h2 className="text-2xl font-black font-serif">參與慈善捐助</h2></div>
            <form onSubmit={submitDonation} className="p-8 space-y-4">
              <input required placeholder="姓名" className="w-full px-4 py-3 bg-amber-50 border rounded-xl font-bold" value={donationData.name} onChange={e => setDonationData({...donationData, name: e.target.value})} />
              <input required placeholder="電話" className="w-full px-4 py-3 bg-amber-50 border rounded-xl font-bold" value={donationData.phone} onChange={e => setDonationData({...donationData, phone: e.target.value})} />
              <select className="w-full px-4 py-3 bg-amber-50 border rounded-xl font-bold" value={donationData.amount} onChange={e => setDonationData({...donationData, amount: parseInt(e.target.value)})}>
                <option value={500}>500</option><option value={1000}>1000</option><option value={2000}>2000</option><option value={5000}>5000</option>
              </select>
              <input required placeholder="通訊地址" className="w-full px-4 py-3 bg-amber-50 border rounded-xl font-bold" value={donationData.address} onChange={e => setDonationData({...donationData, address: e.target.value})} />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowDonationModal(false)} className="flex-1 py-4 bg-stone-100 text-stone-600 font-black rounded-xl">取消</button>
                <button type="submit" className="flex-[2] py-4 bg-[#b76e79] text-white font-black rounded-xl shadow-lg">確認並支付</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVolunteerModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-stone-800 p-8 text-white"><h2 className="text-2xl font-black font-serif">志工服務報名</h2></div>
            <form onSubmit={submitVolunteer} className="p-8 space-y-4">
              <input required placeholder="姓名" className="w-full px-4 py-3 bg-amber-50 border rounded-xl font-bold" value={vFormData.name} onChange={e => setVFormData({...vFormData, name: e.target.value})} />
              <input required placeholder="電話" className="w-full px-4 py-3 bg-amber-50 border rounded-xl font-bold" value={vFormData.phone} onChange={e => setVFormData({...vFormData, phone: e.target.value})} />
              <input required placeholder="通訊地址" className="w-full px-4 py-3 bg-amber-50 border rounded-xl font-bold" value={vFormData.address} onChange={e => setVFormData({...vFormData, address: e.target.value})} />
              <textarea placeholder="服務相關經驗 (選填)" className="w-full px-4 py-3 bg-amber-50 border rounded-xl font-medium" rows={3} value={vFormData.experience} onChange={e => setVFormData({...vFormData, experience: e.target.value})} />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowVolunteerModal(false)} className="flex-1 py-4 bg-stone-100 text-stone-600 font-black rounded-xl">取消</button>
                <button type="submit" className="flex-[2] py-4 bg-stone-900 text-white font-black rounded-xl">提交報名資料</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <UniversalPaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} serviceName="慈善捐助" amount={donationData.amount} registrationData={activePaymentInfo} />
    </div>
  );
};

export default CharityPage;
