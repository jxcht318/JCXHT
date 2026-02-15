
import React, { useState } from 'react';
import { RegistrationRecord } from '../types';
import { formatTempleBirthday } from '../utils/sheetHelper';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  price: number;
  onConfirm: (data: any) => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, serviceName, price, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '男',
    birthday: '',
    birthdayType: 'solar' as 'solar' | 'lunar',
    address: '',
    wish: '祈求平安順遂'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 預先轉換生日格式為宮廟要求的 B/G 欄格式（統一為國曆）
    const formattedBirthday = formatTempleBirthday(formData.birthday, 'solar');
    onConfirm({ ...formData, birthdayType: 'solar', formattedBirthday });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-red-900 px-8 py-6 text-amber-50">
          <h2 className="text-2xl font-black font-serif">功德登記</h2>
          <p className="opacity-80 text-sm">項目：{serviceName} (NT$ {price.toLocaleString()})</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-black text-stone-700 mb-2">信眾姓名</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-red-800 outline-none transition-all font-bold"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="請輸入姓名"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black text-stone-700 mb-2">聯絡電話</label>
              <input 
                required
                type="tel" 
                className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-red-800 outline-none transition-all font-bold"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="09xx-xxx-xxx"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-stone-700 mb-2">性別</label>
              <select 
                className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-red-800 outline-none font-bold"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option>男</option>
                <option>女</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-stone-700 mb-2">出生日期 (國曆)</label>
            <input 
              required
              type="date" 
              className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-red-800 outline-none font-bold"
              value={formData.birthday}
              onChange={e => setFormData({...formData, birthday: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-black text-stone-700 mb-2">現居地址</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-red-800 outline-none transition-all font-bold"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              placeholder="請輸入完整通訊地址"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-stone-700 mb-2">其他祈求內容</label>
            <textarea 
              rows={2}
              className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-red-800 outline-none transition-all font-medium"
              value={formData.wish}
              onChange={e => setFormData({...formData, wish: e.target.value})}
              placeholder="例：身體健康、事業順利..."
            ></textarea>
          </div>

          <div className="flex space-x-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-stone-100 text-stone-600 font-black rounded-2xl hover:bg-stone-200 transition-all"
            >取消</button>
            <button 
              type="submit"
              className="flex-[2] py-4 bg-red-950 text-amber-400 font-black rounded-2xl hover:bg-red-800 hover:text-white transition-all shadow-xl"
            >確認登記並支付</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
