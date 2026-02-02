
import { Post, User, VarietalInfo, Language, ChatSession } from './types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  SC: {
    following: '关注', discover: '发现', local: '本地', mine: '我', messages: '消息',
    visuals: '视觉影像', title: '记录标题', origin: '产区溯源',
    product: '产品名称', roast: '烘焙程度', method: '冲泡方式',
    varietal: '豆种(解锁图鉴)',
    feeling: '赏味感悟', topics: '话题标签', location: '所在位置',
    publish: '发布', save: '保存', close: '关闭', placeholder_title: '此刻的记录标题...',
    placeholder_product: '产品/单品名称', placeholder_feeling: '分享此刻的香气、故事...',
    placeholder_topic: '添加话题...', placeholder_location: '点击标记当前位置',
    stats_posts: '动态', stats_followers: '粉丝', stats_following: '关注',
    settings: '设置', language: '语言', palate: '赏味值系统', growth: '成长激励',
    specimen: '标本集', dranks: '我也喝过', sync: '同步参数', back: '返回',
    filter_roast: '烘焙程度', filter_method: '冲泡方式', filter_region: '产地/区域',
    confirm: '确定', clear: '清空',
    radar_acidity: '酸质', radar_sweetness: '甜感', radar_body: '醇厚', radar_bitterness: '苦度', radar_aftertaste: '余韵',
    flavor_calibration: '风味校准',
    unlock_toast: '解锁新图鉴',
    msg_likes: '赞与收藏', msg_followers: '新增关注', msg_comments: '评论与@',
    msg_system: '系统通知', msg_stranger: '陌生人私信',
    stranger_tip: '对方是陌生人，回复后可继续对话',
  },
  TC: {
    following: '關注', discover: '發現', local: '在地', mine: '我', messages: '消息',
    visuals: '視覺影像', title: '記錄標題', origin: '產區溯源',
    product: '產品名稱', roast: '烘焙程度', method: '沖泡方式',
    varietal: '豆種(解鎖圖鑑)',
    feeling: '賞味感悟', topics: '話題標籤', location: '所在位置',
    publish: '發佈', save: '保存', close: '關閉', placeholder_title: '此刻的記錄標題...',
    placeholder_product: '產品/單品名稱', placeholder_feeling: '分享此刻的香氣、故事...',
    placeholder_topic: '添加話題...', placeholder_location: '點擊標記當前位置',
    stats_posts: '動態', stats_followers: '粉絲', stats_following: '關注',
    settings: '設置', language: '語言', palate: '賞味值系統', growth: '成長激勵',
    specimen: '標本集', dranks: '我也喝過', sync: '同步參數', back: '返回',
    filter_roast: '烘焙程度', filter_method: '沖泡方式', filter_region: '產地/區域',
    confirm: '確定', clear: '清空',
    radar_acidity: '酸質', radar_sweetness: '甜感', radar_body: '醇厚', radar_bitterness: '苦度', radar_aftertaste: '餘韻',
    flavor_calibration: '風味校準',
    unlock_toast: '解鎖新圖鑑',
    msg_likes: '讚與收藏', msg_followers: '新增關注', msg_comments: '評論與@',
    msg_system: '系統通知', msg_stranger: '陌生人私信',
    stranger_tip: '對方是陌生人，回覆後可繼續對話',
  },
  EN: {
    following: 'Following', discover: 'Discover', local: 'Local', mine: 'Me', messages: 'Inbox',
    visuals: 'Visuals', title: 'Title', origin: 'Origin',
    product: 'Product', roast: 'Roast', method: 'Method',
    varietal: 'Varietal',
    feeling: 'Feeling', topics: 'Topics', location: 'Location',
    publish: 'Publish', save: 'Save', close: 'Close', placeholder_title: 'Post title...',
    placeholder_product: 'Product name', placeholder_feeling: 'Share your thoughts...',
    placeholder_topic: 'Add topic...', placeholder_location: 'Tap to tag location',
    stats_posts: 'Posts', stats_followers: 'Followers', stats_following: 'Following',
    settings: 'Settings', language: 'Language', palate: 'Palate Score', growth: 'Growth',
    specimen: 'Specimens', dranks: 'Drank this', sync: 'Sync', back: 'Back',
    filter_roast: 'Roast Level', filter_method: 'Brew Method', filter_region: 'Origin/Region',
    confirm: 'Confirm', clear: 'Clear',
    radar_acidity: 'Acidity', radar_sweetness: 'Sweetness', radar_body: 'Body', radar_bitterness: 'Bitter', radar_aftertaste: 'Finish',
    flavor_calibration: 'Flavor Calibration',
    unlock_toast: 'New Specimen Unlocked',
    msg_likes: 'Likes', msg_followers: 'New Followers', msg_comments: 'Comments & @',
    msg_system: 'System', msg_stranger: 'Requests',
    stranger_tip: 'Reply to accept message request',
  },
  JP: {
    following: 'フォロー', discover: '発見', local: '周辺', mine: 'マイ', messages: '通知',
    visuals: 'ビジュアル', title: 'タイトル', origin: '産地',
    product: '製品名', roast: '焙煎度', method: '抽出方法',
    varietal: '品種(図鑑)',
    feeling: '感想', topics: 'トピック', location: '位置情報',
    publish: '投稿', save: '保存', close: '閉じる', placeholder_title: 'タイトルの入力...',
    placeholder_product: '製品名/銘柄', placeholder_feeling: '香りと感想をシェア...',
    placeholder_topic: 'トピック追加...', placeholder_location: '现在地をマーク',
    stats_posts: '投稿', stats_followers: 'フォロワー', stats_following: 'フォロー',
    settings: '設定', language: '言語', palate: 'テイスティングスコア', growth: '成長',
    specimen: '標本集', dranks: '飲んだ', sync: '同期', back: '戻る',
    filter_roast: '焙煎度', filter_method: '抽出方法', filter_region: '産地/地域',
    confirm: '決定', clear: 'クリア',
    radar_acidity: '酸味', radar_sweetness: '甘味', radar_body: 'コク', radar_bitterness: '苦味', radar_aftertaste: '後味',
    flavor_calibration: 'フレーバー調整',
    unlock_toast: '新品種解禁',
    msg_likes: 'いいね', msg_followers: 'フォロワー', msg_comments: 'コメント',
    msg_system: 'システム', msg_stranger: 'メッセージリクエスト',
    stranger_tip: '返信してメッセージを許可',
  },
  KR: {
    following: '팔로잉', discover: '발견', local: '주변', mine: '나', messages: '메시지',
    visuals: '비주얼', title: '제목', origin: '원산지',
    product: '제품명', roast: '로스팅', method: '추출 방식',
    varietal: '품종(도감)',
    feeling: '테이스팅 노트', topics: '토픽', location: '현재 위치',
    publish: '게시', save: '저장', close: '닫기', placeholder_title: '제목을 입력하세요...',
    placeholder_product: '제품명/원두', placeholder_feeling: '지금의 향기와 느낌을 공유...',
    placeholder_topic: '토픽 추가...', placeholder_location: '현재 위치 표시',
    stats_posts: '게시물', stats_followers: '팔로워', stats_following: '팔로잉',
    settings: '설정', language: '언어', palate: '테이스팅 지수', growth: '성장',
    specimen: '표본집', dranks: '마셔봤음', sync: '동기화', back: '뒤로',
    filter_roast: '로스팅 정도', filter_method: '추출 방식', filter_region: '생산지/지역',
    confirm: '확인', clear: '초기화',
    radar_acidity: '산미', radar_sweetness: '단맛', radar_body: '바디', radar_bitterness: '쓴맛', radar_aftertaste: '여운',
    flavor_calibration: '플레이버 조정',
    unlock_toast: '새로운 표본 잠금 해제',
    msg_likes: '좋아요', msg_followers: '새 팔로워', msg_comments: '댓글 및 @',
    msg_system: '시스템', msg_stranger: '메시지 요청',
    stranger_tip: '답장하여 대화 수락',
  }
};

