"use server";

import membershipData from "@/src/data/membership.json";
import regionalData from "@/src/data/regional.json";
import { existsSync } from "fs";
import { join } from "path";
import { sanityFetch } from "@/sanity/lib/fetch";
import { membersQuery } from "@/sanity/lib/queries";

export type MemberType = "full" | "associate" | "observer" | "regional";
export type Member = {
  id: string;
  name: string;
  type: MemberType;
  country?: string;
  website?: string;
  fb?: string;
  twitter?: string;
  ig?: string;
  wiki?: string;
  image_url?: string;
};

function findImagePath(memberId: string): string | undefined {
  const extensions = ['.png', '.jpeg', '.jpg', '.webp'];
  const publicDir = join(process.cwd(), 'public', 'members');
  
  for (const ext of extensions) {
    const imagePath = join(publicDir, `${memberId}${ext}`);
    if (existsSync(imagePath)) {
      return `/members/${memberId}${ext}`;
    }
  }
}

async function getSanityOverrides(): Promise<Map<string, Partial<Member>>> {
  const sanityMembers = await sanityFetch({ query: membersQuery });
    const overrides = new Map<string, Partial<Member>>();
    
    if (sanityMembers && Array.isArray(sanityMembers)) {
      sanityMembers.forEach((sanityMember) => {
        const override: Partial<Member> = {};
        if (sanityMember.logo) override.image_url = sanityMember.logo;
        if (sanityMember.website) override.website = sanityMember.website;
        if (sanityMember.wiki) override.wiki = sanityMember.wiki;
        if (sanityMember.fb !== undefined) override.fb = sanityMember.fb || undefined;
        if (sanityMember.twitter !== undefined) override.twitter = sanityMember.twitter || undefined;
        if (sanityMember.ig !== undefined) override.ig = sanityMember.ig || undefined;
        
        if (sanityMember.memberId) {
          overrides.set(sanityMember.memberId, override);
        }
      });
    }
    
    return overrides;
}

function normalizeMembershipData(overrides: Map<string, Partial<Member>>) {
  return membershipData.map((member) => {
    const override = overrides.get(member.id) || {};
    return {
      id: member.id,
      name: override.name || member.name,
      country: member.country,
      type: member.type as MemberType,
      website: override.website || member.website,
      fb: override.fb !== undefined ? override.fb : member.fb,
      twitter: override.twitter !== undefined ? override.twitter : member.twitter,
      ig: override.ig !== undefined ? override.ig : member.ig,
      wiki: override.wiki,
      image_url: override.image_url || findImagePath(member.id)
    };
  });
}

function normalizeRegionalData(overrides: Map<string, Partial<Member>>) {
  return regionalData.map((member) => {
    const override = overrides.get(member.id) || {};
    return {
      id: member.id,
      name: override.name || member.name,
      type: "regional" as MemberType,
      website: override.website || member.website,
      fb: override.fb !== undefined ? override.fb : member.fb,
      twitter: override.twitter !== undefined ? override.twitter : member.twitter,
      ig: override.ig !== undefined ? override.ig : member.ig,
      wiki: override.wiki || member.wiki,
      image_url: override.image_url,
    };
  });
}

export async function getAllMembers() {
  const overrides = await getSanityOverrides();
  const membership = normalizeMembershipData(overrides);
  const regional = normalizeRegionalData(overrides);
  return [...membership, ...regional];
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


