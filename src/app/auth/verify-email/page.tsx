'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function VerifyEmailPage() {
  const [timeLeft, setTimeLeft] = useState(60);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <div className="mt-4 text-gray-600">
            <p>
              We sent a verification link to your email address.
              Please click the link to verify your account.
            </p>
            <p className="mt-2">
              Didn't receive the email? Check your spam folder or{' '}
              {timeLeft > 0 ? (
                <span className="text-gray-400">
                  wait {timeLeft} seconds to request a new one
                </span>
              ) : (
                <button
                  onClick={() => {
                    // TODO: Implement resend verification email
                    setTimeLeft(60);
                  }}
                  className="text-black font-semibold hover:underline"
                >
                  request a new one
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
