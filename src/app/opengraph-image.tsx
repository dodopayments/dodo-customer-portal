import { generateOGImageSimple } from '@/lib/og-image-simple';

export const runtime = 'edge';

export const alt = 'Dodo Payments Customer Portal';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return await generateOGImageSimple({
    title: 'Customer Portal',
    description: 'Manage your payments, subscriptions, and licenses in one place',
    category: 'Dodo Payments',
  });
}