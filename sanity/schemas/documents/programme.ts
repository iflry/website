import {ThLargeIcon} from '@sanity/icons'
import { defineField, defineType } from "sanity";
import contactType from './contact';
export default defineType({
  name: "programme",
  title: "Programme",
  icon: ThLargeIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
        name: "managers",
        title: "Managers",
        type: "array",
        of: [{ type: "reference", to: [{ type: contactType.name }] }],
        validation: (rule) => rule.required(),
    }),
    defineField({
        name: "email",
        title: "Email",
        type: "email",
        validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayString',
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
