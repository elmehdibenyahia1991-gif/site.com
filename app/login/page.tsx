import { AuthForm } from '@/components/auth-form';

export default function LoginPage() {
  return <section className="container-page max-w-md"><h1 className="mb-4 text-2xl font-bold">Login</h1><AuthForm mode="login" /></section>;
}
