import { generateOGImageSimple } from '@/lib/og-image-simple';

export const runtime = 'edge';

export const alt = 'Session Expired - Dodo Payments';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return await generateOGImageSimple({
    title: 'Session Expired',
    description: 'Your session has expired. Please log in again to continue.',
    category: 'Authentication',
  });
}