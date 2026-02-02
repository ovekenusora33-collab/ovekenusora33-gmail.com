
import React from 'react';
import { Heart, MapPin, Coffee, RefreshCcw } from 'lucide-react';
import { Post } from '../types';
import ImageWithSkeleton from './ImageWithSkeleton';

interface HomeViewProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  onLikeClick: (id: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ posts, onPostClick, onLikeClick }) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-beige/30 rounded-full flex items-center justify-center mb-6">
          <Coffee size={32} className="text-mocha/20" />
        </div>
        <h3 className="text-lg font-black text-mocha mb-2">暂无相关记录</h3>
        <p className="text-xs text-mocha/40 max-w-[200px] leading-relaxed mb-8">
          当前筛选条件下没有找到咖啡记录，试着去探索一些新的风味吧。
        </p>
        <button 
          onClick={() => window.location.reload()} // 简单模拟重置，实际应回调父组件清除筛选
          className="flex items-center space-x-2 px-6 py-3 bg-white border border-beige rounded-2xl shadow-sm text-mocha text-xs font-bold active:scale-95 transition-transform"
        >
          <RefreshCcw size={14} />
          <span>刷新列表</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex flex-col group border border-beige/30"
          onClick={() => onPostClick(post)}
        >
          <div className="aspect-[4/5] relative overflow-hidden">
            <ImageWithSkeleton 
              src={post.images[0]} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              containerClassName="w-full h-full"
            />
            <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-md rounded-full px-2 py-0.5 text-[9px] text-white font-bold uppercase tracking-tighter z-20">
              {post.method}
            </div>
            {post.distance && (
              <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md rounded-full px-2 py-0.5 text-[9px] text-white font-bold flex items-center z-20">
                <MapPin size={10} className="mr-0.5" /> {post.distance}
              </div>
            )}
          </div>
          
          <div className="p-3.5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-mocha line-clamp-2 leading-tight mb-1.5 font-sans">
                {post.title}
              </h3>
              <div className="flex flex-wrap gap-1 mb-2">
                 {post.topics?.slice(0, 1).map(t => (
                   <span key={t} className="text-[9px] text-caramel font-bold">#{t}</span>
                 ))}
                 <span className="text-[9px] text-mocha/30 font-medium">{post.productName}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center space-x-1.5 overflow-hidden">
                <ImageWithSkeleton src={post.author.avatar} containerClassName="w-5 h-5 rounded-full" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                <span className="text-[10px] text-mocha/60 truncate font-bold font-sans">{post.author.name}</span>
              </div>
              <button 
                className="flex items-center space-x-1 transition-transform active:scale-125"
                onClick={(e) => {
                  e.stopPropagation();
                  onLikeClick(post.id);
                }}
              >
                <Heart 
                  size={14} 
                  className={post.hasLiked ? 'fill-red-500 text-red-500' : 'text-mocha/40'} 
                />
                <span className={`text-[10px] font-bold font-sans ${post.hasLiked ? 'text-red-500' : 'text-mocha/40'}`}>
                  {post.likes}
                </span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeView;
