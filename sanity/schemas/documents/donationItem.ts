import {CreditCardIcon} from '@sanity/icons'
import { defineField, defineType } from "sanity";
import programme from './programme';

export default defineType({
  name: "donationItem",
  title: "Donation Item",
  icon: CreditCardIcon,
  type: "document",
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
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "programme",
      title: "Programme",
      description: "Optionally link this donation to a specific programme.",
      type: "reference",
      to: [{ type: programme.name }],
    }),
    defineField({
      name: "amount",
      title: "Amount (€)",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "oneOffLink",
      title: "One-off Payment Link",
      description: "Stripe Payment Link for a one-time donation.",
      type: "url",
    }),
    defineField({
      name: "recurringLink",
      title: "Recurring Payment Link",
      description: "Stripe Payment Link for a monthly donation.",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      description: "Lower numbers appear first.",
      type: "number",
      initialValue: 0,
    }),
  ],
  validation: (rule) =>
    rule.custom((fields) => {
      if (!fields?.oneOffLink && !fields?.recurringLink) {
        return "At least one payment link (one-off or recurring) is required.";
      }
      return true;
    }),
  orderings: [
    {
      title: "Sort Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      amount: "amount",
      media: "image",
    },
    prepare({ title, amount, media }) {
      return {
        title: title || "Untitled",
        subtitle: amount ? `€${amount}` : undefined,
        media,
      };
    },
  },
});
