import { generateOGImageSimple } from '@/lib/og-image-simple';

export const runtime = 'edge';

export const alt = 'Profile - Dodo Payments';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return await generateOGImageSimple({
    title: 'Profile',
    description: 'Update your personal and billing information',
    category: 'Account Settings',
  });
}