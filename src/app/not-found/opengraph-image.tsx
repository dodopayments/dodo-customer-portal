import { generateOGImageSimple } from '@/lib/og-image-simple';

export const runtime = 'edge';

export const alt = 'Page Not Found - Dodo Payments';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return await generateOGImageSimple({
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
    category: '404 Error',
  });
}