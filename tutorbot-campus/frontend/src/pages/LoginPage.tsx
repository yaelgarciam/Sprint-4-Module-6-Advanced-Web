import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, login } from '../api/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentId, setStudentId] = useState('A00835001');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await login(studentId, password);
      const nextPath = (location.state as { from?: string } | null)?.from || '/';
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-black/10 p-8 shadow-sm">
        <div className="mb-2 font-mono text-[11px] text-txt-subtle tracking-wider">SIGN IN</div>
        <h1 className="font-serif text-4xl text-txt mb-2">TutorBot Campus</h1>
        <p className="text-sm text-txt-muted mb-8">
          Sign in with your student account to start a synced tutoring session.
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-sm text-txt">
            Student ID
            <input
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              className="rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-brand-green"
              placeholder="A01234"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-txt">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-brand-green"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <div className="rounded-xl bg-brand-coral-light text-brand-coral text-sm px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !studentId || !password}
            className="rounded-xl bg-brand-green text-[#C0DD97] px-4 py-3 font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
