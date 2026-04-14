"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { Member } from "@/src/lib/members";

const geoUrl = "/countries.json";

interface HeroMapProps {
  members: Member[];
  locale: string;
}

export default function HeroMap({ members, locale }: HeroMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const router = useRouter();

  // Group members by country code
  const membersByCountry = new Map<string, Member[]>();
  members.forEach((member) => {
    if (member.country) {
      const existing = membersByCountry.get(member.country) || [];
      existing.push(member);
      membersByCountry.set(member.country, existing);
    }
  });

  const handleCountryClick = (countryCode: string) => {
    const hasMembers = (membersByCountry.get(countryCode) || []).length > 0;
    if (hasMembers) {
      router.push(`/${locale}/members/${countryCode}`);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ComposableMap
        projectionConfig={{
          scale: 180,
          center: [0, 20],
        }}
        className="w-full h-full"
        style={{ 
          width: "100%", 
          height: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => {
              const countryCode = geo.id;
              const countryMembers = membersByCountry.get(countryCode) || [];
              const hasMembers = countryMembers.length > 0;
              const isHovered = hoveredCountry === countryCode;

              // Styling: white with opacity for countries with members, almost transparent for others
              // Increased opacity for better visibility
              const baseFill = hasMembers 
                ? "rgba(255, 255, 255, 0.5)" 
                : "rgba(255, 255, 255, 0.1)";
              const hoverFill = "rgba(255, 255, 255, 0.7)";
              const baseStroke = hasMembers 
                ? "rgba(255, 255, 255, 0.6)" 
                : "rgba(255, 255, 255, 0.15)";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isHovered ? hoverFill : baseFill}
                  stroke={baseStroke}
                  strokeWidth={0.5}
                  style={{
                    default: {
                      outline: "none",
                      cursor: hasMembers ? "pointer" : "default",
                      transition: "fill 0.2s ease, stroke 0.2s ease",
                    },
                    hover: {
                      outline: "none",
                      cursor: hasMembers ? "pointer" : "default",
                      transition: "fill 0.2s ease, stroke 0.2s ease",
                    },
                    pressed: {
                      outline: "none",
                    },
                  }}
                  onMouseEnter={() => {
                    if (hasMembers) {
                      setHoveredCountry(countryCode);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hoveredCountry === countryCode) {
                      setHoveredCountry(null);
                    }
                  }}
                  onClick={() => handleCountryClick(countryCode)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
