import { buttonVariants } from '@/src/components/ui/button';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations('page-not-found');

  return (
    <div className="container mx-auto px-5">
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-4xl font-bold text-gray-700 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            {t('description')}
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className={buttonVariants({ variant: "outline" })}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
