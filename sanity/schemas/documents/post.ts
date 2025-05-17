import { BlockContentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import personType from "./person";
import { isUniqueOtherThanLanguage } from "@/sanity/lib/utils";


export default defineType({
  name: "post",
  title: "Post",
  icon: BlockContentIcon,
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
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Statement", value: "statement" },
          { title: "Press Release", value: "press-release" },
          { title: "Bureau Update", value: "bureau-update" },
        ],
        layout: "radio",
      },
      initialValue: "statement",
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
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: personType.name }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      person: "person.name",
      date: "date",
      media: "image",
    },
    prepare({ title, media, person, date }) {
      const subtitles = [
        person && `by ${person}`,
        date && `on ${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      ].filter(Boolean);

      return { title, media, subtitle: subtitles.join(" ") };
    },
  },
});
