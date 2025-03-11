// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { TransactionNotifications } from '@/components/transaction/TransactionNotifications';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UnfoldInn',
  description: 'A decentralized social platform built on Archethic',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
          <TransactionNotifications />
        </Providers>
      </body>
    </html>
  );
}