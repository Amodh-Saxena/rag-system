import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-color font-body">
      <div className="w-full max-w-sm border border-border-color bg-surface-color p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="font-display font-semibold text-xl text-text-color mb-2">NeuroMemory</h1>
          <p className="text-xs font-code text-muted-color uppercase tracking-widest">Provide Credentials</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {error && <div className="text-[10px] font-code text-[#A84A32]">{error}</div>}

          <Button type="submit" className="w-full">
            Authenticate
          </Button>
        </form>

        <div className="mt-6 text-center text-xs font-code text-muted-color">
          Core not initialized? <Link to="/register" className="text-text-color hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
}
