import {DocumentsIcon} from '@sanity/icons'
import { defineField, defineType } from "sanity";

export default defineType({
  name: "coreDocument",
  title: "Document",
  icon: DocumentsIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "file",
      title: "File",
      type: "file",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      description: "Lower numbers appear first.",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});
