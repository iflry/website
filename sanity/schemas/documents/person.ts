import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import memberOrganisationType from './memberOrganisation';

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
      type: "reference",
      to: [{ type: memberOrganisationType.name }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "picture",
    },
  },
});
