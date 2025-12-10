import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "navigationItem",
  title: "Navigation Item",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "linkType",
      title: "Link Type",
      type: "string",
      options: {
        list: [
          { title: "Page", value: "page" },
          { title: "Events", value: "events" },
          { title: "Posts", value: "posts" },
          { title: "Trainers", value: "trainers" },
          { title: "Vacancies", value: "vacancies" },
          { title: "Custom URL", value: "custom" },
          { title: "Submenu", value: "submenu" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "page",
      title: "Page",
      type: "reference",
      to: [{ type: "page" }],
      hidden: ({ parent }) => parent?.linkType !== "page",
    }),
    defineField({
      name: "customUrl",
      title: "Custom URL",
      type: "url",
      hidden: ({ parent }) => parent?.linkType !== "custom",
    }),
    defineField({
      name: "children",
      title: "Submenu Items",
      type: "array",
      of: [{ type: "navigationItem" }],
      hidden: ({ parent }) => parent?.linkType !== "submenu",
    }),
  ],
  preview: {
    select: {
      title: "title",
      linkType: "linkType",
      page: "page.title",
      customUrl: "customUrl",
    },
    prepare({ title, linkType, page, customUrl }) {
      let subtitle = "";
      switch (linkType) {
        case "page":
          subtitle = page ? `Page: ${page}` : "Page";
          break;
        case "events":
          subtitle = "Events";
          break;
        case "posts":
          subtitle = "Posts";
          break;
        case "trainers":
          subtitle = "Trainers";
          break;
        case "vacancies":
          subtitle = "Vacancies";
          break;
        case "custom":
          subtitle = customUrl || "Custom URL";
          break;
        case "submenu":
          subtitle = "Submenu";
          break;
      }
      return { title, subtitle };
    },
  },
}); 