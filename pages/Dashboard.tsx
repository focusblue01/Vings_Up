
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      localStorage.removeItem('is_logged_in');
      navigate('/login');
    }
  };

  const stats = [
    { label: '이번 달 도달수', value: '42.8k', trend: '+12.5%', icon: 'trending_up', color: 'text-blue-500' },
    { label: '자동 생성 캡션', value: '128개', trend: '+8.2%', icon: 'auto_awesome', color: 'text-purple-500' },
    { label: '신규 예약 문의', value: '14건', trend: '+24%', icon: 'forum', color: 'text-green-500' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">좋은 아침입니다, 김지현 원장님! 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">오늘도 반려견들의 멋진 변신을 응원합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleLogout}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all active:scale-95"
            title="로그아웃"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
          <button 
            onClick={() => navigate('/upload')}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add_a_photo</span>
            오늘의 미용 업로드
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-green-500">
              <span className="material-symbols-outlined text-sm">north_east</span>
              {stat.trend} <span className="text-slate-400 font-normal">지난주 대비</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schedule</span>
                오늘의 예약 & 미용 대기
              </h2>
              <button className="text-sm text-primary font-bold">전체 일정</button>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {[
                { time: '10:00', dog: '벨라', breed: '푸들', service: '전신 미용', status: '완료' },
                { time: '13:30', dog: '코코', breed: '비숑', service: '스파 & 가위컷', status: '진행중' },
                { time: '16:00', dog: '초코', breed: '말티즈', service: '위생 미용', status: '대기' },
              ].map((item, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-400 w-12">{item.time}</span>
                    <div>
                      <h4 className="font-bold text-sm">{item.dog} <span className="font-medium text-slate-400">({item.breed})</span></h4>
                      <p className="text-xs text-slate-500">{item.service}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    item.status === '완료' ? 'bg-green-100 text-green-700' :
                    item.status === '진행중' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-2xl font-bold mb-2">AI 스타일 학습이 85% 완료되었습니다!</h3>
               <p className="text-slate-300 mb-6 max-w-md">원장님만의 가위컷 스타일을 AI가 더 정확하게 이해하기 위해 5장의 사진이 더 필요합니다.</p>
               <button onClick={() => navigate('/style-learning')} className="bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">학습 데이터 추가하기</button>
             </div>
             <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-white/5 font-thin rotate-12">psychology</span>
          </div>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-pink-500">favorite</span>
              최근 반응이 좋은 포스트
            </h3>
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden group">
                <img src="https://picsum.photos/id/1025/400/250" className="w-full h-full object-cover" alt="Best post" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="text-center">
                     <p className="text-white font-bold text-sm">좋아요 1.2k</p>
                     <p className="text-white/80 text-[10px]">댓글 48개</p>
                   </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">"곰돌이 컷의 정석! 벨라의 변신 과정을 보고 많은 분들이 문의를 주셨어요."</p>
            </div>
          </div>

          <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6">
            <h3 className="font-bold text-primary mb-2 flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-sm">lightbulb</span>
              AI 운영 팁
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              최근 '비숑 가위컷' 키워드의 검색량이 20% 상승했습니다. 관련 작업물을 업로드할 때 #비숑미용 태그를 꼭 포함하세요!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
