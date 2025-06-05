import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { isUniqueOtherThanLanguage } from "@/sanity/lib/utils";

export default defineType({
  name: "page",
  title: "Page",
  icon: DocumentTextIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "type",
      title: "Page type",
      type: "string",
      options: {
        list: [
          { title: "Membership Organizations", value: "members" },
          { title: "Partners", value: "partners" },
          { title: "Programmes", value: "programmes" },
          { title: "People", value: "people" },
          { title: "Other", value: "other" },
        ]
      },
      initialValue: "other",
      validation: (rule) =>
        rule.required().custom(async (value, { document, getClient }) => {
          if (!value || value === "other") return true
          const docs = await getClient({ apiVersion: "2024-03-20" }).fetch(
            'count(*[_type == "page" && type == $type && language == $language && _id != $id && _id != $draftId])',
            { 
              type: value, 
              language: document?.language, 
              id: document?._id?.replace(/^drafts\./, ""),
              draftId: `drafts.${document?._id?.replace(/^drafts\./, "")}`
            }
          )
          return docs === 0 || "This page type already exists"
        }),
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
      validation: (rule) => {
        return rule.custom((value, { document }) => {
          if (document?.type === "other") return value !== undefined || "Required"
          return true
        })
      },
      hidden: ({document}) => document?.type !== 'other'
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "createdAt",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    })
  ],
});
