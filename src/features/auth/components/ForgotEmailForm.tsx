import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface ForgotEmailFormProps {
  email: string;
  loading?: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ForgotEmailForm({ email, loading, onEmailChange, onSubmit }: ForgotEmailFormProps) {
  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <Input value={email} onChange={(e) => onEmailChange(e.target.value)} placeholder='Registered email' />
      <Button type='submit' disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</Button>
    </form>
  );
}
