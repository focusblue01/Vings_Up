
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    full_name: '',
    email_or_phone: ''
  });
  const [error, setError] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegistering ? 'http://localhost:3001/api/register' : 'http://localhost:3001/api/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (isRegistering) {
        alert('회원가입 성공! 로그인해주세요.');
        setIsRegistering(false);
      } else {
        localStorage.setItem('is_logged_in', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.message);
    }
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
            당신의 작품을 <br />세상에 알리세요.
          </h1>
          <p className="text-xl font-medium text-white/90 leading-relaxed mb-8">
            매일의 미용 작업을 멋진 소셜 미디어 포트폴리오로 자동 변환하여, 자는 동안에도 새로운 고객을 유치하세요.
          </p>
          <div className="flex items-center gap-4 text-sm font-semibold bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 w-fit">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <img key={i} src={`https://picsum.photos/id/${i + 50}/100/100`} className="h-10 w-10 rounded-full border-2 border-white/50" />
              ))}
            </div>
            <span>2,000명 이상의 미용사들이 선택</span>
          </div>
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-24 lg:px-20 xl:px-32 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            {isRegistering ? '회원가입' : '반갑습니다!'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            {isRegistering ? '친구들의 사진과 동영상을 보려면 가입하세요.' : '서비스 이용을 위해 로그인해 주세요.'}
          </p>
        </div>

        {/* Removed Google/Kakao Logins */}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-4">
            {isRegistering && (
              <>
                <div>
                  <input
                    name="email_or_phone"
                    type="text"
                    placeholder="휴대폰 번호 또는 이메일 주소"
                    required
                    onChange={handleChange}
                    className="block w-full rounded-sm border-slate-300 bg-slate-50 px-2 py-2 text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
                  />
                </div>
                <div>
                  <input
                    name="full_name"
                    type="text"
                    placeholder="성명"
                    required
                    onChange={handleChange}
                    className="block w-full rounded-sm border-slate-300 bg-slate-50 px-2 py-2 text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
                  />
                </div>
              </>
            )}

            <div>
              <input
                name="username"
                type="text"
                placeholder={isRegistering ? "사용자 이름" : "전화번호, 사용자 이름 또는 이메일"}
                required
                onChange={handleChange}
                className="block w-full rounded-sm border-slate-300 bg-slate-50 px-2 py-2 text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                placeholder="비밀번호"
                required
                onChange={handleChange}
                className="block w-full rounded-sm border-slate-300 bg-slate-50 px-2 py-2 text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button type="submit" className="w-full rounded-lg bg-[#0095f6] py-1.5 text-sm font-semibold text-white hover:bg-[#1877F2] transition-colors disabled:opacity-70">
            {isRegistering ? '가입' : '로그인'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-300"></div></div>
          <div className="relative flex justify-center text-xs font-semibold"><span className="bg-white dark:bg-slate-900 px-4 text-slate-500">또는</span></div>
        </div>

        <div className="flex flex-col items-center gap-4">
          {!isRegistering && (
            <button onClick={() => window.location.href = 'http://localhost:3001/api/auth/instagram'} className="flex items-center gap-2 text-sm font-semibold text-[#385185]">
              <img src="https://www.svgrepo.com/show/452229/instagram-1.svg" className="h-4 w-4" alt="Instagram" />
              <span>Instagram으로 로그인</span>
            </button>
          )}
          {!isRegistering && (
            <a href="#" className="text-xs text-[#00376b]">비밀번호를 잊으셨나요?</a>
          )}
        </div>

        <div className="mt-8 flex justify-center py-4 border border-slate-300 rounded-sm">
          <p className="text-sm">
            {isRegistering ? '계정이 있으신가요?' : '계정이 없으신가요?'}
            <button onClick={() => setIsRegistering(!isRegistering)} className="font-semibold text-[#0095f6] ml-1">
              {isRegistering ? '로그인' : '가입하기'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
