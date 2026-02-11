'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LoadingOverlay from '@/components/loading-overlay';

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = params?.token as string;

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        router.replace('/expired');
        router.refresh();
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/auth/session-validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const data = await response.json();
          if (data.redirect) {
            router.replace(data.redirect);
            router.refresh();
            return;
          }
          throw new Error(data.error || 'Validation failed');
        }

        const data = await response.json();
        
        if (data.success && data.redirect) {
          router.replace(data.redirect);
          router.refresh();
        } else if (data.redirect) {
          router.replace(data.redirect);
          router.refresh();
        } else {
          setError('Validation failed. Please try again.');
        }
      } catch (err) {
        console.error('Token validation error:', err);
        setError('An error occurred. Please try again.');
        router.replace('/expired');
        router.refresh();
      } finally {
        setIsLoading(false);
      }
    }

    validateToken();
  }, [token, router]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-bg-primary flex items-center justify-center z-[100]">
        <div className="text-center">
          <p className="text-text-primary mb-4">{error}</p>
          <button
            onClick={() => {
              router.replace('/expired');
              router.refresh();
            }}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Go to Expired Page
          </button>
        </div>
      </div>
    );
  }

  return <LoadingOverlay />;
}
