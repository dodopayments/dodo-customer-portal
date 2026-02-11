'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LoadingOverlay from '@/components/loading-overlay';

export default function Page() {
  const params = useParams();
  const [error, setError] = useState<string | null>(null);
  const token = params?.token as string;

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        window.location.replace('/expired');
        return;
      }

      try {
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
            window.location.replace(data.redirect);
            return;
          }
          throw new Error(data.error || 'Validation failed');
        }

        const data = await response.json();

        if (data.redirect) {
          window.location.replace(data.redirect);
        } else {
          setError('Validation failed. Please try again.');
        }
      } catch (err) {
        console.error('Token validation error:', err);
        window.location.replace('/expired');
      }
    }

    validateToken();
  }, [token]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-bg-primary flex items-center justify-center z-[100]">
        <div className="text-center">
          <p className="text-text-primary mb-4">{error}</p>
          <button
            onClick={() => window.location.replace('/expired')}
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
