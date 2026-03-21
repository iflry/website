import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "memberOrganisation",
  title: "Member Organisation",
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
      name: "memberId",
      title: "Member ID",
      description: "Unique identifier e.g. DEU-JULIS",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country Code",
      description: "ISO 3166-1 alpha-3 code e.g. DEU",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "countryName",
      title: "Country Name",
      type: "string",
    }),
    defineField({
      name: "membershipType",
      title: "Membership Type",
      type: "string",
      options: {
        list: [
          { title: "Full", value: "full" },
          { title: "Associate", value: "associate" },
          { title: "Observer", value: "observer" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "primaryRegion",
      title: "Primary Region",
      type: "string",
      options: {
        list: [
          { title: "Western Europe", value: "Western Europe" },
          { title: "Eastern Europe", value: "Eastern Europe" },
          { title: "Africa", value: "Africa" },
          { title: "Asia-Pacific", value: "Asia-Pacific" },
          { title: "Latin America", value: "Latin America" },
          { title: "MENA", value: "MENA" },
          { title: "North America and Israel", value: "North America and Israel" },
          { title: "Caucasus", value: "Caucasus" },
        ],
      },
    }),
    defineField({
      name: "secondaryRegion",
      title: "Secondary Region",
      type: "string",
      options: {
        list: [
          { title: "Western Europe", value: "Western Europe" },
          { title: "Eastern Europe", value: "Eastern Europe" },
          { title: "Africa", value: "Africa" },
          { title: "Asia-Pacific", value: "Asia-Pacific" },
          { title: "Latin America", value: "Latin America" },
          { title: "MENA", value: "MENA" },
          { title: "North America and Israel", value: "North America and Israel" },
          { title: "Caucasus", value: "Caucasus" },
        ],
      },
    }),
    defineField({
      name: "votes",
      title: "Votes",
      type: "number",
      initialValue: 0,
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
  orderings: [
    {
      title: "Name",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Country",
      name: "countryAsc",
      by: [{ field: "countryName", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "countryName",
      media: "logo",
    },
  },
});
