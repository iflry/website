import { Button } from '@/src/components/ui/button';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/src/i18n/navigation';
import { Main } from '@/src/components/elements/main';
import { Section } from '@/src/components/elements/section';
import { Heading } from '@/src/components/elements/heading';
import { Text } from '@/src/components/elements/text';

export default async function NotFound({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations('page-not-found');

  return (
    <Main>
      <Section
        className="flex flex-col items-center justify-center text-center"
        headline={
          <div className="flex flex-col items-center gap-4">
            <Heading>404</Heading>
            <Heading className="text-4xl">{t('title')}</Heading>
          </div>
        }
        subheadline={
          <Text className="max-w-md">
            {t('description')}
          </Text>
        }
        cta={
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        }
      />
    </Main>
  );
}
