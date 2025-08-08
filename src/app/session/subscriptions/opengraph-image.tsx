import { generateOGImageSimple } from '@/lib/og-image-simple';

export const runtime = 'edge';

export const alt = 'Subscriptions - Dodo Payments';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return await generateOGImageSimple({
    title: 'Subscriptions',
    description: 'Manage your active subscriptions and billing preferences',
    category: 'Subscription Management',
  });
}