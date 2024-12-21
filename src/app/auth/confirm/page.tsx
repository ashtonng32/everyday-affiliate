'use client';

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedEmail = window.localStorage.getItem('confirmEmail');
    if (!storedEmail) {
      router.push('/auth/sign-up');
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const resendConfirmation = async () => {
    try {
      setIsResending(true);
      setMessage('');

      if (!email) {
        throw new Error('No email found. Please try signing up again.');
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setMessage('Confirmation email has been resent. Please check your inbox.');
    } catch (error: any) {
      setMessage(error.message || 'Failed to resend confirmation email.');
      console.error('Resend error:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="h-[600px] flex items-center justify-center">
      <div className="container max-w-lg flex flex-col items-center">
        <div className="text-center space-y-4 w-full max-w-sm">
          <h1 className="text-2xl font-semibold">Check your email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent you a confirmation link to <span className="font-medium">{email}</span>. 
            Please check your email to continue.
          </p>

          <div className="pt-4">
            <Button
              variant="outline"
              onClick={resendConfirmation}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? 'Sending...' : 'Resend confirmation email'}
            </Button>

            {message && (
              <p className={`mt-4 text-sm ${
                message.includes('error') || message.includes('Failed') 
                  ? 'text-red-500' 
                  : 'text-green-500'
              }`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
