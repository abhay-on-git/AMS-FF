import type { FormEvent } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface LoginFormProps {
  email: string;
  password: string;
  error?: string;
  loading?: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onForgotPassword: () => void;
}

export function LoginForm(props: LoginFormProps) {
  const { email, password, error, loading, onEmailChange, onPasswordChange, onSubmit, onForgotPassword } = props;
  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <Input value={email} onChange={(e) => onEmailChange(e.target.value)} placeholder='Email address' />
      <Input type='password' value={password} onChange={(e) => onPasswordChange(e.target.value)} placeholder='Password' />
      {error ? <p className='text-sm text-red-500'>{error}</p> : null}
      <div className='flex items-center justify-between'>
        <Button type='button' variant='ghost' onClick={onForgotPassword}>Forgot password?</Button>
        <Button type='submit' disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
      </div>
    </form>
  );
}
