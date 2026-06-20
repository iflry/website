import { EarthGlobeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "bureauRegion",
  title: "Bureau Region",
  icon: EarthGlobeIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: "e.g. Africa, SWANA, Eastern Europe & Caucasus",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      description: "Lower numbers appear first. Leave empty to fall back to alphabetical.",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "sortOrder",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle !== undefined && subtitle !== null ? `#${subtitle}` : undefined,
      };
    },
  },
});
