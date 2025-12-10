import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import membershipData from "@/src/data/membership.json";

export default defineType({
  name: "person",
  title: "Person",
  icon: UserIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'biography',
      title: 'Biography',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: "picture",
      title: "Picture",
      type: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "organization",
      title: "Organization",
      type: "string",
      options: {
        list: membershipData.map((member) => ({
          title: member.name,
          value: member.id,
        })),
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "picture",
    },
  },
});
