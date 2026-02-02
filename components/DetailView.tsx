
import React, { useState, useRef, useEffect } from 'react';
import { X, Heart, MessageCircle, Share2, MapPin, Coffee, Star, Zap, Save, Globe, Send, Copy, Image as ImageIcon, Link2, MoreHorizontal, Check, Mic, Play, Pause, CornerDownRight, Aperture, Download, ThumbsUp, Trash2, Mail, AlertTriangle, Search, User, ChevronRight } from 'lucide-react';
import { Post, Language } from '../types';
import { ROAST_COLORS, ROAST_LABELS, TRANSLATIONS, MOCK_USER } from '../constants';
import ImageWithSkeleton from './ImageWithSkeleton';
import FlavorRadar from './FlavorRadar';
import { triggerHaptic } from '../utils';

interface DetailViewProps {
  lang: Language;
  post: Post;
  onClose: () => void;
  onLike: () => void;
  onIDrankThisToo: () => void;
  onAuthorClick: (author: Post['author']) => void; // 新增：点击作者回调
}

interface Comment {
  id: number;
  name: string;
  avatar: string;
  text?: string;
  image?: string;
  audioDuration?: number; // 秒
  time: string;
  likes: number; // 点赞数
  replies?: Comment[];
}

// 模拟评论数据 (带回复和多媒体)
const MOCK_COMMENTS: Comment[] = [
  { 
    id: 1, 
    name: 'Alex.C', 
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100', 
    text: '这支豆子的尾韵确实很棒，特别是温度降下来之后！☕️', 
    time: '15分钟前',
    likes: 12,
    replies: [
        { id: 101, name: 'Crema 官方', avatar: 'https://picsum.photos/seed/crema/100/100', text: '感谢认可！建议下次试试 90度水温，甜感会更突出哦。', time: '10分钟前', likes: 4 }
    ]
  },
  { 
    id: 2, 
    name: 'Nana_Coffee', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', 
    text: '同款已入，实拍图奉上👇', 
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=300',
    time: '2小时前',
    likes: 8
  },
  { 
    id: 3, 
    name: 'Barista_Ken', 
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100', 
    audioDuration: 8,
    time: '5小时前',
    likes: 2
  },
];

// 模拟好友列表
const MOCK_FRIENDS = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    name: `Friend ${i}`,
    avatar: `https://picsum.photos/seed/friend${i}/100/100`
}));

