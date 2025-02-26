'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme/theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    setShowDevtools(process.env.NODE_ENV === 'development');
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        {showDevtools && (
          <div className='hidden'>
            <ReactQueryDevtools initialIsOpen={false} />
          </div>
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
