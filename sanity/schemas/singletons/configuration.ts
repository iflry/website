import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";


export default defineType({
  name: "configuration",
  title: "Configuration",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      //readOnly: true,
      //hidden: true
    }),
    defineField({
      name: "description",
      description:
        "Used both for the <meta> description tag for SEO, and the blog subheader.",
      title: "Description",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              defineField({
                type: "object",
                name: "link",
                fields: [
                  {
                    type: "string",
                    name: "href",
                    title: "URL",
                    validation: (rule) => rule.required(),
                  },
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "navigation",
      title: "Main Navigation",
      type: "array",
      of: [{ type: "navigationItem" }],
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      description: "Displayed on social cards and search engine results.",
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.ogImage as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            });
          },
        }),
        defineField({
          name: "metadataBase",
          type: "url",
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Configuration",
      };
    },
  },
});
