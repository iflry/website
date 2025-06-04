import type { Person } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  name: string;
  picture: Exclude<Person["picture"], undefined> | null;
}

export default function PersonView({ name, picture }: Props) {
  return (
    <div className="flex items-center text-xl">
      {picture?.asset?._ref && (
        <div className="mr-4 h-12 w-12">
          <Avatar>
            <AvatarImage src={urlForImage(picture)
                ?.height(96)
                .width(96)
                .fit("crop")
                .url() as string} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      )}
      <div className="text-pretty text-xl font-bold">{name}</div>
    </div>
  );
}
