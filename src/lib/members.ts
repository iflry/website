"use server";

import { sanityFetch } from "@/sanity/lib/fetch";
import { memberOrganisationsQuery, regionalNetworksQuery } from "@/sanity/lib/queries";

export type MemberType = "full" | "associate" | "observer" | "regional";
export type Member = {
  id: string;
  name: string;
  type: MemberType;
  country?: string;
  countryName?: string;
  primaryRegion?: string;
  secondaryRegion?: string;
  votes?: number;
  fullName?: string;
  website?: string;
  fb?: string;
  twitter?: string;
  ig?: string;
  wiki?: string;
  image_url?: string;
};

export async function getAllMembers(): Promise<Member[]> {
  const [memberOrgs, regionalNetworks] = await Promise.all([
    sanityFetch({ query: memberOrganisationsQuery }),
    sanityFetch({ query: regionalNetworksQuery }),
  ]);

  const members: Member[] = (memberOrgs || []).map((m: any) => ({
    id: m.memberId,
    name: m.name,
    type: (m.membershipType?.toLowerCase() || "full") as MemberType,
    country: m.country || undefined,
    countryName: m.countryName || undefined,
    primaryRegion: m.primaryRegion || undefined,
    secondaryRegion: m.secondaryRegion || undefined,
    votes: m.votes ?? undefined,
    website: m.website || undefined,
    fb: m.fb || undefined,
    twitter: m.twitter || undefined,
    ig: m.ig || undefined,
    wiki: m.wiki || undefined,
    image_url: m.logo || undefined,
  }));

  const regionals: Member[] = (regionalNetworks || []).map((m: any) => ({
    id: m.memberId,
    name: m.name,
    fullName: m.fullName || undefined,
    type: "regional" as MemberType,
    website: m.website || undefined,
    fb: m.fb || undefined,
    twitter: m.twitter || undefined,
    ig: m.ig || undefined,
    wiki: m.wiki || undefined,
    image_url: m.logo || undefined,
  }));

  return [...members, ...regionals];
}

export async function getMembersByType() {
  const members = await getAllMembers();
  const grouped: Record<MemberType, Member[]> = {
    regional: [],
    full: [],
    associate: [],
    observer: [],
  };

  members.forEach((member) => {
    grouped[member.type].push(member);
  });

  return grouped;
}
