
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: '홈', icon: 'dashboard', path: '/home' },
    { name: '스타일 학습', icon: 'school', path: '/style-learning' },
    { name: '자동 업로드', icon: 'auto_awesome', path: '/upload' },
    { name: '게시 기록', icon: 'history', path: '/insights' },
    { name: '설정', icon: 'settings', path: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        await fetch('http://localhost:3001/api/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id })
        });
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('user');
    window.location.href = '#/login';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggle}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 transform flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined font-bold">pets</span>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Paws & Pose</h1>
            <p className="text-slate-400 text-xs">AI 소셜 매니저</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
                ${isActive(item.path)
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary'}
              `}
            >
              <span className={`material-symbols-outlined ${isActive(item.path) ? 'fill-1' : 'group-hover:fill-1'}`}>
                {item.icon}
              </span>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 group transition-colors">
            <div className="flex items-center gap-3">
              <img
                src="https://picsum.photos/id/64/100/100"
                className="size-10 rounded-full object-cover"
                alt="Groomer Profile"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold">김지현 원장님</span>
                <span className="text-xs text-slate-500">프로 플랜</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
              title="로그아웃"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