export const VARIETALS: VarietalInfo[] = [
  { id: 'geisha', name: '瑰夏', latinName: 'Coffea Arabica Geisha', description: '优雅的花香、佛手柑与明亮的柑橘酸质。源自埃塞俄比亚，在巴拿马翡翠庄园成名。', icon: '🌸' },
  { id: 'bourbon', name: '波旁', latinName: 'Coffea Arabica Bourbon', description: '铁皮卡的天然变种。以极佳的平衡度、巧克力甜感及坚果香气著称。', icon: '🌰' },
  { id: 'typica', name: '铁皮卡', latinName: 'Coffea Arabica Typica', description: '最古老的阿拉比卡品种之一。风味纯净、清甜，带有典型的草本香气。', icon: '🍃' },
  { id: 'sl28', name: 'SL28', latinName: 'Scott Labs 28', description: '肯尼亚最具代表性的品种。强烈的黑色莓果酸质，甚至带有迷人的番茄气息。', icon: '🫐' },
  { id: 'pacamara', name: '帕卡马拉', latinName: 'Pacamara', description: '帕卡斯与马拉戈吉皮的杂交种。豆形硕大，风味极其复杂且具张力。', icon: '🐘' },
  { id: 'caturra', name: '卡杜拉', latinName: 'Caturra', description: '波旁的单基因突变种。酸质清脆，甜感适中，广泛种植于美洲产区。', icon: '🍒' },
  { id: 'catuai', name: '卡杜艾', latinName: 'Catuai', description: '卡杜拉与新世界杂交。高产且适应性强，风味均衡，带有坚果与焦糖感。', icon: '🥜' }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: '小艾 CoffeeLover',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  bio: '寻找完美的清新花香。上海精品咖啡发烧友。',
  stats: { posts: 30, followers: 856, following: 120 },
  palateScore: 45,
  badges: [{ id: 'b1', name: '自带杯守护者', icon: '🌱' }],
  unlockedVarietals: ['sl28', 'caturra'] // 初始解锁状态
};

