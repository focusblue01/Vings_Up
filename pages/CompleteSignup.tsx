import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CompleteSignup: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const instagramId = searchParams.get('instagram_id');
    const username = searchParams.get('username');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/auth/complete-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instagram_id: instagramId,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Signup completion failed');

            alert('회원가입이 완료되었습니다! 로그인해주세요.');
            // Ideally auto-login here, but for simplicity:
            navigate('/login');

        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!instagramId) return <div>Invalid Access</div>;

    return (
        <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-900 px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        회원가입 완료하기
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Instagram 계정 (@{username})이 확인되었습니다.<br />
                        서비스 이용을 위해 이메일과 비밀번호를 설정해주세요.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label className="sr-only">Email</label>
                            <input
                                name="email"
                                type="text" // text to allow phone or email
                                required
                                className="relative block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                                placeholder="이메일 또는 전화번호"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="sr-only">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="relative block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="sr-only">Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="relative block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                                placeholder="비밀번호 확인"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && <p className="text-center text-sm text-red-500">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            가입 완료
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteSignup;
