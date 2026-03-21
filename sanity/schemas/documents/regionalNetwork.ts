import { EarthGlobeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "regionalNetwork",
  title: "Regional Network",
  icon: EarthGlobeIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Short Name",
      description: "e.g. LYMEC",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fullName",
      title: "Full Name",
      description: "e.g. European Liberal Youth",
      type: "string",
    }),
    defineField({
      name: "memberId",
      title: "Member ID",
      description: "Identifier e.g. LYMEC",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "wiki",
      title: "Wiki Page",
      type: "string",
    }),
    defineField({
      name: "fb",
      title: "Facebook",
      description: "Facebook handle or page path",
      type: "string",
    }),
    defineField({
      name: "twitter",
      title: "Twitter / X",
      description: "Twitter handle",
      type: "string",
    }),
    defineField({
      name: "ig",
      title: "Instagram",
      description: "Instagram handle",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "fullName",
      media: "logo",
    },
  },
});
