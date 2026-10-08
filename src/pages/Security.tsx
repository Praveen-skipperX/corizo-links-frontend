import { useState } from 'react';
import { ShieldCheck, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Security() {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [secret, setSecret] = useState('');
  const [codes, setCodes] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  async function request(action: 'setup' | 'enable' | 'disable' | 'password') {
    setBusy(true);
    try {
      const { data } = action === 'password'
        ? await api.patch('/auth/change-password', { currentPassword: password, newPassword })
        : await api.post(`/auth/mfa/${action}`, { password, code });
      if (action === 'setup') setSecret(data.data.secret);
      else {
        setCodes(data.data?.recoveryCodes || []); setDone(true); setSecret(''); setPassword(''); setCode(''); setNewPassword('');
        toast.success(data.message);
      }
    } catch (error: unknown) {
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Unable to update security settings.');
    } finally { setBusy(false); }
  }
  return <div className="max-w-2xl space-y-6">
    <div><p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Your account</p><h1 className="text-2xl font-semibold">Security settings</h1><p className="text-sm text-gray-500 mt-2">Protect your account with a password and an authenticator app.</p></div>
    {done ? <section className="card space-y-4"><ShieldCheck className="text-emerald-600"/><h2 className="font-semibold">Security settings updated</h2>{codes.length > 0 && <><p className="text-sm text-gray-600">Save these recovery codes privately before leaving. Each code works once; these are shown only now.</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{codes.map(c => <code className="bg-slate-50 p-2 rounded border select-all" key={c}>{c}</code>)}</div><button className="btn-outline" onClick={() => { const blob = new Blob([codes.join('\n')], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'corizo-recovery-codes.txt'; a.click(); URL.revokeObjectURL(url); }}>Download recovery codes</button></>}<p className="text-sm">Your existing sessions have been revoked.</p><Link className="btn-primary inline-block" to="/login" reloadDocument>Sign in again</Link></section>
    : <><section className="card space-y-4"><div className="flex items-center gap-3"><ShieldCheck className="text-primary"/><h2 className="font-semibold">Authenticator app</h2><span className={user?.mfaEnabled ? 'badge-active' : 'badge-inactive'}>{user?.mfaEnabled ? 'Enabled' : 'Not enabled'}</span></div><p className="text-sm text-gray-500">Use Google Authenticator, Microsoft Authenticator, or another TOTP app.</p>
      <label className="block text-sm font-medium">Current password<input className="input-field mt-2" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></label>
      {secret && <div className="bg-blue-50 rounded-xl p-4 space-y-3"><p className="text-sm">In your authenticator, add an account manually. Choose a time-based key, use your email as the account name, and enter this key.</p><code className="block break-all select-all text-sm font-semibold">{secret}</code><p className="text-xs text-gray-500">Setup expires in 10 minutes. Keep this key private.</p></div>}
      {(secret || user?.mfaEnabled) && <label className="block text-sm font-medium">Authenticator code<input className="input-field mt-2" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} inputMode="numeric" maxLength={6} autoComplete="one-time-code" /></label>}
      <button disabled={busy || !password || ((!!secret || !!user?.mfaEnabled) && code.length !== 6)} className="btn-primary" onClick={() => request(user?.mfaEnabled ? 'disable' : secret ? 'enable' : 'setup')}>{busy ? 'Please wait…' : user?.mfaEnabled ? 'Disable authenticator' : secret ? 'Verify and enable' : 'Set up authenticator'}</button>
    </section><section className="card space-y-4"><div className="flex gap-3 items-center"><KeyRound className="text-primary"/><h2 className="font-semibold">Change password</h2></div><p className="text-sm text-gray-500">Enter your current password above and a new password of 12–72 characters. This signs you out on all devices.</p><label className="block text-sm font-medium">New password<input className="input-field mt-2" type="password" autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={12} maxLength={72}/></label><button className="btn-outline" disabled={busy || !password || newPassword.length < 12} onClick={() => request('password')}>Update password</button></section></>}
  </div>;
}
