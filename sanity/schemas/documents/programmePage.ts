import {DocumentTextIcon} from '@sanity/icons'
import { defineField, defineType } from "sanity";
import programmeType from './programme';
import { isUniqueOtherThanLanguage } from "@/sanity/lib/utils";

export default defineType({
  name: "programmePage",
  title: "Page (Programme)",
  icon: DocumentTextIcon,
  type: "document",
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "programme",
      title: "Programme",
      type: "reference",
      to: [{ type: programmeType.name }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: async (doc: any, { getClient }) => {
          if (doc?.programme?._ref) {
            const client = getClient({ apiVersion: "2024-03-20" });
            const programme = await client.fetch(
              `*[_id == $id][0].title`,
              { id: doc.programme._ref }
            );
            return programme || "untitled";
          }
          return "untitled";
        },
        maxLength: 96,
        isUnique: (value, context) => isUniqueOtherThanLanguage(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: {
      title: "programme.title",
      language: "language",
    },
    prepare({ title, language }) {
      return {
        title: title || "Untitled",
        subtitle: language ? `Language: ${language}` : undefined,
      };
    },
  },
});
