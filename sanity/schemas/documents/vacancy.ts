import {EnvelopeIcon} from '@sanity/icons'
import { defineField, defineType } from "sanity";

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
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayString',
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

