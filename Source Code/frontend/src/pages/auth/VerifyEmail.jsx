import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SignOutButton from '../../components/auth/SignOutButton';
import {
  MailCheck, ArrowRight, Loader2, CheckCircle2,
  RefreshCw, LogOut, Sparkles,
} from 'lucide-react';

export default function VerifyEmail() {
  const { user, resendVerification } = useAuth();
  const navigate = useNavigate();

  const [sending, setSending] = useState(false);
  const [sentMessage, setSentMessage] = useState(false);

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerification();
      setSentMessage(true);
      setTimeout(() => setSentMessage(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleContinue = () => {
    navigate('/app/projects');
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      <div
        className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: '#7C3AED' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl p-8 relative shadow-2xl z-10 text-center"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div
          className="w-16 h-16 rounded-3xl mx-auto mb-5 flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}
        >
          <MailCheck className="w-8 h-8 text-white" />
        </div>

        <h1 className="font-display text-2xl font-bold tracking-tight mb-2 text-[#1F1B2E]">
          Verify your email
        </h1>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>
          We've sent a verification link to <span className="font-semibold text-primary">{user?.email || 'your email'}</span>.
          Please check your inbox to activate full account features.
        </p>

        {sentMessage && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Verification email resent successfully!
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            Continue to FlowML Workspace
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleResend}
            disabled={sending}
            className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Resend Verification Link
          </button>
        </div>

        <div className="mt-6 pt-5 border-t flex items-center justify-center" style={{ borderColor: 'var(--color-border)' }}>
          <SignOutButton
            redirectTo="/"
            className="text-xs font-medium text-slate-400 hover:text-red-400 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out and switch account
          </SignOutButton>
        </div>
      </motion.div>
    </div>
  );
}
