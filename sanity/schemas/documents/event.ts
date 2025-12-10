import {CalendarIcon} from '@sanity/icons'
import { defineField, defineType } from "sanity";
import partnerType from './partner';
import programmeType from './programme';
import memberType from './member';
import contactType from './contact';
import trainerType from './trainer';

export default defineType({
  name: "event",
  title: "Event",
  icon: CalendarIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactPerson",
      title: "Contact Person",
      type: "object",
      fields: [
        defineField({
          name: "contact",
          title: "Contact",
          type: "reference",
          to: [{ type: contactType.name }],
        }),
        defineField({
          name: "email",
          title: "Email",
          type: "email",
        }),
      ],
    }),
    defineField({
        name: "type",
        title: "Type",
        type: "string",
        options: {
          list: [
            { title: "General Assembly", value: "ga" },
            { title: "Seminar", value: "seminar" },
            { title: "Workshop", value: "workshop" },
          ],
          layout: "radio",
        },
        initialValue: "seminar",
        validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
        name: "location",
        title: "Location",
        type: "string",
        validation: (rule) => rule.required(),
    }),
    defineField({
      name: "start",
      title: "Start",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "end",
      title: "End",
      type: "datetime"
    }),
    defineField({
        name: 'language',
        type: 'string',
        readOnly: true,
        hidden: true,
    }),
    defineField({
        name: "programme",
        title: "Programme",
        type: "reference",
        to: [{type: programmeType.name}],
    }),
    defineField({
        name: "members",
        title: "Members",
        type: "array",
        of: [{type: "reference", to: [{type: memberType.name}]}],
    }),
    defineField({
        name: "partners",
        title: "Partners",
        type: "array",
        of: [{type: "reference", to: [{type: partnerType.name}]}],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: "trainers",
      title: "Trainers",
      type: "array",
      of: [{ type: "reference", to: [{ type: trainerType.name }] }],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
