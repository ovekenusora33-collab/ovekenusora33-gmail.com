
import React, { useState, useEffect } from 'react';
import { ViewType, Post, HomeTab, PrefillData, AppState, Language, User, FilterState, ChatSession } from './types';
import { MOCK_POSTS, MOCK_USER, TRANSLATIONS, VARIETALS } from './constants';
import HomeView from './components/HomeView';
import AddView from './components/AddView';
import ProfileView from './components/ProfileView';
import DetailView from './components/DetailView';
import MessagesView from './components/MessagesView';
import ChatOverlay from './components/ChatOverlay';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import SplashScreen from './components/SplashScreen';
import AuthView from './components/AuthView';
import OnboardingView from './components/OnboardingView';
import { triggerHaptic } from './utils';
import { BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SPLASH);
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.HOME);
  const [homeTab, setHomeTab] = useState<HomeTab>(HomeTab.DISCOVER);
  const [language, setLanguage] = useState<Language>('SC');
  
  // 数据状态
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [prefillData, setPrefillData] = useState<PrefillData | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  
  // 访客模式状态
  const [visitingUser, setVisitingUser] = useState<User | null>(null);

  // 筛选与搜索状态
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ roasts: [], methods: [], regions: [] });
  
  // 提示状态 (Toast)
  const [toast, setToast] = useState<{message: string, icon?: React.ReactNode} | null>(null);

  useEffect(() => {
    if (appState === AppState.SPLASH) {
      const timer = setTimeout(() => {
        setAppState(AppState.AUTH);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLogin = () => {
    triggerHaptic('success');
    setAppState(AppState.ONBOARDING);
  };
  
  const handleStartJourney = () => {
    triggerHaptic('medium');
    setAppState(AppState.MAIN);
  };

  const handleLike = (id: string) => {
    triggerHaptic('heavy');
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, hasLiked: !p.hasLiked, likes: p.hasLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  const handleAddPost = (newPost: Partial<Post>) => {
    triggerHaptic('success');
    const fullPost: Post = {
      ...newPost as Post,
      id: `p${Date.now()}`,
      author: { id: user.id, name: user.name, avatar: user.avatar },
      likes: 0,
      hasLiked: false,
      date: '刚刚',
      title: newPost.title || '无标题记录',
      productName: newPost.productName || '风味探索记录',
      priceRange: '¥35-50',
      flavors: [],
    };
    setPosts([fullPost, ...posts]);

    let updatedUser = { ...user };
    updatedUser.stats.posts += 1;
    updatedUser.palateScore = Math.min(100, updatedUser.palateScore + 2);

    if (fullPost.varietal && !updatedUser.unlockedVarietals.includes(fullPost.varietal)) {
      updatedUser.unlockedVarietals = [...updatedUser.unlockedVarietals, fullPost.varietal];
      const varietalName = VARIETALS.find(v => v.id === fullPost.varietal)?.name || '';
      setToast({
        message: `${TRANSLATIONS[language].unlock_toast}: ${varietalName}`,
        icon: <BookOpen size={16} />
      });
    }

    setUser(updatedUser);
    setPrefillData(null);
    setCurrentView(ViewType.HOME);
  };

  const handleIDrankThisToo = (post: Post) => {
    triggerHaptic('medium');
    setPrefillData({
      productName: post.productName,
      roastLevel: post.roastLevel,
      process: post.process,
      method: post.method,
      region: post.region,
      varietal: post.varietal 
    });
    setSelectedPost(null);
    setCurrentView(ViewType.ADD);
  };

  // 处理点击文章作者头像，进入该作者的主页
  const handleAuthorClick = (author: Post['author']) => {
    if (author.id === user.id) {
        // 如果是自己，直接切到 Profile Tab
        setCurrentView(ViewType.PROFILE);
        setVisitingUser(null);
    } else {
        // 如果是别人，构造一个临时 User 对象用于展示
        // 在真实应用中，这里应该调用 API 获取该用户的完整信息
        const tempUser: User = {
            id: author.id,
            name: author.name,
            avatar: author.avatar,
            bio: '热爱咖啡，热爱生活。分享每一杯的风味记忆。', // 模拟数据
            stats: { posts: 12, followers: 345, following: 28 }, // 模拟数据
            palateScore: 68, // 模拟数据
            badges: [],
            unlockedVarietals: ['geisha', 'bourbon']
        };
        setVisitingUser(tempUser);
        setCurrentView(ViewType.PROFILE);
    }
    // 关闭详情页，或者可以设计为详情页不关闭，覆盖在上层，这里简化为关闭详情页跳转
    setSelectedPost(null); 
  };

  const handleTabChange = (tab: HomeTab) => {
    if (tab !== homeTab) triggerHaptic('light');
    setHomeTab(tab);
  };

  const filteredPosts = posts.filter(p => {
    if (homeTab === HomeTab.FOLLOWING && p.author.isOfficial) return false;
    if (homeTab === HomeTab.LOCAL && (!p.location && !p.distance)) return false;
    if (filters.roasts.length > 0 && !filters.roasts.includes(p.roastLevel)) return false;
    if (filters.methods.length > 0 && !filters.methods.includes(p.method)) return false;
    if (filters.regions.length > 0 && !filters.regions.includes(p.region)) return false;
    return true;
  });

  // 根据当前视图决定 ProfileView 显示哪个用户的数据
  // 如果 visitingUser 存在，说明在看别人；否则显示自己
  const profileUser = visitingUser || user;
  // 筛选该用户的帖子
  const profilePosts = posts.filter(p => p.author.id === profileUser.id);
  // 为了 mock 数据展示丰富一点，如果 mock 帖子太少，就混入一点数据（仅供演示）
  const displayProfilePosts = profilePosts.length > 0 ? profilePosts : (visitingUser ? [] : posts.slice(0, 4));

  if (appState === AppState.SPLASH) return <SplashScreen />;
  if (appState === AppState.AUTH) return <AuthView onLogin={handleLogin} />;
  if (appState === AppState.ONBOARDING) return <OnboardingView onComplete={handleStartJourney} />;

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col relative overflow-hidden bg-cream shadow-2xl font-sans">
      {toast && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] bg-mocha text-white px-6 py-3 rounded-full shadow-xl flex items-center space-x-3 animate-in slide-in-from-top-4 fade-in duration-300">
          {toast.icon}
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}

      {currentView === ViewType.HOME && (
        <Header 
          lang={language}
          activeTab={homeTab} 
          onTabChange={handleTabChange}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          filters={filters}
          onFilterChange={setFilters}
          onProfileClick={() => {
            triggerHaptic('light');
            setVisitingUser(null); // 确保是看自己
            setCurrentView(ViewType.PROFILE);
          }}
          userAvatar={user.avatar}
        />
      )}

      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24 animate-in fade-in duration-700">
        {currentView === ViewType.HOME && (
          <HomeView 
            posts={filteredPosts} 
            onPostClick={(p) => {
              triggerHaptic('light');
              setSelectedPost(p);
            }} 
            onLikeClick={handleLike} 
          />
        )}
        {currentView === ViewType.ADD && (
          <AddView 
            lang={language}
            prefillData={prefillData}
            onCancel={() => {
              triggerHaptic('light');
              setCurrentView(ViewType.HOME);
            }} 
            onPublish={handleAddPost} 
          />
        )}
        {currentView === ViewType.MESSAGES && (
            <MessagesView 
              lang={language}
              stats={{ likes: 12, followers: 3, comments: 5 }}
              onChatClick={(chat) => {
                  triggerHaptic('light');
                  setSelectedChat(chat);
              }}
            />
        )}
        {currentView === ViewType.PROFILE && (
          <ProfileView 
            lang={language}
            onLangChange={setLanguage}
            user={profileUser}
            isCurrentUser={profileUser.id === user.id}
            posts={displayProfilePosts}
            onBack={() => {
              triggerHaptic('light');
              // 如果是访客模式，返回上一页通常意味着回到首页
              setVisitingUser(null);
              setCurrentView(ViewType.HOME);
            }} 
            onPostClick={(p) => {
               triggerHaptic('light');
               setSelectedPost(p);
            }}
          />
        )}
      </main>

      <BottomNav 
        lang={language}
        activeView={currentView} 
        onViewChange={(view) => {
            if (view !== currentView) triggerHaptic('medium');
            if(view === ViewType.ADD) setPrefillData(null);
            // 切换底部导航时，重置访客状态，默认看自己的 Profile
            if(view === ViewType.PROFILE) setVisitingUser(null);
            setCurrentView(view);
        }} 
      />

      {selectedPost && (
        <DetailView 
          lang={language}
          post={selectedPost} 
          onClose={() => {
            triggerHaptic('light');
            setSelectedPost(null);
          }} 
          onLike={() => handleLike(selectedPost.id)}
          onIDrankThisToo={() => handleIDrankThisToo(selectedPost)}
          onAuthorClick={handleAuthorClick}
        />
      )}

      {selectedChat && (
          <ChatOverlay 
             lang={language}
             session={selectedChat}
             onClose={() => {
                 triggerHaptic('light');
                 setSelectedChat(null);
             }}
          />
      )}
    </div>
  );
};

export default App;
