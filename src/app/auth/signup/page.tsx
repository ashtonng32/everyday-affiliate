import { SignUpForm } from '@/components/auth/SignUpForm';
import { SocialLogin } from '@/components/auth/SocialLogin';

export default function SignUpPage() {
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
        <div className="mt-4">
          <SocialLogin />
        </div>
      </div>
    </div>
  );
}
