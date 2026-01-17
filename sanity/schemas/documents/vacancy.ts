import {EnvelopeIcon} from '@sanity/icons'
import { defineField, defineType } from "sanity";
import { isUniqueOtherThanLanguage } from "@/sanity/lib/utils";

export default defineType({
  name: "vacancy",
  title: "Vacancy",
  icon: EnvelopeIcon,
  type: "document",
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => isUniqueOtherThanLanguage(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text"
        },
      ],
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "applicationUrl",
      title: "Application URL",
      type: "url",
    }),
    defineField({
      name: "deadline",
      title: "Deadline",
      type: "date",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});

