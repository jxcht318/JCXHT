
import React, { useState, useEffect } from 'react';
import { NewsItem, RegistrationRecord, CharityActivity, VolunteerRecord, CharityDonationRecord } from '../types';
import { getNetworkTimeData } from '../utils/sheetHelper';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'charity' | 'registrations' | 'donations' | 'volunteers'>('news');
  const [localNews, setLocalNews] = useState<NewsItem[]>([]);
  const [localCharity, setLocalCharity] = useState<CharityActivity[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [donations, setDonations] = useState<CharityDonationRecord[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerRecord[]>([]);
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // 消息公告狀態 (最多5張)
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newNews, setNewNews] = useState<Partial<NewsItem>>({ 
    title: '', category: '堂務消息', summary: '', content: '', imageUrls: [], date: '' 
  });
  const [newsUrlInput, setNewsUrlInput] = useState('');

  // 活動紀實狀態 (最多20張)
  const [editingCharityId, setEditingCharityId] = useState<string | null>(null);
  const [newCharity, setNewCharity] = useState<Partial<CharityActivity>>({ 
    title: '', type: '慈善捐助', date: '', description: '', content: '', imageUrls: [] 
  });
  const [charityUrlInput, setCharityUrlInput] = useState('');

  useEffect(() => {
    setLocalNews(JSON.parse(localStorage.getItem('temple_news') || '[]'));
    setLocalCharity(JSON.parse(localStorage.getItem('temple_charity') || '[]'));
    setRegistrations(JSON.parse(localStorage.getItem('temple_registrations') || '[]'));
    setDonations(JSON.parse(localStorage.getItem('temple_donations') || '[]'));
    setVolunteers(JSON.parse(localStorage.getItem('temple_volunteers') || '[]'));
  }, []);

  // 改進的多圖上傳處理：使用 Promise.all 解決非同步競爭問題
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, max: number, currentImages: string[], callback: (imgs: string[]) => void) => {
    const files = Array.from(e.target.files || []);
    if (currentImages.length + files.length > max) {
      alert(`最多僅能上傳 ${max} 張照片，請重新選擇。`);
      e.target.value = '';
      return;
    }

    const uploadPromises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const newBase64Images = await Promise.all(uploadPromises);
    callback([...currentImages, ...newBase64Images]);
    e.target.value = ''; // 清除 input 讓下次可選相同檔案
  };

  const deleteItem = (id: string, type: 'news' | 'charity' | 'reg' | 'don' | 'vol') => {
    if(!window.confirm('確定要永久刪除此項資料嗎？')) return;
    const storageKeys = { news: 'temple_news', charity: 'temple_charity', reg: 'temple_registrations', don: 'temple_donations', vol: 'temple_volunteers' };
    const setters = { news: setLocalNews, charity: setLocalCharity, reg: setRegistrations, don: setDonations, vol: setVolunteers };

    setters[type](prev => {
      const updated = (prev as any[]).filter(item => item.id !== id);
      localStorage.setItem(storageKeys[type], JSON.stringify(updated));
      return updated;
    });
  };

  const handlePrint = () => window.print();

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    const timeData = await getNetworkTimeData();

    const finalNews: NewsItem = {
      ...(newNews as NewsItem),
      id: editingNewsId || `news-${Date.now()}`,
      date: newNews.date || timeData.dateOnly,
      timestamp: timeData.full,
      lunarDate: timeData.lunar
    };

    setLocalNews(prev => {
      const updated = editingNewsId ? prev.map(n => n.id === editingNewsId ? finalNews : n) : [finalNews, ...prev];
      localStorage.setItem('temple_news', JSON.stringify(updated));
      return updated;
    });

    setEditingNewsId(null);
    setNewNews({ title: '', category: '堂務消息', summary: '', content: '', imageUrls: [], date: '' });
    setIsPublishing(false);
    alert('公告已成功存檔');
  };

  const handleCharitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const timeData = await getNetworkTimeData();

    const finalCharity: CharityActivity = {
      ...(newCharity as CharityActivity),
      id: editingCharityId || `charity-${Date.now()}`,
      date: newCharity.date || timeData.dateOnly,
      timestamp: timeData.full
    };

    setLocalCharity(prev => {
      const updated = editingCharityId ? prev.map(c => c.id === editingCharityId ? finalCharity : c) : [finalCharity, ...prev];
      localStorage.setItem('temple_charity', JSON.stringify(updated));
      return updated;
    });

    setEditingCharityId(null);
    setNewCharity({ title: '', type: '慈善捐助', date: '', description: '', content: '', imageUrls: [] });
    alert('活動紀實已成功存檔');
  };

  const filteredReg = registrations.filter(r => r.name.includes(searchKeyword) || r.phone.includes(searchKeyword));
  const filteredVol = volunteers.filter(v => v.name.includes(searchKeyword) || v.phone.includes(searchKeyword));
  const filteredDon = donations.filter(d => d.name.includes(searchKeyword));

  return (
    <div className="pt-32 pb-24 bg-stone-50 min-h-screen print:pt-0 print:bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-100 print:shadow-none print:border-none">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#f8cdda] to-[#d4a5a5] p-8 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
            <h1 className="text-2xl font-black font-serif text-stone-950 flex items-center">
              <i className="fas fa-cog mr-4 text-stone-700"></i> 管理中心
            </h1>
            <div className="flex bg-white/30 backdrop-blur-md rounded-2xl p-1 overflow-x-auto max-w-full">
              {[
                { id: 'news', label: '消息發布' },
                { id: 'charity', label: '活動紀實' },
                { id: 'registrations', label: '功德名冊' },
                { id: 'donations', label: '慈善名冊' },
                { id: 'volunteers', label: '志工名冊' }
              ].map(tab => (
                <button key={tab.id} onClick={() => {setActiveTab(tab.id as any); setSearchKeyword('');}} className={`px-6 py-2 rounded-xl font-black whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#b76e79] text-white shadow-lg' : 'text-stone-700 hover:text-stone-900'}`}>{tab.label}</button>
              ))}
            </div>
          </div>

          <div className="p-8 md:p-12">
            {['registrations', 'donations', 'volunteers'].includes(activeTab) && (
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 print:hidden">
                <div className="relative w-full md:w-96">
                  <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"></i>
                  <input placeholder="搜尋姓名或電話..." className="w-full pl-12 pr-4 py-3 bg-amber-50 rounded-xl border-2 font-bold outline-none focus:border-[#b76e79]" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} />
                </div>
                <button onClick={handlePrint} className="px-8 py-3 bg-stone-900 text-white font-black rounded-xl shadow-lg hover:bg-black"><i className="fas fa-print mr-2"></i>列印報表</button>
              </div>
            )}

            {/* 消息公告發布表單 */}
            {activeTab === 'news' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 print:hidden">
                <form onSubmit={handleNewsSubmit} className="lg:col-span-6 space-y-4 bg-stone-50 p-8 rounded-3xl border">
                  <h2 className="text-xl font-black text-[#b76e79]">{editingNewsId ? '編輯消息' : '發布消息'} (上限 5 張)</h2>
                  <input required className="w-full px-4 py-3 rounded-xl border-2 bg-amber-50 font-bold outline-none focus:border-[#b76e79]" placeholder="公告標題" value={newNews.title} onChange={e => setNewNews({...newNews, title: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <select className="px-4 py-3 rounded-xl border-2 bg-amber-50 font-bold" value={newNews.category} onChange={e => setNewNews({...newNews, category: e.target.value as any})}><option>堂務消息</option><option>活動公告</option><option>慶典公告</option></select>
                    <input type="date" className="px-4 py-3 rounded-xl border-2 bg-amber-50 font-bold" value={newNews.date} onChange={e => setNewNews({...newNews, date: e.target.value})} />
                  </div>
                  <div className="p-4 bg-white rounded-2xl border-2 border-stone-100 space-y-3">
                    <label className="block text-xs font-black text-stone-400 uppercase">照片管理 ({newNews.imageUrls?.length || 0}/5)</label>
                    <div className="flex gap-2">
                      <input placeholder="貼上照片連結..." className="flex-grow px-4 py-2 text-xs rounded-lg border bg-amber-50" value={newsUrlInput} onChange={e => setNewsUrlInput(e.target.value)} />
                      <button type="button" onClick={() => { if(newsUrlInput && (newNews.imageUrls?.length || 0) < 5) { setNewNews({...newNews, imageUrls: [...(newNews.imageUrls || []), newsUrlInput]}); setNewsUrlInput(''); } }} className="px-4 bg-[#b76e79] text-white rounded-lg text-[10px] font-black">新增連結</button>
                    </div>
                    <div className="relative">
                      <input type="file" multiple accept="image/*" className="w-full text-[10px] cursor-pointer" onChange={e => handleImageUpload(e, 5, newNews.imageUrls || [], (imgs) => setNewNews({...newNews, imageUrls: imgs}))} />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newNews.imageUrls?.map((url, idx) => (
                        <div key={idx} className="relative w-16 h-16 group">
                          <img src={url} className="w-full h-full object-cover rounded-lg border shadow-sm" />
                          <button type="button" onClick={() => setNewNews({...newNews, imageUrls: newNews.imageUrls?.filter((_, i) => i !== idx)})} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center shadow-lg"><i className="fas fa-times"></i></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <textarea required className="w-full px-4 py-3 rounded-xl border-2 bg-amber-50 outline-none" rows={2} placeholder="短摘要 (顯示於首頁列表)" value={newNews.summary} onChange={e => setNewNews({...newNews, summary: e.target.value})} />
                  <textarea className="w-full px-4 py-3 rounded-xl border-2 bg-amber-50 outline-none" rows={5} placeholder="公告詳細內容" value={newNews.content} onChange={e => setNewNews({...newNews, content: e.target.value})} />
                  <button className="w-full py-4 bg-[#b76e79] text-white font-black rounded-xl shadow-lg">{editingNewsId ? '儲存更新' : '確認發布公告'}</button>
                </form>
                <div className="lg:col-span-6 space-y-3 max-h-[700px] overflow-y-auto pr-2">
                   <h2 className="font-black text-xl mb-4 border-b pb-2">公告列表</h2>
                   {localNews.map(n => (
                     <div key={n.id} className="p-4 bg-white border rounded-2xl flex justify-between items-center shadow-sm hover:border-[#b76e79] transition-colors">
                       <div className="truncate flex-grow">
                          <span className="font-black block truncate">{n.title}</span>
                          <span className="text-[10px] font-bold text-stone-400">{n.date} · {n.category}</span>
                       </div>
                       <div className="flex gap-1 ml-4">
                         <button onClick={() => {setEditingNewsId(n.id); setNewNews(n); window.scrollTo(0,0);}} className="p-2 text-[#b76e79] hover:bg-rose-50 rounded-lg"><i className="fas fa-edit"></i></button>
                         <button onClick={() => deleteItem(n.id, 'news')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><i className="fas fa-trash-alt"></i></button>
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {/* 活動紀實發布表單 */}
            {activeTab === 'charity' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 print:hidden">
                <form onSubmit={handleCharitySubmit} className="lg:col-span-6 space-y-4 bg-stone-50 p-8 rounded-3xl border">
                  <h2 className="text-xl font-black text-stone-800">{editingCharityId ? '編輯紀實' : '記錄活動紀實'} (上限 20 張)</h2>
                  <input required className="w-full px-4 py-3 rounded-xl border-2 bg-amber-50 font-bold outline-none" placeholder="紀實標題" value={newCharity.title} onChange={e => setNewCharity({...newCharity, title: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <select className="px-4 py-3 rounded-xl border-2 bg-amber-50 font-bold" value={newCharity.type} onChange={e => setNewCharity({...newCharity, type: e.target.value as any})}><option>慈善捐助</option><option>社會服務</option></select>
                    <input type="date" className="px-4 py-3 rounded-xl border-2 bg-amber-50 font-bold" value={newCharity.date} onChange={e => setNewCharity({...newCharity, date: e.target.value})} />
                  </div>
                  <div className="p-4 bg-white rounded-2xl border-2 border-stone-100 space-y-3">
                    <label className="block text-xs font-black text-stone-400 uppercase">活動照片管理 ({newCharity.imageUrls?.length || 0}/20)</label>
                    <div className="flex gap-2">
                      <input placeholder="貼上照片連結..." className="flex-grow px-4 py-2 text-xs rounded-lg border bg-amber-50" value={charityUrlInput} onChange={e => setCharityUrlInput(e.target.value)} />
                      <button type="button" onClick={() => { if(charityUrlInput && (newCharity.imageUrls?.length || 0) < 20) { setNewCharity({...newCharity, imageUrls: [...(newCharity.imageUrls || []), charityUrlInput]}); setCharityUrlInput(''); } }} className="px-4 bg-stone-800 text-white rounded-lg text-[10px] font-black">新增連結</button>
                    </div>
                    <input type="file" multiple accept="image/*" className="w-full text-[10px] cursor-pointer" onChange={e => handleImageUpload(e, 20, newCharity.imageUrls || [], (imgs) => setNewCharity({...newCharity, imageUrls: imgs}))} />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newCharity.imageUrls?.map((url, idx) => (
                        <div key={idx} className="relative w-12 h-12 group">
                          <img src={url} className="w-full h-full object-cover rounded-lg border shadow-sm" />
                          <button type="button" onClick={() => setNewCharity({...newCharity, imageUrls: newCharity.imageUrls?.filter((_, i) => i !== idx)})} className="absolute -top-2 -right-2 bg-red-500 text-white w-4 h-4 rounded-full text-[8px] flex items-center justify-center shadow-lg"><i className="fas fa-times"></i></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <textarea required className="w-full px-4 py-3 rounded-xl border-2 bg-amber-50 outline-none" rows={2} placeholder="活動摘要" value={newCharity.description} onChange={e => setNewCharity({...newCharity, description: e.target.value})} />
                  <textarea className="w-full px-4 py-3 rounded-xl border-2 bg-amber-50 outline-none" rows={5} placeholder="活動紀實詳細全文" value={newCharity.content} onChange={e => setNewCharity({...newCharity, content: e.target.value})} />
                  <button className="w-full py-4 bg-stone-900 text-white font-black rounded-xl shadow-xl">儲存紀實紀錄</button>
                </form>
                <div className="lg:col-span-6 space-y-3 max-h-[700px] overflow-y-auto pr-2">
                   <h2 className="font-black text-xl mb-4 border-b pb-2">活動紀實列表</h2>
                   {localCharity.map(c => (
                     <div key={c.id} className="p-4 bg-white border rounded-2xl flex justify-between items-center shadow-sm hover:border-stone-800 transition-colors">
                       <div className="truncate flex-grow">
                          <span className="font-black block truncate">{c.title}</span>
                          <span className="text-[10px] font-bold text-stone-400">{c.date} · {c.type}</span>
                       </div>
                       <div className="flex gap-1 ml-4">
                         <button onClick={() => {setEditingCharityId(c.id); setNewCharity(c); window.scrollTo(0,0);}} className="p-2 text-[#b76e79] hover:bg-rose-50 rounded-lg"><i className="fas fa-edit"></i></button>
                         <button onClick={() => deleteItem(c.id, 'charity')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><i className="fas fa-trash-alt"></i></button>
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {/* 功德名冊表格 */}
            {activeTab === 'registrations' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-[#b76e79] print:text-stone-900 border-b-2 border-[#b76e79] pb-2">信眾功德登記名冊 (詳細資訊)</h2>
                <div className="overflow-x-auto rounded-2xl border print:overflow-visible print:border-none shadow-sm">
                  <table className="w-full text-left text-[11px] min-w-[1200px] print:min-w-full print:text-[10pt]">
                    <thead className="bg-stone-100 border-b print:border-b-2 print:border-stone-950">
                      <tr>
                        <th className="p-4 font-black">登記日期</th>
                        <th className="p-4 font-black">信眾姓名</th>
                        <th className="p-4 font-black">性別</th>
                        <th className="p-4 font-black">出生年月日</th>
                        <th className="p-4 font-black">聯絡電話</th>
                        <th className="p-4 font-black">現居地址</th>
                        <th className="p-4 font-black">服務項目</th>
                        <th className="p-4 font-black">祈求心願</th>
                        <th className="p-4 font-black">金額/平台</th>
                        <th className="p-4 font-black text-center print:hidden">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReg.map(r => (
                        <tr key={r.id} className="border-b hover:bg-stone-50 print:border-stone-300">
                          <td className="p-4 text-stone-400">{r.timestamp?.split(' ')[0]}</td>
                          <td className="p-4 font-black text-stone-800">{r.name}</td>
                          <td className="p-4">{r.gender}</td>
                          <td className="p-4 font-bold">{r.formattedBirthday || r.birthday}</td>
                          <td className="p-4 font-bold">{r.phone}</td>
                          <td className="p-4 max-w-xs truncate">{r.address}</td>
                          <td className="p-4 text-red-900 font-bold">{r.serviceName}</td>
                          <td className="p-4 italic text-stone-500">{r.wish || '無'}</td>
                          <td className="p-4">
                            <span className="font-black">NT$ {r.amount.toLocaleString()}</span>
                            <span className="ml-2 text-[8px] opacity-60 print:hidden">({r.platform || '實體'})</span>
                          </td>
                          <td className="p-4 text-center print:hidden">
                            <button onClick={() => deleteItem(r.id, 'reg')} className="text-red-300 hover:text-red-600 p-2"><i className="fas fa-trash-alt"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 志工名冊表格 */}
            {activeTab === 'volunteers' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-stone-900 border-b-2 border-stone-800 pb-2">志工服務招募名冊</h2>
                <div className="overflow-x-auto rounded-2xl border shadow-sm">
                  <table className="w-full text-left text-sm min-w-[1000px] print:min-w-full">
                    <thead className="bg-stone-50 border-b">
                      <tr>
                        <th className="p-4 font-black">報名日期</th>
                        <th className="p-4 font-black">姓名</th>
                        <th className="p-4 font-black">聯絡電話</th>
                        <th className="p-4 font-black">地址</th>
                        <th className="p-4 font-black">服務經驗</th>
                        <th className="p-4 font-black text-center print:hidden">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVol.map(v => (
                        <tr key={v.id} className="border-b hover:bg-stone-50">
                          <td className="p-4 text-stone-400">{v.timestamp?.split(' ')[0]}</td>
                          <td className="p-4 font-black">{v.name}</td>
                          <td className="p-4 font-bold">{v.phone}</td>
                          <td className="p-4 max-w-xs truncate">{v.address}</td>
                          <td className="p-4 italic text-stone-500">{v.experience || '無填寫'}</td>
                          <td className="p-4 text-center print:hidden">
                            <button onClick={() => deleteItem(v.id, 'vol')} className="text-red-300 hover:text-red-600 p-2"><i className="fas fa-trash-alt"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
