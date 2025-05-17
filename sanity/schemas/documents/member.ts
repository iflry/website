import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "member",
  title: "Member",
  icon: UsersIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
        name: "type",
        title: "Type",
        type: "string",
        options: {
            list: [
                { title: "Full Member", value: "full-member" },
                { title: "Associate Member", value: "associate-member" },
                { title: "Observer Member", value: "observer-member" },
                { title: "Regional Member", value: "regional-member" },
            ],
        },
        validation: (rule) => rule.required(),
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "logo",
    },
  },
});
