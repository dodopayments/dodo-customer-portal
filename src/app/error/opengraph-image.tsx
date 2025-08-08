import { generateOGImageSimple } from '@/lib/og-image-simple';

export const runtime = 'edge';

export const alt = 'Error - Dodo Payments';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return await generateOGImageSimple({
    title: 'Something went wrong',
    description: 'An error occurred. Please try again or contact support.',
    category: 'Error',
  });
}