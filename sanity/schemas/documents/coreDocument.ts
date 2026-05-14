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
      description: "Upload a file, or use External URL instead.",
      type: "file",
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      description: "Link to an externally-hosted document (e.g. https://docs.iflry.com/...). Used in place of an uploaded file when set.",
      type: "url",
      validation: (rule) =>
        rule.custom((value, context) => {
          const file = (context.document as any)?.file
          if (!value && !file) return "Either a file or an external URL is required"
          return true
        }),
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