// 模拟会话数据
export const MOCK_CHATS: ChatSession[] = [
    {
        id: 'c1',
        user: { id: 'sys', name: 'Crema 小助手', avatar: 'https://picsum.photos/seed/crema/100/100', isOfficial: true },
        lastMessage: '恭喜您解锁了新的【波旁】图鉴！点击查看详情...',
        time: '14:20',
        unreadCount: 1,
        isStranger: false,
        hasReplied: true,
        messages: [
            { id: 'm1', isMe: false, text: '欢迎来到 Crema 社区！', time: '昨天', type: 'text' },
            { id: 'm2', isMe: false, text: '恭喜您解锁了新的【波旁】图鉴！点击查看详情...', time: '14:20', type: 'text' }
        ]
    },
    {
        id: 'c2',
        user: { id: 'u2', name: 'Barista_Ken', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' },
        lastMessage: '请问一下那个 V60 的参数是多少？',
        time: '昨天',
        unreadCount: 0,
        isStranger: true,
        hasReplied: false, // 未回复，应触发陌生人逻辑
        messages: [
            { id: 'm3', isMe: false, text: 'Hello! 看到你发的瑰夏笔记', time: '昨天 10:00', type: 'text' },
            { id: 'm4', isMe: false, text: '请问一下那个 V60 的参数是多少？', time: '昨天 10:01', type: 'text' }
        ]
    },
    {
        id: 'c3',
        user: { id: 'u3', name: 'Nana_Coffee', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
        lastMessage: '[图片]',
        time: '星期一',
        unreadCount: 2,
        isStranger: false,
        hasReplied: true,
        messages: [
             { id: 'm5', isMe: true, text: '我也很喜欢那家店！', time: '星期一 09:00', type: 'text' },
             { id: 'm6', isMe: false, text: '是吧！环境超棒', time: '星期一 09:15', type: 'text' },
             { id: 'm7', isMe: false, text: 'https://images.unsplash.com/photo-1498804103079-a6351b050096', time: '星期一 09:16', type: 'image' }
        ]
    }
];

const COFFEE_IMAGES_MAPPING = [
  { keywords: ['手冲', 'V60', '滴滤'], url: 'https://images.unsplash.com/photo-1521017432531-fbd92d744264' },
  { keywords: ['拉花', '拿铁', '澳白'], url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb' },
  { keywords: ['咖啡豆', '产地', '烘焙'], url: 'https://images.unsplash.com/photo-1447933630913-bb796f287e05' },
  { keywords: ['意式', '咖啡机', '浓缩'], url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24' },
  { keywords: ['冰咖啡', '冷萃'], url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd' },
  { keywords: ['下午茶', '日常'], url: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd' },
  { keywords: ['手冲壶', '仪式感'], url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085' },
  { keywords: ['工业风', '探店'], url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93' },
  { keywords: ['生豆', '贸易'], url: 'https://images.unsplash.com/photo-1498804103079-a6351b050096' },
  { keywords: ['烘焙机', '工厂'], url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e' }
];

const generateMockPosts = (): Post[] => {
  const posts: Post[] = [];
  const regions = ['非洲', '亚洲', '美洲', '大洋洲'];
  const origins = ['肯尼亚', '埃塞俄比亚', '中国云南', '巴拿马', '巴西', '危地马拉', '哥伦比亚'];
  const methods = ['手冲', '浓缩', '冷萃', '澳白', '拿铁'];
  const varietals = ['geisha', 'bourbon', 'typica', 'sl28', 'caturra', 'catuai'];
  
  for (let i = 1; i <= 30; i++) {
    const isOfficial = i % 5 === 0;
    const hasLocation = i % 2 === 0;
    const region = regions[i % regions.length];
    const origin = origins[i % origins.length];
    const method = methods[i % methods.length];
    
    let imageUrl = COFFEE_IMAGES_MAPPING[i % COFFEE_IMAGES_MAPPING.length].url;
    if (method === '澳白' || method === '拿铁') imageUrl = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb';
    if (method === '手冲') imageUrl = 'https://images.unsplash.com/photo-1521017432531-fbd92d744264';
    if (method === '冷萃') imageUrl = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd';

    posts.push({
      id: `p${i}`,
      title: `${origin} · ${method}实测记录 #${i}`,
      productName: `${origin} 特选批次`,
      region: region,
      origin: origin,
      varietal: varietals[i % varietals.length], // 随机分配品种
      location: hasLocation ? `上海·${['静安', '徐汇', '长宁', '普陀'][i % 4]}区` : undefined,
      distance: hasLocation ? `${(Math.random() * 4.5 + 0.5).toFixed(1)}km` : undefined,
      images: [`${imageUrl}?auto=format&fit=crop&q=80&w=800`],
      author: isOfficial 
        ? { id: '0', name: 'Crema 官方', avatar: 'https://picsum.photos/seed/crema/100/100', isOfficial: true }
        : { id: `u${i}`, name: `赏味者 ${i}`, avatar: `https://picsum.photos/seed/user${i}/100/100` },
      likes: Math.floor(Math.random() * 1500) + 50,
      hasLiked: false,
      roastLevel: (i % 5) + 1,
      process: i % 2 === 0 ? '水洗' : '日晒',
      method: method,
      flavorProfile: {
        acidity: Math.floor(Math.random() * 4) + 1,
        sweetness: Math.floor(Math.random() * 4) + 2,
        body: Math.floor(Math.random() * 4) + 1,
        bitterness: Math.floor(Math.random() * 3) + 1,
        aftertaste: Math.floor(Math.random() * 4) + 2
      },
      flavors: ['柑橘', '巧克力', '茉莉'],
      topics: ['单品记录', '生活美学'],
      priceRange: `¥${30 + (i % 30)}`,
      content: '这杯咖啡的香气表达非常清晰，入口即是明亮的果酸。',
      date: `${i}小时前`
    });
  }
  return posts;
};

export const MOCK_POSTS = generateMockPosts();
export const TOPICS = ['单品记录', '咖啡故事', '好店分享', '冲煮实验', '产区溯源', '拉花艺术'];
export const SUGGESTIONS = {
  products: ['耶加雪菲', '瑰夏村', '曼特宁', '花魁', '哥伦比亚'],
  regions: ['非洲', '亚洲', '美洲', '大洋洲'],
  origins: {
    '非洲': ['埃塞俄比亚', '肯尼亚', '卢旺达'],
    '亚洲': ['中国云南', '印尼', '泰国'],
    '美洲': ['巴西', '哥伦比亚', '巴拿马'],
    '大洋洲': ['巴布亚新几内亚']
  },
  methods: ['手冲', '浓缩', '冷萃', '法压壶', '爱乐压', '澳白', '拿铁']
};
export const ROAST_COLORS: Record<number, string> = {
  1: '#E6CCB2', 2: '#B08968', 3: '#7F5539', 4: '#4F3521', 5: '#2C1A0F'
};
export const ROAST_LABELS: Record<number, string> = {
  1: '极浅', 2: '浅烘', 3: '中烘', 4: '深烘', 5: '极深'
};
