import { Eye, EyeOff, Link2, ShieldCheck, ArrowRight } from 'lucide-react';

import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';



export default function LoginPage() {

  const navigate = useNavigate();

  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [code, setCode] = useState('');

  const [mfa, setMfa] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [busy, setBusy] = useState(false);

  useEffect(() => { if (isAuthenticated && !isLoading) navigate('/dashboard', { replace: true }); }, [isAuthenticated, isLoading, navigate]);

  async function submit(event: React.FormEvent) {

    event.preventDefault(); setBusy(true);

    try {

      const result = await login({ email: email.trim(), password, rememberMe, code: mfa ? code.trim() : undefined });

      if (result === 'mfa') setMfa(true);

      if (result === true) navigate('/dashboard', { replace: true });

    } finally { setBusy(false); }

  }

  return <div className="login-shell min-h-screen flex flex-col items-center justify-center px-4 py-10">

    <div className="login-art" aria-hidden="true">
      <div className="login-orbit login-orbit-blue" />
      <div className="login-orbit login-orbit-teal" />
      <div className="login-orbit login-orbit-indigo" />
      <div className="login-dots" />
      <svg className="login-ribbon" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" focusable="false">
        <path d="M-200 860C140 430 440 1200 850 820S1430 510 1810 80" fill="none" stroke="#c9ddff" strokeWidth="110" opacity=".35" />
        <path d="M-200 900C140 470 440 1240 850 860S1430 550 1810 120" fill="none" stroke="#fff" strokeWidth="2" opacity=".8" />
      </svg>
    </div>
    <div className="login-panel relative z-10 w-full max-w-[960px] bg-white rounded-3xl border border-slate-200 shadow-soft grid md:grid-cols-2 overflow-hidden">

      <section className="login-story p-8 sm:p-12 flex flex-col justify-between gap-10 border-b md:border-b-0 md:border-r border-slate-100">

        <div className="flex items-center gap-3"><div className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center"><Link2 size={24}/></div><span className="text-xl font-semibold tracking-tight">Corizo Links</span></div>

        <div><p className="text-xs uppercase tracking-widest font-semibold text-blue-700 mb-4">Your team workspace</p><h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">Everything you need.<br/>One place to find it.</h1><p className="mt-5 text-slate-500 text-sm leading-7">Find shared documents, spreadsheets, forms and Figma designs. Keep your team connected and your work moving.</p><div className="flex flex-wrap gap-2 mt-6">{['Google Workspace', 'Microsoft 365', 'Figma'].map(name => <span key={name} className="rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-600">{name}</span>)}</div></div>

        <p className="flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={16}/>For authorized Corizo employees</p>

      </section>

      <section className="p-8 sm:p-12 flex flex-col justify-center">

        <h2 className="text-2xl font-semibold tracking-tight">{mfa ? 'Verify it’s you' : 'Welcome back'}</h2><p className="text-sm text-slate-500 mt-2 mb-8">{mfa ? 'Enter your authenticator or recovery code.' : 'Sign in with your work account to continue.'}</p>

        {isLoading ? <p role="status" className="text-sm text-slate-500">Checking your session…</p> : <form onSubmit={submit} className="space-y-5">

          {!mfa ? <><label className="block text-sm font-medium" htmlFor="email">Work email<input id="email" type="email" autoComplete="username" className="input-field mt-2" placeholder="you@corizo.in" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254}/></label>

          <div><label className="block text-sm font-medium mb-2" htmlFor="password">Password</label><div className="relative"><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" className="input-field pr-12" value={password} onChange={e => setPassword(e.target.value)} required maxLength={128}/><button type="button" className="absolute right-3 inset-y-0 text-slate-400" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></div>

          <label className="flex gap-2 items-center text-sm text-slate-500"><input type="checkbox" className="accent-primary w-4 h-4" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}/>Remember me for 7 days</label></>

          : <><p className="text-sm text-slate-500 truncate">{email}</p><label className="block text-sm font-medium" htmlFor="otp">Verification code<input id="otp" className="input-field mt-2 text-lg tracking-widest" autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value)} required maxLength={16} autoFocus/></label><p className="text-xs text-slate-500 leading-5">Open your authenticator app for a six-digit code, or use one of your saved recovery codes.</p><button type="button" className="text-sm text-primary" onClick={() => { setMfa(false); setCode(''); }}>Use a different account</button></>}

          <button className="btn-primary w-full flex items-center justify-center gap-2" disabled={busy}>{busy ? 'Signing in…' : mfa ? 'Verify and sign in' : 'Sign in'}<ArrowRight size={17}/></button>

          <p className="text-xs text-slate-400 leading-5">Access and activity are logged for account security. Contact your administrator if you need help signing in.</p>

        </form>}

      </section>

    </div><p className="relative z-10 mt-6 text-xs text-slate-500">© {new Date().getFullYear()} Corizo · Internal workspace</p>

  </div>;

}

