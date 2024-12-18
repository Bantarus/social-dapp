import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { QueryProvider } from '@/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Unfoldinn',
  description: 'A decentralized social platform built on Archethic blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <QueryProvider>
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <Link 
                  href="/"
                  className="text-xl font-bold text-purple-600 dark:text-purple-400"
                >
                  Unfoldinn
                </Link>
                
                <nav className="flex items-center space-x-4">
                  <Link 
                    href="/achievements" 
                    className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
                  >
                    Achievements
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
                  >
                    About
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          {children}

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-center items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <Link href="/about" className="hover:text-purple-600 dark:hover:text-purple-400">
                  About
                </Link>
                <Link href="/terms" className="hover:text-purple-600 dark:hover:text-purple-400">
                  Terms
                </Link>
                <Link href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400">
                  Privacy
                </Link>
                <a 
                  href="https://archethic.net" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Powered by Archethic
                </a>
              </div>
            </div>
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}