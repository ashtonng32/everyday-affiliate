import { SignInForm } from '@/components/auth/SignInForm';
import { SocialLogin } from '@/components/auth/SocialLogin';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4 pt-8">
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <SignInForm />
        <div className="mt-4">
          <SocialLogin />
        </div>
      </div>
    </div>
  );
}
