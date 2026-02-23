
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  const tabs = [
    { id: 'profile', label: '프로필 설정', icon: 'person' },
    { id: 'ai', label: 'AI 브랜드 보이스', icon: 'auto_awesome' },
    { id: 'integration', label: '계정 연동', icon: 'link' },
    { id: 'notification', label: '알림 설정', icon: 'notifications' },
  ];

  const handleLogout = () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      localStorage.removeItem('is_logged_in');
      navigate('/login');
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight text-slate-900 dark:text-white">설정</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="md:w-64 flex-none flex flex-col justify-between min-h-[400px]">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              로그아웃
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm text-slate-900 dark:text-white">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-4">기본 정보</h3>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="relative">
                    <img src="https://picsum.photos/id/64/200/200" className="size-24 rounded-2xl object-cover" alt="Profile" />
                    <button className="absolute -bottom-2 -right-2 size-8 bg-white dark:bg-slate-700 rounded-full shadow-md border border-slate-200 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-bold text-lg">김지현 원장님</p>
                    <p className="text-sm text-slate-500">paws_pose_owner@grooming.com</p>
                    <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">프로 멤버십 사용 중</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">샵 이름</label>
                  <input type="text" className="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary" defaultValue="포즈앤포즈 신사본점" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">전화번호</label>
                  <input type="text" className="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary" defaultValue="010-1234-5678" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">취소</button>
                <button className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:bg-primary-dark transition-all">변경사항 저장</button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30 flex gap-4">
                <span className="material-symbols-outlined text-indigo-500">info</span>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                  AI가 생성하는 글의 어투를 설정할 수 있습니다. 설정된 톤앤매너에 맞춰 인스타그램 캡션과 해시태그가 생성됩니다.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm">브랜드 페르소나</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['친근하고 귀여운', '전문적이고 신뢰감 있는', '간결하고 위트있는', '감성적이고 따뜻한'].map(tone => (
                    <label key={tone} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                      <input type="radio" name="tone" className="text-primary focus:ring-primary h-4 w-4" defaultChecked={tone === '친근하고 귀여운'} />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{tone}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold">자주 쓰는 이모지</label>
                <div className="flex flex-wrap gap-2">
                  {['🐶', '✂️', '❤️', '✨', '🐾'].map(emoji => (
                    <button key={emoji} className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors text-lg">{emoji}</button>
                  ))}
                  <button className="size-10 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-300 hover:text-primary hover:border-primary transition-all">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notification' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                <div>
                  <p className="font-bold text-sm">업로드 완료 알림</p>
                  <p className="text-xs text-slate-500">AI가 게시물을 자동으로 올렸을 때 알림을 받습니다.</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                <div>
                  <p className="font-bold text-sm">주간 인사이트 리포트</p>
                  <p className="text-xs text-slate-500">매주 월요일, 지난주 게시물 성과 보고서를 받습니다.</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integration' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-lg bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-600 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">photo_camera</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Instagram</h3>
                    <p className="text-xs text-slate-500">@pawsome_cuts 연결됨</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-rose-500 px-4 py-2 hover:bg-rose-50 rounded-lg transition-colors">연동 해제</button>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 gap-4 opacity-60">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-lg bg-[#1877F2] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">facebook</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Facebook</h3>
                    <p className="text-xs text-slate-500">현재 연동된 페이지 없음</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-primary px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors">연결하기</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
