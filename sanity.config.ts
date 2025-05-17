"use client";

import React from 'react';
import { visionTool } from "@sanity/vision";
import { PluginOptions, defineConfig, defineField } from "sanity";
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from "sanity/presentation";
import { StructureResolver, structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { singletonPlugin } from "@/sanity/plugins/settings";
import person from "@/sanity/schemas/documents/person";
import post from "@/sanity/schemas/documents/post";
import settings from "@/sanity/schemas/singletons/settings";
import { resolveHref } from "@/sanity/lib/utils";
import {documentInternationalization} from '@sanity/document-internationalization'
import {internationalizedArray} from 'sanity-plugin-internationalized-array';
import partner from '@/sanity/schemas/documents/partner';
import event from '@/sanity/schemas/documents/event';
import programme from './sanity/schemas/documents/programme';
import role from './sanity/schemas/documents/role';
import member from './sanity/schemas/documents/member';
import page from './sanity/schemas/documents/page';
import { EarthGlobeIcon } from '@sanity/icons';


const LANGUAGES = [
  {id: 'en', title: 'English', icon: "🇬🇧" },
  {id: 'fr', title: 'French', icon: "🇫🇷"},
  {id: 'es', title: 'Spanish', icon: "🇪🇸"},
] 

const SINGLETON_SCHEMA_TYPES = [settings]
const LOCALIZED_SCHEMA_TYPES = [post, event, page]
const DEFAULT_SCHEMA_TYPES = [person, partner, member, programme, role]

const structure: StructureResolver = (S) => {
  const singletonItems = SINGLETON_SCHEMA_TYPES
    .map((typeDef) => {
      return S.listItem()
        .title(typeDef.title!)
        .icon(typeDef.icon)
        .child(
          S.editor()
            .id(typeDef.name)
            .schemaType(typeDef.name)
            .documentId(typeDef.name)
        )
    })

  // Create language-specific list items for localized content types
  const localizedItems = LOCALIZED_SCHEMA_TYPES.map(schemaType => {    
    return S.listItem()
      .title(schemaType.title!)
      .icon(schemaType.icon)
      .child(
        S.list()
          .title(schemaType.title!)
          .items([
            ...LANGUAGES.map(language => 
              S.listItem()
                .title(language.title)
                .icon(() => React.createElement('span', null, language.icon))
                .child(
                  S.documentTypeList(schemaType.name)
                    .title(`${schemaType.title} (${language.title})`)
                    .filter('_type == $type && language == $language')
                    .params({ type: schemaType.name, language: language.id })
                    .initialValueTemplates([
                      S.initialValueTemplateItem(`${schemaType.name}-${language.id}`)
                    ])
                )
            ),
            S.divider(),
            S.listItem()
              .title('All languages')
              .icon(EarthGlobeIcon)
              .child(
                S.documentTypeList(schemaType.name)
                  .title(`All ${schemaType.title}`)
                  .initialValueTemplates([])
              ),
          ])
      )
  })

  const defaultListItems = DEFAULT_SCHEMA_TYPES.map(schemaType => {
    return S.listItem()
      .title(schemaType.title!)
      .icon(schemaType.icon)
      .child(S.documentTypeList(schemaType.name))
  })

  return S.list()
    .title("Content")
    .items([...singletonItems, S.divider(), ...localizedItems, S.divider(), ...defaultListItems])
}

export default defineConfig({
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: [
      ...SINGLETON_SCHEMA_TYPES,
      ...LOCALIZED_SCHEMA_TYPES,
      ...DEFAULT_SCHEMA_TYPES,
    ],
  },
  plugins: [
    documentInternationalization({
      supportedLanguages: LANGUAGES,
      schemaTypes: LOCALIZED_SCHEMA_TYPES.map(schemaType => schemaType.name),
    }),
    internationalizedArray({
      languages: LANGUAGES,
      defaultLanguages: ['en'],
      fieldTypes: ['string'],
    }),
    presentationTool({
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: "/posts/:slug",
            filter: `_type == "post" && slug.current == $slug`,
          },
        ]),
        locations: {
          settings: defineLocations({
            locations: [{
              title: "Home",
              href: "/",
            }],
            message: "This document is used on all pages"
          }),
          post: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
              language: "language",
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title,
                  href: resolveHref("post", doc?.language, doc?.slug)!,
                },
                {
                  title: "Posts",
                  href: `/${doc?.language}/posts/`
                },
                {
                  title: "Home",
                  href: `/${doc?.language}/`
                },
              ],
            }),
          }),
          page: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
              type: "type",
              language: "language",
            },
            resolve: (doc) => {
              if (doc?.type === "programmes") return {
                locations: [
                  {
                    title: doc?.title,
                    href: `/${doc?.language}/programmes`
                  },
                ],
              }
              else if (doc?.type === "partners") return {
                locations: [
                  {
                    title: doc?.title,
                    href: `/${doc?.language}/partners`
                  },
                ],
              }
              else if (doc?.type === "members") return {
                locations: [
                  {
                    title: doc?.title,
                    href: `/${doc?.language}/members`
                  },
                ],
              }
              else {
                return {
                  locations: [
                    {
                      title: doc?.title,
                      href: resolveHref("page", doc?.language, doc?.slug)!,
                    },
                  ],
                }
              }
            } 
          }),
          event: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
              language: "language",
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title,
                  href: resolveHref("event", doc?.language, doc?.slug)!,
                },
              ],
            }),
          }),
          programme: defineLocations({
            select: {},
            resolve: (doc) => ({
              locations: [
                {
                  title: "Programmes",
                  href: "/programmes"
                },
              ],
            }),
          }),
          partner: defineLocations({
            select: {},
            resolve: (doc) => ({
              locations: [
                {
                  title: "Partners",
                  href: "/partners"
                },
              ],
            }),
          }),
          member: defineLocations({
            select: {},
            resolve: (doc) => ({
              locations: [
                {
                  title: "Members",
                  href: "/members"
                },
              ],
            }),
          }),
          role: defineLocations({
            select: {},
            resolve: (doc) => ({
              locations: [
                {
                  title: "People",
                  href: "/people"
                },
              ],
            }),
          }),
        },
      },
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
    }),
    structureTool({ structure }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([settings.name]),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    process.env.NODE_ENV === "development" &&
      visionTool({ defaultApiVersion: apiVersion }),
  ].filter(Boolean) as PluginOptions[],
});
