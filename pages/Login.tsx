
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    localStorage.setItem('is_logged_in', 'true');
    navigate('/home');
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-slate-900">
      {/* Left Section (Branding) */}
      <div className="hidden lg:flex w-1/2 relative bg-primary/10 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Happy white dog" 
            className="w-full h-full object-cover opacity-90" 
            src="https://picsum.photos/id/237/1000/1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent mix-blend-multiply opacity-60"></div>
        </div>
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white">
            <span className="material-symbols-outlined text-4xl">pets</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            당신의 작품을 <br/>세상에 알리세요.
          </h1>
          <p className="text-xl font-medium text-white/90 leading-relaxed mb-8">
            매일의 미용 작업을 멋진 소셜 미디어 포트폴리오로 자동 변환하여, 자는 동안에도 새로운 고객을 유치하세요.
          </p>
          <div className="flex items-center gap-4 text-sm font-semibold bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 w-fit">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <img key={i} src={`https://picsum.photos/id/${i+50}/100/100`} className="h-10 w-10 rounded-full border-2 border-white/50" />
              ))}
            </div>
            <span>2,000명 이상의 미용사들이 선택</span>
          </div>
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-24 lg:px-20 xl:px-32 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">반갑습니다!</h2>
          <p className="text-slate-500 dark:text-slate-400">서비스 이용을 위해 로그인해 주세요.</p>
        </div>

        <div className="space-y-4 mb-8">
          <button onClick={handleLogin} className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 h-12 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-5 w-5" alt="Google" />
            <span>구글로 로그인</span>
          </button>
          <button onClick={handleLogin} className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 h-12 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
             <img src="https://www.svgrepo.com/show/452229/instagram-1.svg" className="h-5 w-5" alt="Instagram" />
            <span>인스타그램으로 로그인</span>
          </button>
          <button onClick={handleLogin} className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#FEE500] h-12 text-sm font-bold text-[#191919] hover:bg-[#FDD835] transition-colors">
            <span className="material-symbols-outlined fill-1">chat</span>
            <span>카카오로 시작하기</span>
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
          <div className="relative flex justify-center text-sm"><span className="bg-white dark:bg-slate-900 px-2 text-slate-500">또는 이메일로 로그인</span></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">이메일</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">mail</span>
              <input 
                type="email" 
                placeholder="groomer@example.com"
                required
                className="block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 py-3 focus:ring-primary focus:border-primary" 
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">비밀번호</label>
              <a href="#" className="text-sm font-semibold text-primary hover:underline">비밀번호 찾기</a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">lock</span>
              <input 
                type="password" 
                placeholder="••••••••"
                required
                className="block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 py-3 focus:ring-primary focus:border-primary" 
              />
            </div>
          </div>
          <button type="submit" className="w-full rounded-xl bg-primary py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all">
            로그인
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          계정이 없으신가요? <a href="#" className="font-bold text-primary hover:underline ml-1">무료 회원가입</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
