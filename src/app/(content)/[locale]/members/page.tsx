import PortableText from "@/src/components/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageTypeQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";
import { getMembersByType, Member } from "@/src/lib/members";
import Link from "next/link";

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
      <div className="group relative w-full aspect-square">
        <div className="flex items-center justify-center w-full h-full p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-md">
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
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 dark:bg-black/90 rounded-lg backdrop-blur-sm">
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
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C23.97 5.39 18.592.026 11.966.026L12.017 0z"/>
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
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-2 w-full">
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
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {members.map((member) => (
          <MemberLogo key={member.id} member={member} />
        ))}
      </div>
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700"></div>
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
    <div className="container mx-auto px-5 py-8">
      <div className="mb-12">
        <h1 className="mb-12 text-6xl font-bold md:text-7xl lg:text-8xl">
          {page?.title}
        </h1>
        {page?.content?.length && (
          <PortableText
            className="mx-auto max-w-2xl"
            value={page.content as PortableTextBlock[]}
          />
        )}
      </div>
      <div className="mt-12">
        <MemberSection title="Regional Members" members={membersByType.regional} />
        <MemberSection title="Full Members" members={membersByType.full} />
        <MemberSection title="Associate Members" members={membersByType.associate} />
        <MemberSection title="Observer Members" members={membersByType.observer} />
      </div>
    </div>
  );
}
