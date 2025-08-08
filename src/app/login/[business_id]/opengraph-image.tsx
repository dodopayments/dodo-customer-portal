import { generateOGImageSimple } from '@/lib/og-image-simple';

export const runtime = 'edge';

export const alt = 'Login to Dodo Payments';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { business_id: string } }) {
  return await generateOGImageSimple({
    title: 'Login',
    description: 'Access your customer portal to manage payments and subscriptions',
    category: 'Authentication',
  });
}