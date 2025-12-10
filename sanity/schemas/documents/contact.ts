import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import memberType from "./member";

export default defineType({
  name: "contact",
  title: "Contact",
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
      type: "reference",
      to: [{ type: memberType.name }],
      options: {
        filter: 'type != "regional-member"'
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

