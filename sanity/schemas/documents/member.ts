import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import membershipData from "@/src/data/membership.json";
import regionalData from "@/src/data/regional.json";

export default defineType({
  name: "member",
  title: "Member",
  icon: UsersIcon,
  type: "document",
  fields: [
    defineField({
      name: "memberId",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
      options: {
        list: [
          ...membershipData.map((m) => ({ title: m.name, value: m.id })),
          ...regionalData.map((m) => ({ title: m.name, value: m.id })),
        ],
      },
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
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
      description: "Facebook handle",
      type: "string",
    }),
    defineField({
      name: "twitter",
      title: "Twitter",
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
      memberId: "memberId",
      name: "name",
      logo: "logo",
    },
    prepare({ memberId, name, logo }) {
      const allMembers = [...membershipData, ...regionalData];
      const originalMember = allMembers.find((m) => m.id === memberId);
      const displayName = name || originalMember?.name || memberId;

      return {
        title: displayName,
        subtitle: memberId,
        media: logo,
      };
    },
  },
});
