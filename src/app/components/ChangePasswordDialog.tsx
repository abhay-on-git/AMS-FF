import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  ReportProblem as ErrorIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setStep('form');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setLoading(false);
    setError('');
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetForm, 300);
  };

  // Password strength
  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length >= 12) score++;
    return score;
  };

  const strengthLevel = getPasswordStrength(newPassword);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
  const strengthTextColors = ['', 'text-red-600', 'text-orange-600', 'text-yellow-600', 'text-green-600', 'text-emerald-600'];

  const rules = [
    { check: newPassword.length >= 8, label: 'At least 8 characters' },
    { check: /[A-Z]/.test(newPassword), label: 'One uppercase letter' },
    { check: /[0-9]/.test(newPassword), label: 'One number' },
    { check: /[^A-Za-z0-9]/.test(newPassword), label: 'One special character' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!oldPassword) {
      setError('Please enter your current password.');
      return;
    }
    if (oldPassword.length < 4) {
      setError('Current password is incorrect.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword === oldPassword) {
      setError('New password must differ from the current password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      toast.success('Password changed successfully!');
    }, 1500);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose(); else onOpenChange(true); }}>
      <SheetContent side="right" className="!w-full sm:!max-w-md flex flex-col overflow-hidden p-0">
        <SheetHeader className="pr-8 px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-[15px]">Change Password</SheetTitle>
          <SheetDescription className="text-[14px]">Update your account password</SheetDescription>
        </SheetHeader>

        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-4 pb-24 space-y-5">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="cp-old-password" className="text-[15px] font-medium">Current Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="cp-old-password"
                        type={showOldPassword ? 'text' : 'password'}
                        placeholder="Enter current password"
                        value={oldPassword}
                        onChange={(e) => { setOldPassword(e.target.value); setError(''); }}
                        className="h-[52px] text-[15px] placeholder:text-[14px] pl-10 pr-10"
                        autoFocus
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? <VisibilityOffIcon className="w-4 h-4" /> : <VisibilityIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Separator />

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="cp-new-password" className="text-[15px] font-medium">New Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="cp-new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                        className="h-[52px] text-[15px] placeholder:text-[14px] pl-10 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <VisibilityOffIcon className="w-4 h-4" /> : <VisibilityIcon className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Strength meter */}
                    {newPassword && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <div className="flex gap-1 mt-1.5">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1.5 flex-1 rounded-full transition-colors ${level <= strengthLevel ? strengthColors[strengthLevel] : 'bg-muted'}`}
                            />
                          ))}
                        </div>
                        <p className={`text-md mt-1 ${strengthTextColors[strengthLevel]}`}>
                          {strengthLabels[strengthLevel]}
                        </p>
                        <div className="mt-2 space-y-1.5">
                          {rules.map((rule) => (
                            <div key={rule.label} className="flex items-center gap-2 text-md">
                              <CheckCircleIcon className={`w-3.5 h-3.5 ${rule.check ? 'text-green-500' : 'text-muted-foreground/40'}`} />
                              <span className={rule.check ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}>{rule.label}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="cp-confirm-password" className="text-[15px] font-medium">Confirm New Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="cp-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                        className="h-[52px] text-[15px] placeholder:text-[14px] pl-10 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <VisibilityOffIcon className="w-4 h-4" /> : <VisibilityIcon className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-md text-red-600 dark:text-red-400">Passwords do not match</p>
                    )}
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-[4px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                      <ErrorIcon className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                      <p className="text-[15px] text-red-700 dark:text-red-400">{error}</p>
                    </motion.div>
                  )}

                  {/* Tips */}
                  <div className="bg-muted/50 rounded-[4px] border p-4">
                    <p className="text-[15px] font-medium text-muted-foreground mb-2">Password Tips</p>
                    <div className="space-y-1 text-[14px] text-muted-foreground">
                      <p>- Use a mix of letters, numbers, and symbols</p>
                      <p>- Avoid using personal information</p>
                      <p>- Don't reuse passwords from other accounts</p>
                    </div>
                  </div>
                </div>

                {/* Fixed Footer */}
                <div className="border-t bg-background px-6 py-4 shrink-0">
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleClose} className="h-10 px-5 text-[15px]">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="h-10 px-5 bg-[#121321] rounded-[4px] text-white text-[15px]"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Updating...
                        </div>
                      ) : 'Update Password'}
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col items-center justify-center px-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6"
              >
                <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
              </motion.div>
              <h3 className="text-lg font-bold text-[#121321] dark:text-white mb-1">Password Updated</h3>
              <p className="text-[15px] text-muted-foreground mb-8 text-center">
                Your password has been changed successfully. Use your new password next time you sign in.
              </p>
              <Button onClick={handleClose} className="bg-[#121321] rounded-[4px] text-white h-10 px-5 text-[15px] w-full max-w-xs">
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}

