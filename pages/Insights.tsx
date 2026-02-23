import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCardProps } from '../types';

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, icon, colorClass }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-40">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
    {trend !== undefined && (
      <div className="flex items-center gap-2 mt-4">
        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          {trend}%
        </span>
        <span className="text-slate-400 text-xs">지난달 대비</span>
      </div>
    )}
    {!trend && (
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-auto overflow-hidden">
        <div className="bg-indigo-500 h-full rounded-full w-3/4"></div>
      </div>
    )}
  </div>
);

const Insights: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);

    fetch(`http://localhost:3001/api/posts/${userData.id}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch posts', err);
        setLoading(false);
      });
  }, [navigate]);

  const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalPosts = posts.length;
  const avgEngagement = totalPosts > 0 ? ((totalLikes / totalPosts) * 0.1).toFixed(1) : '0';

  if (loading) {
    return <div className="p-10 text-center">불러오는 중...</div>;
  }

  return (
    <div aria-label="Insights dashboard" className="p-4 md:p-8 lg:p-12 space-y-8 max-w-[1600px] mx-auto w-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">게시 기록 및 인사이트</h2>
          <p className="text-sm text-slate-400">자동 생성된 게시물 추적 및 스타일 진화 분석</p>
        </div>
        <div className="flex gap-4">
          <button className="p-2 rounded-full hover:bg-slate-100 relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <img src="https://picsum.photos/id/64/100/100" className="size-10 rounded-full border" alt="User" />
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="총 좋아요 수" value={totalLikes >= 1000 ? `${(totalLikes / 1000).toFixed(1)}k` : totalLikes} trend={12} icon="favorite" colorClass="bg-rose-50 text-rose-500" />
        <StatCard label="평균 참여율" value={`${avgEngagement}%`} trend={5.2} icon="dataset" colorClass="bg-primary/10 text-primary" />
        <StatCard label="생성된 게시물" value={totalPosts} icon="auto_awesome" colorClass="bg-indigo-50 text-indigo-500" />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Brand Sidebar */}
        <aside className="xl:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary to-blue-400 relative">
              <div className="absolute -bottom-10 left-6">
                <div className="size-20 rounded-xl bg-white dark:bg-slate-800 p-1 shadow-md">
                  <img src="https://picsum.photos/id/1012/200/200" className="w-full h-full rounded-lg object-cover" alt="Logo" />
                </div>
              </div>
            </div>
            <div className="pt-12 px-6 pb-6">
              <h3 className="text-xl font-bold">Paws & Shear</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="size-2 bg-green-500 rounded-full"></span>
                <p className="text-sm text-slate-400">AI 학습: 활성화됨</p>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold">스타일 일치도</span>
                    <span className="text-primary font-bold">98%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[98%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">학습된 브랜드 키워드</h4>
                  <div className="flex flex-wrap gap-2">
                    {['#귀여운', '#전문적인', '#활기찬', '#깔끔한'].map(kw => (
                      <span key={kw} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                브랜드 보이스 수정
              </button>
            </div>
          </div>
        </aside>

        {/* Posts History Grid */}
        <section className="xl:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">최근 게시물</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-sm flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-lg">sort</span> 최신순
              </button>
              <button className="px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-sm flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-lg">calendar_today</span> 이번 달
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <div key={i} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={post.img_url || `https://picsum.photos/id/${100 + i}/400/300`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt={post.title} />
                  <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    {post.platform === 'instagram' && <span className="material-symbols-outlined text-pink-600 text-sm">photo_camera</span>}
                    {post.platform === 'facebook' && <span className="material-symbols-outlined text-blue-600 text-sm">facebook</span>}
                    {post.platform === 'tiktok' && <span className="material-symbols-outlined text-black text-sm">music_note</span>}
                    {post.platform === 'instagram' ? '인스타' : post.platform === 'facebook' ? '페북' : '틱톡'}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6 text-center text-xs text-white">
                    "정말 멋진 변신이네요! 원장님의 손길이 닿으니 강아지가 웃고 있어요 ❤️"
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 rounded text-slate-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${post.status === 'sent' ? 'bg-green-50 text-green-600' : post.status === 'draft' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-600'}`}>
                      {post.status === 'sent' ? '전송됨' : post.status === 'draft' ? '임시저장' : '승인 대기 중'}
                    </span>
                  </div>
                  <h3 className="font-bold truncate text-sm">{post.title}</h3>
                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <span className="material-symbols-outlined text-sm text-primary">favorite</span>
                        {post.likes > 0 ? (post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes) : '--'}
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <span className="material-symbols-outlined text-sm text-primary">chat_bubble</span>
                        {post.comments > 0 ? post.comments : '--'}
                      </div>
                    </div>
                    <button className="text-xs font-bold text-primary hover:underline">보기</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Insights;
