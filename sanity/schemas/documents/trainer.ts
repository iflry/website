import {PresentationIcon} from '@sanity/icons'
import { defineField, defineType } from "sanity";
import personType from './person';

export default defineType({
  name: "trainer",
  title: "Trainer",
  icon: PresentationIcon,
  type: "document",
  fields: [
    defineField({
      name: "person",
      title: "Person",
      type: "reference",
      to: [{ type: personType.name }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "email",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "expertises",
      title: "Expertises",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "languages",
      title: "Languages",
      type: "array",
      of: [{
        type: "string",
        options: {
          list: [
            { title: "English", value: "en" },
            { title: "French", value: "fr" },
            { title: "Spanish", value: "es" },
            { title: "German", value: "de" },
            { title: "Dutch", value: "nl" },
            { title: "Italian", value: "it" },
            { title: "Portuguese", value: "pt" },
            { title: "Russian", value: "ru" },
            { title: "Arabic", value: "ar" },
            { title: "Chinese", value: "zh" },
            { title: "Japanese", value: "ja" },
          ],
        },
      }],
    }),
  ],
  preview: {
    select: {
      name: "person.name",
      picture: "person.picture",
    },
    prepare({ name, picture }) {
      return {
        title: name || "Untitled Trainer",
        media: picture,
      };
    },
  },
});

