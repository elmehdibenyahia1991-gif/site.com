import { AuthForm } from '@/components/auth-form';

export default function SignupPage() {
  return <section className="container-page max-w-md"><h1 className="mb-4 text-2xl font-bold">Sign up</h1><AuthForm mode="signup" /></section>;
}
