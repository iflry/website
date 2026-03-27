import {CalendarIcon} from '@sanity/icons'
import { defineField, defineType } from "sanity";
import partnerType from './partner';
import programmeType from './programme';
import personType from './person';
import trainerType from './trainer';
import memberOrganisationType from './memberOrganisation';
import regionalNetworkType from './regionalNetwork';

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
          name: "person",
          title: "Person",
          type: "reference",
          to: [{ type: personType.name }],
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
        of: [{
            type: "reference",
            to: [
              { type: memberOrganisationType.name },
              { type: regionalNetworkType.name },
            ],
        }],
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
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: "trainers",
      title: "Trainers",
      type: "array",
      of: [{ type: "reference", to: [{ type: trainerType.name }] }],
    }),
    defineField({
      name: "registrationLink",
      title: "Registration Link",
      type: "url",
    }),
    defineField({
      name: "registrationDeadline",
      title: "Registration Deadline",
      type: "datetime",
    }),
    defineField({
      name: "attachments",
      title: "Attachments",
      type: "array",
      of: [{
        type: "file",
        options: { accept: "application/pdf" },
        fields: [
          {
            name: "title",
            title: "Title",
            type: "string",
          },
        ],
      }],
    }),
    defineField({
      name: "deadlines",
      title: "Deadlines",
      type: "array",
      hidden: ({ parent }) => parent?.type !== "ga",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "label",
            title: "Label",
            type: "string",
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: "date",
            title: "Date",
            type: "datetime",
            validation: (rule) => rule.required(),
          }),
        ],
        preview: {
          select: { title: "label" },
        },
      }],
    }),
    defineField({
      name: "programmeHighlights",
      title: "Programme Highlights",
      type: "array",
      hidden: ({ parent }) => parent?.type !== "ga",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "icon",
            title: "Icon",
            type: "string",
            options: {
              list: [
                { title: "Landmark (Statutory)", value: "landmark" },
                { title: "Vote (Elections)", value: "vote" },
                { title: "Mic (Speakers)", value: "mic" },
                { title: "Messages (Discussions)", value: "messages-square" },
                { title: "Map (Field Trip)", value: "map" },
                { title: "Handshake (Networking)", value: "handshake" },
                { title: "Book (Training)", value: "book-open" },
                { title: "Globe (International)", value: "globe" },
                { title: "Calendar (Scheduling)", value: "calendar" },
                { title: "Users (Group)", value: "users" },
              ],
            },
          }),
          defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: "description",
            title: "Description",
            type: "text",
            validation: (rule) => rule.required(),
          }),
        ],
        preview: {
          select: { title: "title" },
        },
      }],
    }),
    defineField({
      name: "preSessions",
      title: "Pre-Sessions",
      type: "array",
      hidden: ({ parent }) => parent?.type !== "ga",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: "description",
            title: "Description",
            type: "text",
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: "date",
            title: "Date",
            type: "datetime",
            validation: (rule) => rule.required(),
          }),
        ],
        preview: {
          select: { title: "title" },
        },
      }],
    }),
    defineField({
      name: "visaNote",
      title: "Visa Note",
      type: "text",
      hidden: ({ parent }) => parent?.type !== "ga",
    }),
    defineField({
      name: "additionalContacts",
      title: "Additional Contacts",
      type: "array",
      hidden: ({ parent }) => parent?.type !== "ga",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "person",
            title: "Person",
            type: "reference",
            to: [{ type: personType.name }],
          }),
          defineField({
            name: "email",
            title: "Email",
            type: "email",
          }),
          defineField({
            name: "role",
            title: "Role",
            type: "string",
          }),
        ],
        preview: {
          select: { title: "role" },
        },
      }],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
