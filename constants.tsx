
import { NewsItem, CharityActivity, DeityInfo, ServiceItem } from './types';

// Google Sheets 配置
export const CONFIG = {
  NEWS_SHEET_ID: '1AJFFrImURgVIJ8uti6QB8rpzSkmUwwXaWr8tAO55LNo',
  REGISTRATION_SHEET_ID: '14OVYyuY8rdw2ay012eKMq22y_UmEtNEF0v2YwqkQkbk',
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbz_REPLACE_WITH_YOUR_ID/exec'
};

export const DEITIES: DeityInfo[] = [
  {
    id: 'yaochi',
    name: '瑤池金母',
    title: '無極瑤池大聖西王金母大天尊',
    description: '本宮主神，慈悲度世，執掌仙籍，為眾靈之母。',
    fullDescription: '瑤池金母，又稱西王母、王母娘娘，是道教至高無上的女神，主宰災厲、五刑與長生不老。在本宮作為主祀，引領眾生修身養性，同登覺路。',
    imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2070&auto=format&fit=crop',
    merits: ['保佑健康', '延年益壽', '家庭和樂', '修身定心']
  },
  {
    id: 'yuhuang',
    name: '玉皇上帝',
    title: '昊天金闕至尊玉皇大天尊',
    description: '萬神之宗，統御諸天，主宰乾坤萬物之消長。',
    fullDescription: '玉皇大帝，簡稱玉帝，俗稱天公。是天界最高神祇，總管三界、十方、四生、六道之萬靈，權衡世間功過與禍福。',
    imageUrl: 'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?q=80&w=2070&auto=format&fit=crop',
    merits: ['祈求國泰民安', '護佑事業前途', '消災解厄', '轉運迎吉']
  },
  {
    id: 'dizang',
    name: '地藏菩薩',
    title: '大願地藏王菩薩摩訶薩',
    description: '誓願宏深，「地獄不空，誓不成佛」，救拔受苦眾生。',
    fullDescription: '地藏菩薩以「大願」著稱，負責超拔先祖、冤親債主，並護佑後世子孫平安。在法會與超薦事宜中，具有無上威德。',
    imageUrl: 'https://images.unsplash.com/photo-1542315192-2628468b6330?q=80&w=2070&auto=format&fit=crop',
    merits: ['超拔先祖', '迴向怨親', '護佑子孫', '消災延壽']
  },
  {
    id: 'rulai',
    name: '如來佛祖',
    title: '南無本師釋迦牟尼佛',
    description: '佛法之主，智慧圓滿，引領信眾斷除煩惱。',
    fullDescription: '釋迦牟尼佛，又稱如來佛祖。是佛教創始者，其教法能淨化心靈，幫助眾生從痛苦與執著中解脫，獲得真正的平靜。',
    imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=2070&auto=format&fit=crop',
    merits: ['開啟智慧', '平定心神', '破除執著', '福德圓滿']
  },
  {
    id: 'guanyin',
    name: '觀音菩薩',
    title: '大慈大悲救苦救難觀世音菩薩',
    description: '聞聲救苦，廣度眾生，慈航普渡引領迷津。',
    fullDescription: '觀世音菩薩以慈悲著稱，尋聲救苦，無感不應。對於求子、健康與心靈平靜有極大感應，是信眾最親近的慈悲母親。',
    imageUrl: 'https://images.unsplash.com/photo-1542315192-2628468b6330?q=80&w=2070&auto=format&fit=crop',
    merits: ['救苦救難', '平安順遂', '心靈安定', '災禍遠離']
  },
  {
    id: 'wenshu',
    name: '文殊菩薩',
    title: '大智文殊師利菩薩摩訶薩',
    description: '智慧第一，執掌般若，保佑學業、官運與判斷力。',
    fullDescription: '文殊菩薩象徵無上智慧。騎乘青獅，手持智慧劍，能斬斷無明與煩惱。對於祈求學業進步、職場決策有顯著感應。',
    imageUrl: 'https://images.unsplash.com/photo-1590429517178-f3d9178f9f03?q=80&w=2070&auto=format&fit=crop',
    merits: ['學業進步', '考運亨通', '職場決策', '開發潛能']
  },
  {
    id: 'guansheng',
    name: '關聖帝君',
    title: '忠義千秋 關聖大天尊',
    description: '武聖人，主忠義、保平安、招財、避邪。',
    fullDescription: '關雲長尊號「關聖帝君」，乃忠義化身。不但是商業界的武財神，亦是文教界的文衡聖帝，保佑信眾平安順遂，奸邪不侵。',
    imageUrl: 'https://images.unsplash.com/photo-1590429517178-f3d9178f9f03?q=80&w=2070&auto=format&fit=crop',
    merits: ['守護平安', '忠義正直', '職場升遷', '驅邪避難']
  },
  {
    id: 'five-wealth',
    name: '五路財神',
    title: '中路武財神 趙公明及四路招財神',
    description: '掌管五方財源，祈求生意興隆、財源廣進。',
    fullDescription: '五路財神分別指中路武財神、東路招寶天尊、西路納珍天尊、南路招財使者、北路利市仙官。祈求五路進財，利路亨通。',
    imageUrl: 'https://images.unsplash.com/photo-1624456570648-52f201083416?q=80&w=1974&auto=format&fit=crop',
    merits: ['生意興隆', '正財亨通', '偏財如意', '利路亨通']
  },
  {
    id: 'kuixing',
    name: '魁星爺',
    title: '文魁夫子 魁星大帝',
    description: '執筆踢斗，主宰文運官爵，保佑讀書人名列前茅。',
    fullDescription: '魁星爺為文昌神之一，右手執朱批筆，左手持金元寶，腳踏鰲魚頭。負責管理文人學士的功名，是考生必拜的靈感神明。',
    imageUrl: 'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?q=80&w=2070&auto=format&fit=crop',
    merits: ['榜上有名', '才思泉湧', '升遷順利', '智慧增長']
  },
  {
    id: 'fude',
    name: '福德正神',
    title: '福德正神 土地公伯',
    description: '地方守護神，掌管田疇土地，佑民發財。',
    fullDescription: '土地公是信眾最親近的神祇，負責守護鄉里。無論是財運、房事還是祈求生活安定，福德正神皆會循聲感應，賜予福報。',
    imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2070&auto=format&fit=crop',
    merits: ['土地平安', '生意財源', '家宅安穩', '闔家平安']
  },
  {
    id: 'songzi',
    name: '送子觀音',
    title: '觀世音菩薩送子化身',
    description: '賜福添丁，護佑孕產平安，祈求家族傳承。',
    fullDescription: '送子觀音專門護佑祈求子嗣的信眾。其慈悲願力能使家中添丁進口，並護佑孕婦及胎兒在孕產過程中平安無礙。',
    imageUrl: 'https://images.unsplash.com/photo-1542315192-2628468b6330?q=80&w=2070&auto=format&fit=crop',
    merits: ['祈求子嗣', '懷孕順利', '生產平安', '子女乖巧']
  },
  {
    id: 'caishen',
    name: '財神爺',
    title: '天官大帝化身財神',
    description: '賜予財富，守護庫銀，祈求一整年資財豐足。',
    fullDescription: '除了五路財神外，財神爺更象徵整體的財務守護。能幫助信眾守住財庫，避免漏財，並在關鍵時刻賜予財富契機。',
    imageUrl: 'https://images.unsplash.com/photo-1624456570648-52f201083416?q=80&w=2070&auto=format&fit=crop',
    merits: ['守護財庫', '開拓財源', '事業發達', '生活優渥']
  }
];

