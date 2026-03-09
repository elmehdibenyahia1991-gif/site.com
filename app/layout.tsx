import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'TrustMarket - Affordable Digital Products',
  description: 'Sell and buy digital products with trust-first policies.'
};

const nav = [
  ['Marketplace', '/marketplace'],
  ['Seller Dashboard', '/dashboard/seller'],
  ['Admin', '/admin'],
  ['FAQ', '/faq'],
  ['Contact', '/contact']
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="container-page flex items-center justify-between py-4">
            <Link href="/" className="text-xl font-bold text-brand">TrustMarket</Link>
            <nav className="flex gap-4 text-sm">
              {nav.map(([name, href]) => (
                <Link key={href} href={href} className="hover:text-brand">{name}</Link>
              ))}
              <Link href="/login" className="rounded bg-brand px-3 py-1.5 text-white">Login</Link>
              <Link href="/api/auth/logout" className="rounded border px-3 py-1.5">Logout</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
