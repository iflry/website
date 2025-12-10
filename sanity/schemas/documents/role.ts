import { SchemaIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import contactType from './contact';
import memberType from "./member";

const roleType = [
    { title: "Bureau Member", value: "bureau-member"},
    { title: "Ombudsperson", value: "ombudsperson" },
    { title: "Advisory Council", value: "advisory-council" },
    { title: "Regional Representative", value: "regional-representative" },
    { title: "Office", value: "office" },
    { title: "Individual Member", value: "individual-member" },
    { title: "Honorary Member", value: "honorary-member" },
]

export default defineType({
  name: "role",
  title: "Role",
  icon: SchemaIcon,
  type: "document",
  fields: [
    defineField({
        name: "type",
        title: "Type",
        type: "string",
        options: {
            list: roleType
        },
        initialValue: "bureau-member"
    }),
    defineField({
        name: 'bureauRole',
        title: 'Bureau Role',
        type: 'string',
        options: {
            list: [
                { title: "President", value: "president" },
                { title: "Secretary General", value: "secretary-general" },
                { title: "Treasurer", value: "treasurer" },
                { title: "Vice-President", value: "vice-president" },
            ],
            layout: "radio",
        },
        initialValue: "president",
        hidden: ({document}) => document?.type !== 'bureau-member'
    }),
    defineField({
        name: 'officeRole',
        title: 'Office Role',
        type: 'string',
        options: {
            list: [
                { title: "Executive Director", value: "executive-director" },
                { title: "Intern", value: "intern" },
                { title: "Project Manager", value: "project-manager" }
            ],
            layout: "radio",
        },
        initialValue: "intern",
        hidden: ({document}) => document?.type !== 'office'
    }),
    defineField({
        name: 'organization',
        title: 'Organization',
        type: 'reference',
        to: [
            { type: memberType.name }
        ],
        options: {
            filter: 'type == "regional-member"'
        },
        hidden: ({document}) => document?.type !== 'regional-representative'
    }),
    defineField({
        name: 'contact',
        title: 'Contact',
        type: 'reference',
        to: [
            {type: contactType.name}
        ],
        validation: (rule) => rule.required()
    }),
    defineField({
        name: 'title',
        title: 'Title',
        type: 'string',
        hidden: ({document}) => document?.type === 'ombudsperson'
    }),
    defineField({
        name: "email",
        title: "Email",
        type: "email",
        validation: (rule) => rule.required(),
    }),
    defineField({
        name: "start",
        title: "Start",
        type: "date",
        validation: (rule) => rule.required(),
        initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
        name: "end",
        title: "End",
        type: "date",
    })
  ],
  preview: {
    select: {
        name: 'contact.name',
        picture: 'contact.picture',
        type: 'type',
        bureauRole: 'bureauRole',
        officeRole: 'officeRole',
        title: 'title',
    },
    prepare({ name, picture, type, bureauRole, officeRole, title }) {
      let subtitle;
      if (type === 'bureau-member' && bureauRole) {
        subtitle = bureauRole;
      } else if (type === 'office' && officeRole) {
        subtitle = officeRole;
      } else {
        const roleTypeItem = roleType.find(item => item.value === type);
        subtitle = roleTypeItem ? roleTypeItem.title : String(type);
      }
      
      return {
        title: name,
        subtitle: title ? `${subtitle} (${title})` : subtitle,
        media: picture
      };
    }
  }
})