export const NEWS: NewsItem[] = [
  { id: 'n13', title: '【宮廟消息】正月初六 開工大吉 財神護佑', date: '2026-02-22', category: '堂務消息', summary: '今日正月初六開工，本宮舉行團拜典禮，祝各位信眾事業騰飛。', lunarDate: '正月初六' },
  { id: 'n12', title: '【慶典公告】正月初五 接財神 祭祀典禮預告', date: '2026-02-21', category: '慶典公告', summary: '五路財神聖駕降臨，歡迎信眾前來補財庫，祈求一整年利路亨通。', lunarDate: '正月初五' },
];

export const SERVICES: ServiceItem[] = [
  // 點燈系列 (10項)
  { id: 's1', name: '光明燈', price: 600, category: '點燈', description: '照亮元神，祈求前途光明、平安順遂。', imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=500&auto=format&fit=crop' },
  { id: 's2', name: '太歲燈', price: 600, category: '點燈', description: '沖犯太歲者安奉，祈求流年平安、趨吉避凶。', imageUrl: 'https://images.unsplash.com/photo-1605370609341-3647f259e846?q=80&w=500&auto=format&fit=crop' },
  { id: 's3', name: '太陽燈', price: 800, category: '點燈', description: '祈求陽氣充足、事業騰飛、家道興旺。', imageUrl: 'https://images.unsplash.com/photo-1590429517178-f3d9178f9f03?q=80&w=500&auto=format&fit=crop' },
  { id: 's4', name: '太陰燈', price: 800, category: '點燈', description: '祈求守護元神、女性信眾平安、心思澄明。', imageUrl: 'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?q=80&w=500&auto=format&fit=crop' },
  { id: 's5', name: '財神燈', price: 1000, category: '點燈', description: '祈求五路財進，生意興隆，財源廣進。', imageUrl: 'https://images.unsplash.com/photo-1624456570648-52f201083416?q=80&w=500&auto=format&fit=crop' },
  { id: 's6', name: '福德燈', price: 800, category: '點燈', description: '土地公護佑，祈求居家平安、鄰里和睦。', imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=500&auto=format&fit=crop' },
  { id: 's7', name: '魁星燈', price: 800, category: '點燈', description: '祈求金榜題名、才思泉湧、考運亨通。', imageUrl: 'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?q=80&w=500&auto=format&fit=crop' },
  { id: 's8', name: '合家燈', price: 1200, category: '點燈', description: '全家共點，祈求家和萬事興、大小平安。', imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=500&auto=format&fit=crop' },
  { id: 's9', name: '藥師燈', price: 800, category: '點燈', description: '祈求藥師佛護佑，身體康泰、病痛遠離。', imageUrl: 'https://images.unsplash.com/photo-1542315192-2628468b6330?q=80&w=500&auto=format&fit=crop' },
  { id: 's10', name: '七星油燈', price: 1200, category: '點燈', description: '北斗七星護持，續命延生、消災解厄。', imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=500&auto=format&fit=crop' },

  // 祈福法會 (3項)
  { id: 's11', name: '瑤池金母聖誕中元普施法會', price: 1500, category: '祈福法會', description: '慶賀金母聖誕並結合中元普施，福澤萬民。', imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=500&auto=format&fit=crop' },
  { id: 's12', name: '新春補春運', price: 1000, category: '祈福法會', description: '新春補運，祈求一整年運勢亨通、大吉大利。', imageUrl: 'https://images.unsplash.com/photo-1624456570648-52f201083416?q=80&w=500&auto=format&fit=crop' },
  { id: 's13', name: '制改沖犯', price: 800, category: '祈福法會', description: '化解流年沖煞、官非病符，轉禍為福。', imageUrl: 'https://images.unsplash.com/photo-1605370609341-3647f259e846?q=80&w=500&auto=format&fit=crop' },

  // 拔渡法會 (1項)
  { id: 's14', name: '中元超薦拔度法會', price: 2000, category: '拔度法會', description: '超薦先人、冤親債主，使其離苦得樂，功德迴向。', imageUrl: 'https://images.unsplash.com/photo-1542315192-2628468b6330?q=80&w=500&auto=format&fit=crop' },
];

export const CHARITY_ACTIVITIES: CharityActivity[] = [
  { 
    id: 'fb-c1', 
    title: '冬令救濟 - 平安米物資發放', 
    date: '2026-01-20', 
    type: '慈善捐助', 
    description: '聚賢瑤池愛心功德會定期發放生活物資，關懷大溪在地弱勢家庭。', 
    content: '大溪聚賢慈惠宮長期深耕在地，透過「聚賢瑤池愛心功德會」的力量，將信眾捐獻的香油錢與物資轉化為具體的社會關懷。',
    imageUrls: ['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop'] 
  },
];
