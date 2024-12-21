'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Check if we have a hash with tokens
        if (window.location.hash) {
          console.log('Found hash in URL');
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const type = hashParams.get('type');

          console.log('Token type:', type);

          if (accessToken && refreshToken && type === 'signup') {
            console.log('Setting session');
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error('Session error:', error);
              throw error;
            }

            if (data.session) {
              console.log('Session established, redirecting');
              window.localStorage.removeItem('confirmEmail');
              window.location.replace('/retailers');
              return;
            }
          }
        }

        // Check if already logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          window.location.replace('/retailers');
          return;
        }
      } catch (error) {
        console.error('Auth error:', error);
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4 pt-8">
        <div className="space-y-1">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="text-center text-sm text-gray-600">
            Start sharing and earning today
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
