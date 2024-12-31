import './globals.css';
import type { Metadata } from 'next';
import { AccountProvider } from '@/app/_context/AccountContext';

export const metadata: Metadata = {
  title: 'Internship Practice',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccountProvider>
    <html lang="ja">
      <body className={`w-full flex flex-col`}>
        <div>{children}</div>
      </body>
    </html>
    </AccountProvider>
  );
}
