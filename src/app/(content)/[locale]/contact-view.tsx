import type { Person } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";

interface Props {
  name: string;
  picture: Exclude<Person["picture"], undefined> | null;
}

export default function ContactView({ name, picture }: Props) {
  const imageUrl = picture?.asset?._ref
    ? urlForImage(picture)?.height(800).width(600).fit("crop").url()
    : null;

  return (
    <div className="flex flex-col gap-4 text-sm/7">
      {imageUrl ? (
        <div className="aspect-3/4 w-full overflow-hidden rounded-sm outline -outline-offset-1 outline-black/5">
          <img
            src={imageUrl}
            alt={name}
            className="size-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-3/4 w-full overflow-hidden rounded-sm outline -outline-offset-1 outline-black/5 bg-gray-100 flex items-center justify-center">
          <span className="text-2xl text-gray-400">{name.charAt(0)}</span>
        </div>
      )}
      <div>
        <p className="font-semibold text-gray-900">{name}</p>
      </div>
    </div>
  );
}

