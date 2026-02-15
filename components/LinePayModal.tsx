
import React, { useState, useEffect } from 'react';
import { CONFIG } from '../constants';
import { pushRegistrationToSheet, getNetworkTimeData } from '../utils/sheetHelper';

type PaymentMethod = 'line' | 'jko' | 'sme' | 'friday';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  amount: number;
  registrationData?: any;
}

const UniversalPaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, serviceName, amount, registrationData }) => {
  const [step, setStep] = useState<'method' | 'info' | 'qr' | 'success'>('method');
  const [method, setMethod] = useState<PaymentMethod>('line');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('method');
    }
  }, [isOpen]);

  const handlePaymentSuccess = async () => {
    setIsSyncing(true);
    const timeData = await getNetworkTimeData();
    const platformName = paymentConfig[method].name;

    if (registrationData?.type === 'charity_donation') {
      // 處理慈善捐助：更新 LocalStorage 中的捐贈紀錄
      const savedDonations = JSON.parse(localStorage.getItem('temple_donations') || '[]');
      const updated = savedDonations.map((d: any) => 
        d.id === registrationData.recordId ? { ...d, status: 'paid', platform: platformName } : d
      );
      localStorage.setItem('temple_donations', JSON.stringify(updated));
    } else {
      // 處理一般服務登記
      const record = {
        timestamp: registrationData?.networkTime || timeData.full,
        serviceName: serviceName,
        amount: amount,
        name: registrationData?.name || '無名氏',
        phone: registrationData?.phone || '',
        formattedBirthday: registrationData?.formattedBirthday || '',
        address: registrationData?.address || '',
        wish: registrationData?.wish || '',
        platform: platformName,
        status: '完成收款'
      };

      // 嘗試雲端同步（如果配置有效）
      await pushRegistrationToSheet(CONFIG.APPS_SCRIPT_URL, record);
      
      // 更新本地登記名冊
      const savedRegs = JSON.parse(localStorage.getItem('temple_registrations') || '[]');
      const updatedRegs = savedRegs.map((r: any) => 
        r.id === registrationData?.recordId ? { ...r, status: 'paid', platform: platformName } : r
      );
      localStorage.setItem('temple_registrations', JSON.stringify(updatedRegs));
    }

    setIsSyncing(false);
    setStep('success');
  };

  if (!isOpen) return null;

  const paymentConfig = {
    line: { name: 'LINE Pay', color: '#06C755', icon: 'fab fa-line' },
    jko: { name: '街口支付', color: '#D0021B', icon: 'fas fa-wallet' },
    sme: { name: '中小企銀', color: '#005496', icon: 'fas fa-university' },
    friday: { name: '遠傳支付', color: '#ED1C24', icon: 'fas fa-mobile-alt' }
  };

  const currentConfig = paymentConfig[method];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-4 flex justify-between items-center text-white" style={{ backgroundColor: currentConfig.color }}>
          <div className="flex items-center space-x-2">
            <i className={`${currentConfig.icon} text-2xl`}></i>
            <span className="font-bold">{currentConfig.name}</span>
          </div>
          <button onClick={onClose}><i className="fas fa-times"></i></button>
        </div>

        <div className="p-8">
          {step === 'method' && (
            <div className="grid grid-cols-2 gap-4">
              {(Object.entries(paymentConfig) as [PaymentMethod, any][]).map(([key, cfg]) => (
                <button key={key} onClick={() => { setMethod(key); setStep('info'); }} className="p-4 rounded-xl border-2 hover:bg-stone-50 flex flex-col items-center gap-2 transition-all hover:border-stone-300">
                  <i className={`${cfg.icon} text-2xl`} style={{ color: cfg.color }}></i>
                  <span className="text-xs font-bold">{cfg.name}</span>
                </button>
              ))}
            </div>
          )}

          {step === 'info' && (
            <div className="text-center space-y-4">
              <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">支付項目</p>
              <p className="text-xl font-black heading-temple">{serviceName}</p>
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                <p className="text-xs text-stone-400 font-bold mb-1">應付總額</p>
                <div className="text-3xl font-black text-red-600">NT$ {amount.toLocaleString()}</div>
              </div>
              <button onClick={() => setStep('qr')} className="w-full py-4 text-white font-black rounded-xl shadow-lg transition-transform hover:scale-[1.02]" style={{ backgroundColor: currentConfig.color }}>確認並獲取付款碼</button>
            </div>
          )}

          {step === 'qr' && (
            <div className="text-center space-y-6">
              <div className="relative inline-block p-4 bg-white border-4 rounded-3xl" style={{ borderColor: currentConfig.color }}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=pay`} className="w-44 h-44" />
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                   <i className={`${currentConfig.icon} text-6xl`} style={{ color: currentConfig.color }}></i>
                </div>
              </div>
              <p className="text-sm font-bold text-stone-500">請開啟手機 {currentConfig.name} 掃描 QR Code</p>
              <button disabled={isSyncing} onClick={handlePaymentSuccess} className="w-full py-4 border-2 font-black rounded-xl bg-white transition-all hover:bg-stone-50" style={{ borderColor: currentConfig.color, color: currentConfig.color }}>
                {isSyncing ? <><i className="fas fa-spinner fa-spin mr-2"></i>校時同步中...</> : '模擬支付完成'}
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4 py-6">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <i className="fas fa-check text-4xl"></i>
              </div>
              <h3 className="text-2xl font-black font-serif heading-temple">功德圓滿</h3>
              <p className="text-stone-500 font-bold leading-relaxed px-6">登記資料已正式存入本宮名冊，感謝您的慷慨發心。</p>
              <button onClick={onClose} className="w-full py-4 bg-stone-900 text-white font-black rounded-xl shadow-lg transition-all hover:bg-black mt-8">返回頁面</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversalPaymentModal;
