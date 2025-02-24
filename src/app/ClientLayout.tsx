'use client';

import { Providers } from './providers';
import { Header } from '@/components/shared/Header';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='h-full'>
      <body className='h-full' suppressHydrationWarning={true}>
        <Providers>
          <div className='min-h-full flex flex-col'>
            <Header />
            <main className='flex-1 container mx-auto px-4 py-8'>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
