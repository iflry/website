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

const homeLocation = {
  title: "Home",
  href: "/",
} satisfies DocumentLocation;

const LANGUAGES = [
  {id: 'en', title: 'English', icon: "🇬🇧" },
  {id: 'fr', title: 'French', icon: "🇫🇷"},
  {id: 'es', title: 'Spanish', icon: "🇪🇸"},
] 

const SINGLETON_SCHEMA_TYPES = [settings]
const LOCALIZED_SCHEMA_TYPES = [post]
const DEFAULT_SCHEMA_TYPES = [person, partner]

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
                )
            ),
            S.divider(),
            S.listItem()
              .title('All languages')
              .child(
                S.documentTypeList(schemaType.name)
                  .title(`All ${schemaType.title}`)
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
      schemaTypes: ['post'],
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
            locations: [homeLocation],
            message: "This document is used on all pages",
            tone: "caution",
          }),
          post: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "Untitled",
                  href: resolveHref("post", doc?.slug)!,
                },
                homeLocation,
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
