import {CaseIcon} from '@sanity/icons'
import { defineField, defineType } from "sanity";

export default defineType({
  name: "partner",
  title: "Partner",
  icon: CaseIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'biography',
      title: 'Biography',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: "displayAsPartner",
      title: "Include under Our Partners",
      description: "If enabled, this partner will be listed on the Partners page. Otherwise they only appear on individual events.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "logo",
    },
  },
});
