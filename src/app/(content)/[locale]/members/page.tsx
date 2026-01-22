import PortableText from "@/src/components/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";
import { getMembersByType, Member } from "@/src/lib/members";
import Link from "next/link";
import { Main } from "@/src/components/elements/main";
import { Section } from "@/src/components/elements/section";
import { Heading } from "@/src/components/elements/heading";
import { Subheading } from "@/src/components/elements/subheading";
import { Document } from "@/src/components/elements/document";

function MemberLogo({ member }: { member: Member }) {
  const hasSocials = member.website || member.fb || member.twitter || member.ig || member.wiki;
  
  const getSocialUrl = (platform: 'fb' | 'twitter' | 'ig', handle?: string) => {
    if (!handle) return null;
    switch (platform) {
      case 'fb':
        return `https://facebook.com/${handle}`;
      case 'twitter':
        return `https://twitter.com/${handle}`;
      case 'ig':
        return `https://instagram.com/${handle}`;
    }
  };

  const getWikiUrl = (wiki?: string) => {
    if (!wiki) return null;
    return `https://wiki.iflry.com/doku.php?id=public:mos:${wiki}`;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="group relative w-full aspect-3/4">
        <div className="flex items-center justify-center w-full h-full p-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
          {member.image_url ? ( <img 
            src={member.image_url} 
            alt={member.name} 
            className="object-contain max-h-full max-w-full" 
          />) : (
            <div className="flex items-center justify-center h-full w-full text-gray-400 text-xs">
              No image
            </div>
          )}
        </div>
        
        {hasSocials && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-lg backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-1.5">
              {member.website && (
                <Link
                  href={member.website.startsWith('http') ? member.website : `https://${member.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
                  title="Website"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </Link>
              )}
              {member.wiki && (
                <Link
                  href={getWikiUrl(member.wiki) || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
                  title="Wiki"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 128 128">
                  <path fillRule="evenodd" strokeMiterlimit="10" d="M 120.85,29.21 C 120.85,29.62 120.72,29.99 120.47,30.33 C 120.21,30.66 119.94,30.83 119.63,30.83 C 117.14,31.07 115.09,31.87 113.51,33.24 C 111.92,34.6 110.29,37.21 108.6,41.05 L 82.8,99.19 C 82.63,99.73 82.16,100 81.38,100 C 80.77,100 80.3,99.73 79.96,99.19 L 65.49,68.93 L 48.85,99.19 C 48.51,99.73 48.04,100 47.43,100 C 46.69,100 46.2,99.73 45.96,99.19 L 20.61,41.05 C 19.03,37.44 17.36,34.92 15.6,33.49 C 13.85,32.06 11.4,31.17 8.27,30.83 C 8,30.83 7.74,30.69 7.51,30.4 C 7.27,30.12 7.15,29.79 7.15,29.42 C 7.15,28.47 7.42,28 7.96,28 C 10.22,28 12.58,28.1 15.05,28.3 C 17.34,28.51 19.5,28.61 21.52,28.61 C 23.58,28.61 26.01,28.51 28.81,28.3 C 31.74,28.1 34.34,28 36.6,28 C 37.14,28 37.41,28.47 37.41,29.42 C 37.41,30.36 37.24,30.83 36.91,30.83 C 34.65,31 32.87,31.58 31.57,32.55 C 30.27,33.53 29.62,34.81 29.62,36.4 C 29.62,37.21 29.89,38.22 30.43,39.43 L 51.38,86.74 L 63.27,64.28 L 52.19,41.05 C 50.2,36.91 48.56,34.23 47.28,33.03 C 46,31.84 44.06,31.1 41.46,30.83 C 41.22,30.83 41,30.69 40.78,30.4 C 40.56,30.12 40.45,29.79 40.45,29.42 C 40.45,28.47 40.68,28 41.16,28 C 43.42,28 45.49,28.1 47.38,28.3 C 49.2,28.51 51.14,28.61 53.2,28.61 C 55.22,28.61 57.36,28.51 59.62,28.3 C 61.95,28.1 64.24,28 66.5,28 C 67.04,28 67.31,28.47 67.31,29.42 C 67.31,30.36 67.15,30.83 66.81,30.83 C 62.29,31.14 60.03,32.42 60.03,34.68 C 60.03,35.69 60.55,37.26 61.6,39.38 L 68.93,54.26 L 76.22,40.65 C 77.23,38.73 77.74,37.11 77.74,35.79 C 77.74,32.69 75.48,31.04 70.96,30.83 C 70.55,30.83 70.35,30.36 70.35,29.42 C 70.35,29.08 70.45,28.76 70.65,28.46 C 70.86,28.15 71.06,28 71.26,28 C 72.88,28 74.87,28.1 77.23,28.3 C 79.49,28.51 81.35,28.61 82.8,28.61 C 83.84,28.61 85.38,28.52 87.4,28.35 C 89.96,28.12 92.11,28 93.83,28 C 94.23,28 94.43,28.4 94.43,29.21 C 94.43,30.29 94.06,30.83 93.32,30.83 C 90.69,31.1 88.57,31.83 86.97,33.01 C 85.37,34.19 83.37,36.87 80.98,41.05 L 71.26,59.02 L 84.42,85.83 L 103.85,40.65 C 104.52,39 104.86,37.48 104.86,36.1 C 104.86,32.79 102.6,31.04 98.08,30.83 C 97.67,30.83 97.47,30.36 97.47,29.42 C 97.47,28.47 97.77,28 98.38,28 C 100.03,28 101.99,28.1 104.25,28.3 C 106.34,28.51 108.1,28.61 109.51,28.61 C 111,28.61 112.72,28.51 114.67,28.3 C 116.7,28.1 118.52,28 120.14,28 C 120.61,28 120.85,28.4 120.85,29.21 z" />
                  </svg>
                </Link>
              )}
              {member.fb && (
                <Link
                  href={getSocialUrl('fb', member.fb) || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Link>
              )}
              {member.twitter && (
                <Link
                  href={getSocialUrl('twitter', member.twitter) || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
                  title="Twitter"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </Link>
              )}
              {member.ig && (
                <Link
                  href={getSocialUrl('ig', member.ig) || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.057-1.274-.07-1.649-.07-4.844 0-3.196.016-3.586.07-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-2 text-center w-full">
        <p className="text-xs font-medium text-gray-700 line-clamp-2 w-full">
          {member.name}
        </p>
      </div>
    </div>
  );
}

function MemberSection({ title, members }: { title: string; members: Member[] }) {
  if (members.length === 0) return null;
  
  return (
    <div className="mb-12">
      <Subheading className="mb-6">{title}</Subheading>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {members.map((member) => (
          <MemberLogo key={member.id} member={member} />
        ))}
      </div>
      <div className="mt-8 border-t border-gray-200"></div>
    </div>
  );
}

export default async function MembersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [page, membersByType] = await Promise.all([
    sanityFetch({ query: pageTypeQuery, params: { type: "members", language: locale } }), 
    getMembersByType()
  ]);

  return (
    <Main>
      <Section
        headline={page?.title}
        subheadline={
          page?.content?.length ? (
            <Document>
              <PortableText value={page.content as PortableTextBlock[]} />
            </Document>
          ) : undefined
        }
      >
        <div className="mt-12">
          <MemberSection title="Regional Members" members={membersByType.regional} />
          <MemberSection title="Full Members" members={membersByType.full} />
          <MemberSection title="Associate Members" members={membersByType.associate} />
          <MemberSection title="Observer Members" members={membersByType.observer} />
        </div>
      </Section>
    </Main>
  );
}
