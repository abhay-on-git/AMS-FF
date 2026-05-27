import { Input } from '@/app/components/ui/input';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  return <p className='text-xs text-muted-foreground'>Strength: {score}/4</p>;
}

interface ResetPasswordFormProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

export function ResetPasswordForm(props: ResetPasswordFormProps) {
  return (
    <div className='space-y-3'>
      <Input type='password' value={props.password} onChange={(e) => props.onPasswordChange(e.target.value)} placeholder='New password' />
      <Input type='password' value={props.confirmPassword} onChange={(e) => props.onConfirmPasswordChange(e.target.value)} placeholder='Confirm password' />
      <PasswordStrengthIndicator password={props.password} />
    </div>
  );
}
