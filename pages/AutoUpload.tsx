import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateGroomingCaption } from '../services/gemini';

const AutoUpload: React.FC = () => {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("우와! 이 변신 좀 보세요! 🐶✂️ 벨라가 오늘 풀 코스 스파를 받고 슈퍼스타처럼 변신했어요. 귀여운 눈망울을 돋보이게 하기 위해 테디베어 컷으로 미용했답니다. 오늘 미용하는 동안 너무 얌전하고 착했어요! ❤️");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    const newCaption = await generateGroomingCaption("Poodle named Bella, full course spa, teddy bear cut, behaved well");
    setCaption(newCaption || caption);
    setIsGenerating(false);
  };

  const handlePublish = async (isDraft: boolean) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('로그인이 필요합니다.');
      return navigate('/login');
    }
    const user = JSON.parse(userStr);

    setIsPublishing(true);
    try {
      const response = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          caption: caption,
          imageUrl: 'https://picsum.photos/id/237/800/800',
          isDraft
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.details || '업로드 실패');

      alert(isDraft ? '임시 저장되었습니다.' : '게시가 완료되었습니다!');
      navigate('/insights');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto w-full h-full">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>대시보드</span> <span>/</span> <span className="text-slate-900 dark:text-white font-medium">자동 업로드</span>
        </div>
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">미용 결과 자동 업로드</h1>
            <p className="text-slate-500 max-w-2xl">"비포 & 애프터" 사진을 업로드하면 AI가 피드에 딱 맞는 캡션과 해시태그를 자동으로 생성해 드립니다.</p>
          </div>
          <button onClick={() => handlePublish(true)} disabled={isPublishing} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 text-primary font-bold hover:bg-primary/5 transition disabled:opacity-50">
            <span className="material-symbols-outlined text-lg">draft</span>
            임시 저장
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_a_photo</span>
                사진 업로드 (드래그 앤 드롭)
              </h3>
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-bold">Step 1</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl min-h-[400px] p-8 text-center cursor-pointer hover:border-primary transition-all">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-3xl">cloud_upload</span>
              </div>
              <p className="text-lg font-bold mb-1">클릭하여 업로드하거나 여기로 파일을 드래그하세요</p>
              <p className="text-sm text-slate-400 mb-8">SVG, PNG, JPG 또는 GIF (최대 800x400px)</p>

              <div className="flex gap-6">
                {['BEFORE', 'AFTER'].map(type => (
                  <div key={type} className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
                    <span className="text-[10px] font-bold text-slate-400 mb-2 block">{type}</span>
                    <div className="size-24 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200">
                      <span className="material-symbols-outlined text-4xl">image</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-4">
              <span className="material-symbols-outlined text-primary">info</span>
              <div>
                <p className="text-sm font-bold mb-1">더 나은 AI 결과를 위한 팁</p>
                <p className="text-sm text-slate-500">두 사진의 조명과 각도가 비슷할수록 좋습니다. 얼굴이 명확하게 보여야 AI가 더 정확하게 감지할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Result Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                AI 캡션 생성 결과
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button className="p-1.5 rounded bg-white shadow-sm text-primary"><span className="material-symbols-outlined text-lg">phone_iphone</span></button>
                <button className="p-1.5 rounded text-slate-400"><span className="material-symbols-outlined text-lg">public</span></button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent hover:border-primary transition-all cursor-pointer">
                <img src="https://picsum.photos/id/237/100/100" className="size-12 rounded object-cover" alt="Dog thumbnail" />
                <div className="flex-1">
                  <p className="font-bold text-sm truncate">이미지 미리보기...</p>
                  <p className="text-xs text-slate-400">사진 2장 선택됨</p>
                </div>
                <span className="material-symbols-outlined text-slate-300">visibility</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold">게시물 내용</label>
                  <button
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline disabled:opacity-50"
                  >
                    <span className={`material-symbols-outlined text-xs ${isGenerating ? 'animate-spin' : ''}`}>refresh</span>
                    다시 생성
                  </button>
                </div>
                <textarea
                  className="w-full h-40 p-4 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-primary leading-relaxed resize-none"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="AI가 글을 작성하고 있습니다..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold">태그 추천</label>
                <div className="flex flex-wrap gap-2">
                  {['#강아지미용', '#비포애프터', '#푸들미용', '#애견미용사'].map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 hover:bg-primary/20 cursor-pointer">
                      {tag} <span className="material-symbols-outlined text-xs">close</span>
                    </span>
                  ))}
                  <button className="size-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold">업로드 일정</label>
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-bold text-green-600">업로드 준비 완료</span>
                </div>
              </div>
              <div className="flex gap-2">
                <input type="date" className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm p-2" defaultValue="2023-10-27" />
                <input type="time" className="w-32 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm p-2" defaultValue="14:00" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => handlePublish(false)} disabled={isPublishing} className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              <span className={`material-symbols-outlined ${isPublishing ? 'animate-spin' : ''}`}>
                {isPublishing ? 'sync' : 'send'}
              </span>
              {isPublishing ? '업로드 중...' : '지금 게시하기'}
            </button>
            <button className="w-full py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-slate-50">
              <span className="material-symbols-outlined text-slate-400">event</span>
              예약하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoUpload;
