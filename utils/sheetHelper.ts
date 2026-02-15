
import { NewsItem } from '../types';

/**
 * 將數字轉換為中文農曆日期格式 (如 1 -> 初一, 11 -> 十一)
 */
const formatLunarDay = (day: number): string => {
  const chineseTen = ["初", "十", "廿", "卅"];
  const chineseNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  
  if (day <= 10) return "初" + chineseNum[day];
  if (day < 20) return "十" + chineseNum[day % 10 || 10];
  if (day === 20) return "二十";
  if (day < 30) return "廿" + chineseNum[day % 10 || 10];
  if (day === 30) return "三十";
  return day.toString();
};

/**
 * 獲取特定日期的農曆字串 (例如：正月十五)
 */
export const getLunarDateString = (date: Date): string => {
  try {
    // 使用 Intl API 取得農曆資料
    const formatter = new Intl.DateTimeFormat('zh-TW-u-ca-chinese', {
      month: 'long',
      day: 'numeric'
    });
    const parts = formatter.formatToParts(date);
    const month = parts.find(p => p.type === 'month')?.value || "";
    const dayStr = parts.find(p => p.type === 'day')?.value || "";
    const day = parseInt(dayStr, 10);
    
    return `${month}${formatLunarDay(day)}`;
  } catch (e) {
    return "日期校對中";
  }
};

/**
 * 獲取網路標準時間 (Asia/Taipei) 並包含農曆資訊
 */
export const getNetworkTimeData = async () => {
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Taipei');
    if (!response.ok) throw new Error('Time API failed');
    const data = await response.json();
    const dateObj = new Date(data.datetime);
    
    return {
      full: dateObj.toLocaleString('zh-TW', { hour12: false }),
      dateOnly: dateObj.toISOString().split('T')[0],
      iso: data.datetime,
      lunar: getLunarDateString(dateObj),
      yearGanZhi: "丙午" // 2026 為丙午年
    };
  } catch (error) {
    console.warn('網路校時失敗，暫時採用系統時間:', error);
    const now = new Date();
    return {
      full: now.toLocaleString('zh-TW', { hour12: false }),
      dateOnly: now.toISOString().split('T')[0],
      iso: now.toISOString(),
      lunar: getLunarDateString(now),
      yearGanZhi: "丙午"
    };
  }
};

// 民國年轉換工具
export const formatTempleBirthday = (dateStr: string, type: 'solar' | 'lunar'): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const year = date.getFullYear() - 1911;
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const prefix = type === 'solar' ? '國' : '農';
  return `${prefix}${year}年${month}月${day}日`;
};

// 從 Google Sheet 讀取消息
export const fetchNewsFromGoogleSheet = async (sheetId: string): Promise<NewsItem[]> => {
  if (!sheetId || sheetId.includes('REPLACE')) return [];
  
  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const text = await response.text();
    const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const data = JSON.parse(jsonStr);
    
    if (!data.table || !data.table.rows) return [];

    return data.table.rows.map((row: any, index: number) => {
      const cells = row.c;
      return {
        id: `sheet-${index}`,
        title: cells[0]?.v || '',
        category: cells[1]?.v || '堂務消息',
        date: cells[2]?.v || new Date().toISOString().split('T')[0],
        lunarDate: cells[3]?.v || '',
        summary: cells[4]?.v || '',
        content: cells[5]?.v || '',
      };
    }).reverse();
  } catch (error) {
    console.warn('Google Sheet 讀取失敗：', error);
    return [];
  }
};

export const pushRegistrationToSheet = async (scriptUrl: string, record: any) => {
  if (!scriptUrl || scriptUrl.includes('REPLACE')) {
    console.warn('Apps Script URL 未設定，資料僅儲存於本地。');
    return false;
  }
  
  try {
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    return true;
  } catch (error) {
    console.error('雲端同步失敗:', error);
    return false;
  }
};
