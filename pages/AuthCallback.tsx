import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const loginSuccess = searchParams.get('login_success');
        const username = searchParams.get('username');
        const id = searchParams.get('id');

        if (loginSuccess === 'true' && username && id) {
            const needsCompletion = searchParams.get('needs_completion') === 'true';
            const instagramId = searchParams.get('instagram_id');

            if (needsCompletion && instagramId) {
                // Redirect to complete signup
                navigate(`/complete-signup?instagram_id=${instagramId}&username=${username}`, { replace: true });
                return;
            }

            // Set session data
            localStorage.setItem('is_logged_in', 'true');
            localStorage.setItem('user', JSON.stringify({ id, username }));

            // Redirect to home
            navigate('/home', { replace: true });
        } else {
            // Handle error or invalid redirect
            navigate('/login', { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-300">로그인 중입니다...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
