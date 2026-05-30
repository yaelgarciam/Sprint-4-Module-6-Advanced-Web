import { useNavigate, useLocation } from 'react-router-dom';

type Props = {
  topic?: string;
  level?: string;
};

export default function ChatHeader({ topic, level }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-[52px] bg-surface/90 backdrop-blur-xl border-b border-black/10">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-[7px] bg-brand-green text-[#C0DD97] flex items-center justify-center font-serif font-semibold text-[15px]">
          T
        </div>
        <span className="font-serif font-light text-[15px] text-txt-muted">
          TutorBot
        </span>
        {topic && (
          <span className="text-xs text-brand-green-mid ml-2">
            · {topic} {level && `· ${level}`}
          </span>
        )}
      </div>
      <nav className="flex gap-1">
        {[
          { label: 'Topics', path: '/' },
          { label: 'Chat', path: '/chat' },
          { label: 'Progress', path: '/progress' },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`px-3.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all ${
              location.pathname === item.path
                ? 'bg-brand-green text-[#C0DD97] border-brand-green'
                : 'border-black/10 text-txt-muted hover:bg-surface-secondary'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
