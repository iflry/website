import { BookIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { isUniqueOtherThanLanguage } from "@/sanity/lib/utils";

export default defineType({
  name: "knowledgeArticle",
  title: "Knowledge article",
  icon: BookIcon,
  type: "document",
  fields: [
    defineField({
      name: "language",
      type: "string",
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
      name: "parent",
      title: "Parent article",
      description: "Leave empty for a top-level article. Children appear under this article in the hub.",
      type: "reference",
      to: [{ type: "knowledgeArticle" }],
      options: {
        filter: ({ document }) => ({
          filter: "language == $lang && _id != $docId",
          params: {
            lang: (document as { language?: string })?.language,
            docId: (document as { _id?: string })?._id,
          },
        }),
      },
    }),
    defineField({
      name: "private",
      title: "Private",
      description:
        "When enabled, this article is hidden from the hub, search, and navigation until a visitor enters KNOWLEDGE_PRIVATE_PASSWORD from the website server environment.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sort order",
      description: "Lower numbers appear first among siblings.",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
      parentTitle: "parent.title",
      private: "private",
    },
    prepare({ title, language, parentTitle, private: isPrivate }) {
      return {
        title: title || "Untitled",
        subtitle: [
          language && `Language: ${language}`,
          parentTitle && `Under: ${parentTitle}`,
          isPrivate ? "Private" : "",
        ]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
