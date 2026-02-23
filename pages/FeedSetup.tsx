import React, { useState, useEffect } from 'react';

const FeedSetup: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const isInstaLinked = user?.conn_status === 1;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">school</span>
            AI 학습 모드
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">피드 학습 설정</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            계정을 연결하여 AI에게 원장님만의 독특한 그루밍 스타일과 브랜드 보이스를 가르쳐주세요. 베스트 게시물을 분석하여 톤앤매너를 재현해드립니다.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
          <span className="material-symbols-outlined text-green-500 text-lg">security</span>
          <span>데이터는 안전하게 보호됩니다</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Account Connection Section */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="flex items-center justify-center size-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold">1</span>
                SNS 계정 연결
              </h2>
              <span className="text-sm font-medium text-slate-400">2개 중 {isInstaLinked ? 1 : 0}개 연결됨</span>
            </div>

            <div className="space-y-4">
              <div className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border gap-4 ${isInstaLinked ? 'border-primary/20 bg-primary/5' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-lg bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-600 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">photo_camera</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">Instagram</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isInstaLinked ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{isInstaLinked ? '연동됨' : '미연동'}</span>
                    </div>
                    <p className="text-sm text-slate-500">{isInstaLinked ? `@${user?.username}` : '인스타그램 계정을 연동해 주세요.'}</p>
                  </div>
                </div>
                {isInstaLinked ? (
                  <button className="text-sm font-semibold text-slate-400 hover:text-red-500 px-3 py-1">연동 해제</button>
                ) : (
                  <button onClick={() => window.location.href = 'http://localhost:3001/api/auth/instagram'} className="rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-white text-sm font-semibold px-4 py-2">연결하기</button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-lg bg-[#1877F2] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">facebook</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">Facebook</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">미연동</span>
                    </div>
                    <p className="text-sm text-slate-500">리뷰 및 게시물 동기화를 위해 연결하세요</p>
                  </div>
                </div>
                <button className="rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-white text-sm font-semibold px-4 py-2">연결하기</button>
              </div>
            </div>
          </section>

          {/* Style Analysis Section */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="flex items-center justify-center size-8 rounded-full bg-primary text-white text-sm font-bold">2</span>
                스타일 분석
              </h2>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative rounded-full h-3 w-3 bg-primary"></span>
                </span>
                학습 준비 완료
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>스타일 프로필 완성도</span>
                <span className="text-primary font-bold">12%</span>
              </div>
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[12%] rounded-full shadow-lg shadow-primary/50"></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">정확도를 높이려면 계정을 추가하거나 사진을 수동으로 업로드하세요.</p>
            </div>

            <div className="flex gap-4 mt-8">
              <button className="flex-1 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold h-12 shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">auto_awesome</span>
                내 스타일 학습 시작하기
              </button>
              <button className="flex-none rounded-xl border border-slate-200 dark:border-slate-700 font-semibold h-12 px-6 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">tune</span>
                설정
              </button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">감지된 게시물</h3>
              <button className="text-primary text-sm font-semibold hover:underline">모두 보기</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map(i => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer">
                  <img src={`https://picsum.photos/id/${i + 10}/400/400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Dog post" />
                  <div className="absolute top-2 right-2 size-6 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                    <span className="material-symbols-outlined text-xs">check</span>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white">#곰돌이컷</div>
                </div>
              ))}
              <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary border-dashed bg-primary/5 flex flex-col items-center justify-center text-primary">
                <span className="material-symbols-outlined animate-spin text-3xl mb-1">sync</span>
                <span className="text-xs font-bold">피드 분석 중...</span>
              </div>
              {[4, 5, 6].map(i => (
                <div key={i} className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined text-4xl mb-1">image</span>
                  <span className="text-[10px]">분석 대기 중</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider text-xs">감지된 스타일 태그</h4>
              <div className="flex flex-wrap gap-2">
                {['발랄한', '프로페셔널', '비포에프터'].map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-xs">tag</span> {tag}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-dashed border-slate-200 text-slate-400 text-xs">
                  감지 중...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedSetup;
