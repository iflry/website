import { Container } from "@/src/components/elements/container";
import { Text } from "@/src/components/elements/text";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { Link } from "@/src/i18n/navigation";

export type NotFoundViewProps = {
  title: string;
  description: string;
  home: string;
};

export function NotFoundView({ title, description, home }: NotFoundViewProps) {
  return (
    <div
      className={cn(
        "isolate flex flex-1 flex-col overflow-clip",
        "text-gray-900",
      )}
    >
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-10">
        <Container className="flex max-w-lg flex-col items-center gap-8 text-center">
          <p
            className="font-display text-7xl font-medium tracking-tight sm:text-8xl"
            aria-hidden="true"
          >
            404
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-3xl font-medium tracking-[-0.03em] text-pretty sm:text-4xl">
              {title}
            </h1>
            <Text className="text-pretty text-gray-600">{description}</Text>
          </div>
          <Button asChild variant="outline">
            <Link href="/">{home}</Link>
          </Button>
        </Container>
      </section>
    </div>
  );
}
