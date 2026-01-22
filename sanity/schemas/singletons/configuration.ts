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
      readOnly: true,
      hidden: true
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
    defineField({
      name: "announcementBanner",
      title: "Announcement Banner",
      description: "Optional banner displayed on the home page hero section",
      type: "object",
      fields: [
        defineField({
          name: "enabled",
          title: "Enable Banner",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "text",
          title: "Banner Text",
          type: "string",
        }),
        defineField({
          name: "cta",
          title: "Call to Action Text",
          type: "string",
          initialValue: "Learn more",
        }),
        defineField({
          name: "href",
          title: "Link URL",
          type: "url",
        }),
      ],
    }),
    defineField({
      name: "footer",
      title: "Footer Configuration",
      type: "object",
      fields: [
        defineField({
          name: "fineprint",
          title: "Copyright Text",
          type: "string",
          initialValue: "© 2026 International Federation of Liberal Youth",
        }),
        defineField({
          name: "columns",
          title: "Footer Columns",
          description: "Create multiple columns of links in the footer",
          type: "array",
          of: [
            defineField({
              type: "object",
              name: "footerColumn",
              fields: [
                defineField({
                  name: "title",
                  title: "Column Title",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "links",
                  title: "Links",
                  type: "array",
                  of: [
                    defineField({
                      type: "object",
                      name: "footerLink",
                      fields: [
                        defineField({
                          name: "title",
                          title: "Link Title",
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
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "socialLinks",
          title: "Social Media Links",
          type: "array",
          of: [
            defineField({
              type: "object",
              name: "socialLink",
              fields: [
                defineField({
                  name: "platform",
                  title: "Platform",
                  type: "string",
                  options: {
                    list: [
                      { title: "X (Twitter)", value: "x" },
                      { title: "Instagram", value: "instagram" },
                      { title: "Facebook", value: "facebook" },
                    ],
                  },
                }),
                defineField({
                  name: "url",
                  title: "URL",
                  type: "url",
                }),
              ],
            }),
          ],
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