const DetailView: React.FC<DetailViewProps> = ({ lang, post, onClose, onLike, onIDrankThisToo, onAuthorClick }) => {
  const [showShare, setShowShare] = useState(false);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false); // 简单的关注状态
  
  // 交互状态
  const [replyingTo, setReplyingTo] = useState<{id: number, name: string, rootId?: number} | null>(null);
  const [likedCommentIds, setLikedCommentIds] = useState<Set<number>>(new Set());
  
  // 长按菜单状态
  const [contextMenu, setContextMenu] = useState<{ visible: boolean, type: 'post' | 'comment', data: any } | null>(null);
  
  // 举报弹窗状态
  const [reportModal, setReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // 多媒体状态
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const [tempImage, setTempImage] = useState<string | null>(null);
  
  const commentInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const recordInterval = useRef<any>(null);
  const t = TRANSLATIONS[lang];

  // 滚动到底部评论区
  const scrollToComments = () => {
    triggerHaptic('light');
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    setTimeout(() => commentInputRef.current?.focus(), 500);
  };

  const handleImageSelect = () => {
    triggerHaptic('light');
    setTempImage('https://images.unsplash.com/photo-1447933630913-bb796f287e05?auto=format&fit=crop&q=80&w=300');
  };

  const toggleRecording = () => {
    triggerHaptic('medium');
    if (isRecording) {
        clearInterval(recordInterval.current);
        const duration = recordTimer;
        setIsRecording(false);
        setRecordTimer(0);
        if (duration > 1) handleSendAudio(duration);
    } else {
        setIsRecording(true);
        recordInterval.current = setInterval(() => {
            setRecordTimer(prev => prev + 1);
        }, 1000);
    }
  };

  const handleSendAudio = (duration: number) => {
    const comment: Comment = {
      id: Date.now(),
      name: MOCK_USER.name,
      avatar: MOCK_USER.avatar,
      audioDuration: duration,
      time: '刚刚',
      likes: 0
    };
    addComment(comment);
  };

  const handleSendTextOrImage = () => {
    if (!newComment.trim() && !tempImage) return;
    triggerHaptic('success');
    
    let finalText = newComment;
    
    const comment: Comment = {
      id: Date.now(),
      name: MOCK_USER.name,
      avatar: MOCK_USER.avatar,
      text: finalText,
      image: tempImage || undefined,
      time: '刚刚',
      likes: 0
    };
    
    addComment(comment);
    setNewComment('');
    setTempImage(null);
  };

  const addComment = (comment: Comment) => {
    if (replyingTo && replyingTo.rootId) {
        setComments(prev => prev.map(c => {
            if (c.id === replyingTo.rootId) {
                const prefix = replyingTo.id !== replyingTo.rootId ? `回复 @${replyingTo.name}: ` : '';
                const newReply = { ...comment, text: prefix + (comment.text || '') };
                return { ...c, replies: [...(c.replies || []), newReply] };
            }
            return c;
        }));
        setReplyingTo(null);
    } else if (replyingTo) {
        setComments(prev => prev.map(c => {
            if (c.id === replyingTo.id) {
                 return { ...c, replies: [...(c.replies || []), comment] };
            }
            return c;
        }));
        setReplyingTo(null);
    } else {
        setComments([...comments, comment]);
    }

    setTimeout(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, 100);
  };

  const handleCopyLink = () => {
    triggerHaptic('success');
    setIsCopied(true);
    setTimeout(() => {
        setIsCopied(false);
        setShowShare(false);
    }, 1500);
  };

  // 处理点赞评论
  const toggleLikeComment = (commentId: number) => {
    triggerHaptic('medium');
    const newSet = new Set(likedCommentIds);
    if (newSet.has(commentId)) {
        newSet.delete(commentId);
    } else {
        newSet.add(commentId);
    }
    setLikedCommentIds(newSet);
  };

  // 处理长按 (这里使用 onContextMenu 模拟长按/右键行为，适配 Web 端体验)
  const handleContextMenu = (e: React.MouseEvent, type: 'post' | 'comment', data: any) => {
      e.preventDefault();
      triggerHaptic('medium');
      setContextMenu({ visible: true, type, data });
  };

  // 提交举报
  const handleSubmitReport = () => {
      triggerHaptic('success');
      setReportModal(false);
      setContextMenu(null);
      setReportReason('');
      // 这里可以添加 Toast 提示 "举报已提交"
  };

  // 渲染评论组件
  const renderComment = (comment: Comment, rootId?: number) => {
    const isReply = !!rootId;
    const currentRootId = rootId || comment.id;
    const isLiked = likedCommentIds.has(comment.id);

    return (
        <div key={comment.id} className={`flex space-x-3 ${isReply ? 'mt-3 pl-2' : 'animate-in fade-in slide-in-from-bottom-2 duration-300'}`}>
            <div className="flex-shrink-0">
                <ImageWithSkeleton src={comment.avatar} containerClassName="w-8 h-8 rounded-full" className="w-8 h-8 rounded-full object-cover border border-beige" />
            </div>
            <div className="flex-1">
                <div 
                    className={`bg-white/50 p-3.5 rounded-2xl rounded-tl-none border border-beige/30 transition-colors active:bg-beige/40 ${isReply ? 'bg-beige/20' : ''}`}
                    onContextMenu={(e) => handleContextMenu(e, 'comment', comment)}
                >
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-black text-mocha">{comment.name}</span>
                    </div>
                    
                    {comment.text && <p className="text-xs text-mocha/80 leading-relaxed font-medium">{comment.text}</p>}
                    
                    {comment.image && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-beige/40 max-w-[160px]">
                            <img src={comment.image} alt="Attachment" className="w-full h-auto" />
                        </div>
                    )}

                    {comment.audioDuration && (
                        <div className="mt-1 flex items-center space-x-2 bg-caramel/10 px-3 py-2 rounded-full w-32 cursor-pointer active:opacity-70 transition-opacity">
                            <Play size={12} className="text-caramel fill-caramel" />
                            <div className="flex-1 h-1 flex items-center space-x-0.5 justify-center">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="w-0.5 bg-caramel/40 rounded-full" style={{ height: Math.random() * 12 + 4 + 'px' }} />
                                ))}
                            </div>
                            <span className="text-[10px] font-bold text-caramel">{comment.audioDuration}"</span>
                        </div>
                    )}
                </div>

                {/* 评论底部操作栏：时间 | 回复 | 点赞 */}
                <div className="flex items-center justify-between mt-1.5 pl-1 pr-1">
                    <span className="text-[9px] text-mocha/30 font-bold">{comment.time}</span>
                    
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => {
                                triggerHaptic('light'); 
                                setReplyingTo({ id: comment.id, name: comment.name, rootId: currentRootId });
                                commentInputRef.current?.focus();
                            }}
                            className="text-[10px] font-bold text-mocha/40 hover:text-caramel transition-colors"
                        >
                            回复
                        </button>
                        
                        <button 
                            onClick={() => toggleLikeComment(comment.id)}
                            className="flex items-center space-x-1 group"
                        >
                            <ThumbsUp 
                                size={12} 
                                className={`transition-all duration-300 ${isLiked ? 'fill-caramel text-caramel scale-110' : 'text-mocha/30 group-hover:text-mocha/50'}`} 
                            />
                            {(comment.likes + (isLiked ? 1 : 0)) > 0 && (
                                <span className={`text-[9px] font-bold ${isLiked ? 'text-caramel' : 'text-mocha/30'}`}>
                                    {comment.likes + (isLiked ? 1 : 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* 递归渲染回复 */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-1 border-l-2 border-beige/40 pl-0">
                        {comment.replies.map(reply => renderComment(reply, currentRootId))}
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-mocha/30 backdrop-blur-md" onClick={onClose} />
      
      {/* 主卡片 */}
      <div className="relative w-full max-w-md h-[96vh] bg-cream rounded-t-[48px] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500 shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-white backdrop-blur-sm active:scale-90 transition-transform"><X size={24} /></button>
        
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto hide-scrollbar pb-40">
          <div className="w-full aspect-square relative">
            <ImageWithSkeleton 
              src={post.images[0]} 
              className="w-full h-full object-cover" 
              containerClassName="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10 pointer-events-none" />
          </div>
          
          <div className="p-10 -mt-12 bg-cream relative rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-10 min-h-[500px]">
            {/* 标题区 */}
            <div className="mb-6">
              <h1 className="text-3xl font-black text-mocha mb-4 leading-tight">{post.title}</h1>
              
              {/* 新增：作者信息栏 (头像、昵称、关注、分享) */}
              <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center space-x-3 cursor-pointer group"
                    onClick={() => {
                        triggerHaptic('light');
                        onAuthorClick(post.author);
                    }}
                  >
                      <ImageWithSkeleton 
                        src={post.author.avatar} 
                        containerClassName="w-10 h-10 rounded-full border border-beige group-active:scale-90 transition-transform" 
                        className="w-10 h-10 rounded-full object-cover" 
                      />
                      <div>
                          <span className="text-sm font-black text-mocha block group-active:text-caramel transition-colors">{post.author.name}</span>
                          <span className="text-[10px] text-mocha/30 font-bold block">查看个人主页 <ChevronRight size={10} className="inline" /></span>
                      </div>
                  </div>

                  <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => { triggerHaptic('medium'); setIsFollowing(!isFollowing); }}
                        className={`px-4 py-1.5 rounded-full text-xs font-black border transition-all active:scale-95 ${
                            isFollowing 
                            ? 'bg-transparent border-beige text-mocha/40' 
                            : 'bg-caramel text-white border-caramel shadow-sm'
                        }`}
                      >
                          {isFollowing ? '已关注' : '关注'}
                      </button>
                      <button 
                        onClick={() => { triggerHaptic('medium'); setShowShare(true); }}
                        className="p-2 text-mocha/30 hover:text-mocha/60 transition-colors"
                      >
                          <Share2 size={20} />
                      </button>
                  </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
               {/* 价格标签移动到这里或者保持原样，为了布局平衡，上面的标题区域已经调整 */}
               <div className="text-left whitespace-nowrap">
                <span className="text-sm font-black text-mocha bg-beige/40 px-3 py-1 rounded-xl">{post.priceRange}</span>
              </div>
            </div>

            {/* 标签区 */}
            <div className="flex flex-wrap gap-3 mb-10">
              <div className="flex items-center space-x-2.5 bg-white border border-beige px-4 py-2 rounded-2xl text-xs text-mocha font-black shadow-sm"><Globe size={16} className="text-caramel" /><span>{post.region} · {post.origin}</span></div>
              <div className="flex items-center space-x-2.5 bg-white border border-beige px-4 py-2 rounded-2xl text-xs text-mocha font-black shadow-sm"><Coffee size={16} className="text-caramel" /><span>{post.productName}</span></div>
              {post.location && <div className="flex items-center space-x-2.5 bg-white border border-beige px-4 py-2 rounded-2xl text-xs text-mocha font-black shadow-sm"><MapPin size={16} className="text-caramel" /><span>{post.location}</span></div>}
            </div>
            
            {/* 基础参数 */}
            <div className="grid grid-cols-3 gap-5 mb-10 text-center">
              <div className="bg-white p-5 rounded-3xl border border-beige shadow-sm flex flex-col justify-center">
                  <p className="text-[9px] text-mocha/30 mb-3 uppercase font-black tracking-widest">{t.roast}</p>
                  <div className="h-1.5 w-full bg-beige/40 rounded-full mb-3 overflow-hidden"><div className="h-full bg-caramel rounded-full" style={{width:`${(post.roastLevel/5)*100}%`}} /></div>
                  <p className="text-[11px] font-black text-mocha/80">{ROAST_LABELS[post.roastLevel]}</p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-beige shadow-sm flex flex-col justify-center">
                  <p className="text-[9px] text-mocha/30 mb-2 uppercase font-black tracking-widest">处理法</p>
                  <p className="text-[12px] font-black text-mocha/80 mt-1">{post.process}</p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-beige shadow-sm flex flex-col justify-center">
                  <p className="text-[9px] text-mocha/30 mb-2 uppercase font-black tracking-widest">{t.method}</p>
                  <p className="text-[12px] font-black text-mocha/80 mt-1">{post.method}</p>
              </div>
            </div>

            {/* 风味雷达图 */}
            <div className="flex justify-center mb-12 -ml-2 py-4 bg-gradient-to-b from-transparent via-white/40 to-transparent rounded-[40px]">
              <FlavorRadar data={post.flavorProfile || { acidity: 3, sweetness: 3, body: 3, bitterness: 2, aftertaste: 3 }} lang={lang} size={240} />
            </div>

            {/* 赏味感悟 (支持长按) */}
            <div 
                className="mb-14 active:opacity-80 transition-opacity"
                onContextMenu={(e) => handleContextMenu(e, 'post', post)}
            >
                <h4 className="text-[10px] font-black text-mocha/20 uppercase tracking-[0.3em] mb-6 flex items-center"><Star size={10} className="mr-2" />{t.feeling}</h4>
                <p className="text-mocha/80 text-[15px] leading-loose whitespace-pre-line font-medium text-justify">{post.content}</p>
            </div>

            {/* 评论区 */}
            <div className="border-t border-beige/60 pt-10">
                <h4 className="text-[10px] font-black text-mocha/20 uppercase tracking-[0.3em] mb-8 flex items-center">
                    <MessageCircle size={10} className="mr-2" /> 
                    讨论 ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
                </h4>
                
                <div className="space-y-6 mb-8">
                    {comments.map((comment) => renderComment(comment))}
                </div>

                {/* 评论输入框 */}
                <div className="flex flex-col space-y-2 bg-white p-3 rounded-[28px] border border-beige shadow-sm relative">
                    {replyingTo && (
                        <div className="flex items-center justify-between px-2 pb-1 text-xs text-mocha/50 animate-in slide-in-from-bottom-2">
                            <span className="flex items-center"><CornerDownRight size={12} className="mr-1"/> 回复 <span className="font-bold text-caramel mx-1">@{replyingTo.name}</span></span>
                            <button onClick={() => setReplyingTo(null)}><X size={12} /></button>
                        </div>
                    )}

                    {tempImage && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-beige mb-2 ml-1">
                             <img src={tempImage} className="w-full h-full object-cover" />
                             <button onClick={() => setTempImage(null)} className="absolute top-0 right-0 bg-black/40 text-white p-0.5 rounded-bl"><X size={10} /></button>
                        </div>
                    )}

                    <div className="flex items-end space-x-2">
                        <button 
                            onClick={toggleRecording}
                            className={`p-2.5 rounded-full transition-all active:scale-90 flex-shrink-0 ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-red-200' : 'bg-beige/50 text-mocha/40'}`}
                        >
                            {isRecording ? <div className="w-4 h-4 rounded-sm bg-white" /> : <Mic size={20} />}
                        </button>

                        {isRecording ? (
                            <div className="flex-1 h-10 flex items-center justify-center bg-red-50 rounded-xl">
                                <span className="text-red-500 text-xs font-bold animate-pulse">正在录音... {recordTimer}s (点击停止)</span>
                            </div>
                        ) : (
                            <input 
                                ref={commentInputRef}
                                type="text" 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={replyingTo ? `回复 @${replyingTo.name}...` : "参与讨论..."} 
                                className="flex-1 bg-transparent px-2 py-2.5 text-xs font-bold text-mocha outline-none placeholder-mocha/20"
                                onKeyDown={(e) => e.key === 'Enter' && handleSendTextOrImage()}
                            />
                        )}

                        {!isRecording && !newComment && !tempImage && (
                            <button onClick={handleImageSelect} className="p-2 text-mocha/30 hover:text-mocha/60 transition-colors">
                                <ImageIcon size={20} />
                            </button>
                        )}
                        
                        {!isRecording && (
                            <button 
                                onClick={handleSendTextOrImage}
                                disabled={!newComment.trim() && !tempImage}
                                className={`p-2.5 rounded-full transition-all active:scale-90 flex-shrink-0 ${newComment.trim() || tempImage ? 'bg-caramel text-white shadow-md' : 'bg-beige text-mocha/20'}`}
                            >
                                <Send size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* 底部浮动操作栏 */}
        <div className="absolute bottom-8 left-6 right-6 flex flex-col space-y-3 z-30">
          <button onClick={onIDrankThisToo} className="w-full bg-mocha text-white py-4 rounded-[24px] shadow-xl flex items-center justify-center space-x-3 font-black uppercase tracking-widest active:scale-[0.98] transition-transform hover:shadow-2xl hover:shadow-mocha/20">
            <Zap size={18} className="fill-white" />
            <span className="text-sm">我也喝过</span>
          </button>
          
          <div className="h-16 glass-nav rounded-[24px] shadow-lg border border-white/50 flex items-center justify-between px-8 backdrop-blur-xl">
            <button 
                onClick={onLike} 
                className={`flex items-center space-x-2 transition-all active:scale-90 group ${post.hasLiked ? 'text-red-500' : 'text-mocha/30 hover:text-mocha/60'}`}
            >
                <div className="relative">
                    <Heart size={24} className={`transition-all duration-300 ${post.hasLiked ? 'fill-red-500 scale-110' : ''}`} />
                    {post.hasLiked && <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>}
                </div>
                <span className="text-sm font-black">{post.likes}</span>
            </button>
            <div className="h-6 w-[1px] bg-mocha/10"></div>
            <button onClick={scrollToComments} className="flex items-center space-x-2 text-mocha/30 hover:text-mocha/60 transition-colors active:scale-90">
                <MessageCircle size={24} />
                <span className="text-sm font-black">{comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)}</span>
            </button>
            <div className="h-6 w-[1px] bg-mocha/10"></div>
            <button onClick={() => { triggerHaptic('medium'); setShowShare(true); }} className="text-mocha/30 hover:text-mocha/60 transition-colors active:scale-90">
                <Share2 size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* 长按/高级菜单 Overlay */}
      {contextMenu && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setContextMenu(null)} />
            <div className="relative w-full max-w-md bg-cream rounded-t-[32px] overflow-hidden animate-in slide-in-from-bottom duration-300">
                <div className="w-12 h-1.5 bg-beige rounded-full mx-auto mt-4 mb-6" />
                
                {/* 1. 好友分享 (横向瀑布流) */}
                <div className="px-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-mocha">私信给好友</span>
                        <span className="text-[10px] text-mocha/40 font-bold">最近联系</span>
                    </div>
                    <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-2">
                        {/* 搜索按钮 */}
                        <div className="flex flex-col items-center space-y-2 flex-shrink-0 w-14">
                            <div className="w-12 h-12 rounded-full bg-beige/40 flex items-center justify-center text-mocha/40">
                                <Search size={20} />
                            </div>
                            <span className="text-[9px] text-mocha/60 truncate w-full text-center">搜索</span>
                        </div>
                        {/* 好友列表 */}
                        {MOCK_FRIENDS.map(f => (
                            <div key={f.id} className="flex flex-col items-center space-y-2 flex-shrink-0 w-14" onClick={() => { triggerHaptic('success'); setContextMenu(null); }}>
                                <div className="relative">
                                    <ImageWithSkeleton src={f.avatar} className="w-12 h-12 rounded-full object-cover border border-white shadow-sm" containerClassName="w-12 h-12 rounded-full" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <span className="text-[9px] text-mocha/80 font-bold truncate w-full text-center">{f.name}</span>
                            </div>
                        ))}
                        {/* 查看更多 */}
                        <div className="flex flex-col items-center space-y-2 flex-shrink-0 w-14">
                            <div className="w-12 h-12 rounded-full bg-beige/40 flex items-center justify-center text-mocha/40">
                                <MoreHorizontal size={20} />
                            </div>
                            <span className="text-[9px] text-mocha/60 truncate w-full text-center">更多</span>
                        </div>
                    </div>
                </div>

                <div className="h-[1px] bg-beige/60 mx-6 mb-6"></div>

                {/* 2. 功能矩阵 */}
                <div className="grid grid-cols-5 gap-2 px-4 mb-8">
                    {[
                        { icon: <MessageCircle size={20} />, label: '回复', action: () => { 
                            if(contextMenu.type === 'comment') {
                                setReplyingTo({ id: contextMenu.data.id, name: contextMenu.data.name, rootId: contextMenu.data.id });
                                commentInputRef.current?.focus();
                            } else {
                                commentInputRef.current?.focus();
                            }
                        }},
                        { icon: <Star size={20} />, label: '收藏' },
                        { icon: <Copy size={20} />, label: '复制', action: () => { /* Copy logic */ triggerHaptic('success'); } },
                        { icon: <Mail size={20} />, label: '私信' },
                        { icon: <Trash2 size={20} className="text-red-500" />, label: '删除', color: 'text-red-500', bg: 'bg-red-50' }
                    ].map((item, i) => (
                        <button 
                            key={i} 
                            onClick={() => { 
                                triggerHaptic('light'); 
                                setContextMenu(null);
                                if(item.action) item.action();
                            }}
                            className="flex flex-col items-center space-y-2 p-2 rounded-xl active:bg-beige/30 transition-colors"
                        >
                            <div className={`w-10 h-10 rounded-full ${item.bg || 'bg-white border border-beige'} flex items-center justify-center ${item.color || 'text-mocha/60'} shadow-sm`}>
                                {item.icon}
                            </div>
                            <span className={`text-[9px] font-bold ${item.color || 'text-mocha/40'}`}>{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* 3. 举报按钮 */}
                <div className="px-6 mb-8">
                    <button 
                        onClick={() => { triggerHaptic('medium'); setReportModal(true); }}
                        className="w-full py-4 rounded-2xl bg-beige/30 text-mocha/40 text-xs font-black flex items-center justify-center space-x-2 active:bg-red-50 active:text-red-500 transition-colors"
                    >
                        <AlertTriangle size={16} />
                        <span>举报该内容</span>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* 举报弹窗 Modal */}
      {reportModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-mocha/60 backdrop-blur-sm" onClick={() => setReportModal(false)} />
            <div className="relative w-full max-w-sm bg-cream rounded-[32px] p-6 animate-in zoom-in-95 duration-200 shadow-2xl">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-black text-mocha">举报内容</h3>
                    <p className="text-xs text-mocha/40 mt-1">请选择举报原因，我们会尽快处理。</p>
                </div>

                <div className="space-y-2 mb-6">
                    {['垃圾广告信息', '不友善/辱骂行为', '违法违规内容', '内容不相关', '其他'].map((reason) => (
                        <button 
                            key={reason}
                            onClick={() => setReportReason(reason)}
                            className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all ${reportReason === reason ? 'bg-mocha text-white shadow-md' : 'bg-white border border-beige text-mocha/60'}`}
                        >
                            <span>{reason}</span>
                            {reportReason === reason && <Check size={14} />}
                        </button>
                    ))}
                </div>

                {reportReason === '其他' && (
                    <textarea 
                        className="w-full bg-white border border-beige rounded-xl p-3 text-xs text-mocha mb-6 focus:outline-none focus:border-caramel"
                        rows={3}
                        placeholder="请描述具体违规情况..."
                    />
                )}

                <div className="flex space-x-3">
                    <button onClick={() => setReportModal(false)} className="flex-1 py-3 bg-white border border-beige rounded-xl text-xs font-bold text-mocha/60">取消</button>
                    <button 
                        onClick={handleSubmitReport}
                        disabled={!reportReason}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${reportReason ? 'bg-red-500' : 'bg-gray-300'}`}
                    >
                        提交举报
                    </button>
                </div>
            </div>
        </div>
      )}
      
      {/* 分享面板 */}
      {showShare && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowShare(false)} />
            <div className="relative w-full max-w-md bg-cream rounded-t-[32px] p-6 animate-in slide-in-from-bottom duration-300">
                <div className="w-12 h-1.5 bg-beige rounded-full mx-auto mb-6" />
                <h3 className="text-center text-sm font-black text-mocha/40 uppercase tracking-[0.2em] mb-6">分享精彩</h3>
                
                <div className="flex justify-between px-4 mb-8">
                    {[
                        { icon: <MessageCircle size={28} className="fill-white" />, label: '微信好友', bg: 'bg-[#07C160]' },
                        { icon: <Aperture size={28} className="text-white" />, label: '朋友圈', bg: 'bg-gradient-to-tr from-[#07C160] to-[#2BCC78]' },
                        { icon: <Download size={28} />, label: '生成长图', bg: 'bg-caramel' },
                        { icon: <MoreHorizontal size={28} />, label: '系统分享', bg: 'bg-gray-400' }
                    ].map((item, i) => (
                        <button 
                            key={i} 
                            onClick={() => { triggerHaptic('success'); setShowShare(false); }}
                            className="flex flex-col items-center space-y-3 group"
                        >
                            <div className={`w-14 h-14 rounded-full ${item.bg} text-white flex items-center justify-center shadow-lg transition-transform group-active:scale-90 border-2 border-white`}>
                                {item.icon}
                            </div>
                            <span className="text-[10px] font-bold text-mocha/60">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl p-4 flex justify-between space-x-4 mb-4">
                    <button onClick={handleCopyLink} className="flex-1 flex flex-col items-center space-y-2 py-2 rounded-xl hover:bg-beige/20 transition-colors active:scale-95">
                        <div className="p-2 bg-beige/30 rounded-full text-mocha/60">
                             {isCopied ? <Check size={20} /> : <Link2 size={20} />}
                        </div>
                        <span className="text-[10px] font-bold text-mocha/40">{isCopied ? '已复制' : '复制链接'}</span>
                    </button>
                     <button className="flex-1 flex flex-col items-center space-y-2 py-2 rounded-xl hover:bg-beige/20 transition-colors active:scale-95">
                        <div className="p-2 bg-beige/30 rounded-full text-mocha/60">
                             <Save size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-mocha/40">收藏</span>
                    </button>
                     <button className="flex-1 flex flex-col items-center space-y-2 py-2 rounded-xl hover:bg-beige/20 transition-colors active:scale-95">
                        <div className="p-2 bg-beige/30 rounded-full text-mocha/60">
                             <ImageWithSkeleton src={post.images[0]} containerClassName="w-5 h-5 rounded" className="w-5 h-5 object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-mocha/40">存图</span>
                    </button>
                </div>
                
                <button 
                    onClick={() => setShowShare(false)}
                    className="w-full py-3.5 bg-beige/30 rounded-2xl text-mocha/50 font-black text-xs active:bg-beige/50 transition-colors"
                >
                    取消
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default DetailView;
