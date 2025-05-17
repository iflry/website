import {CalendarIcon} from '@sanity/icons'
import { defineField, defineType } from "sanity";
import partnerType from './partner';
import programmeType from './programme';
import memberType from './member';

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
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
