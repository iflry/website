"use client";

import { useState, MouseEvent } from "react";
// @ts-ignore - react-simple-maps doesn't have type definitions
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { Member, MemberType } from "@/src/lib/members";

const geoUrl = "/countries.json";

// IFLRY brand colors for different membership types
const COLORS = {
  full: "#0066CC", // Primary blue for full members
  associate: "#4A90E2", // Lighter blue for associate members
  observer: "#87CEEB", // Light blue for observer members
  regional: "#B0E0E6", // Very light blue for regional (usually not on map)
  default: "#E5E7EB", // Light gray for countries without members
  hover: "#0052A3", // Darker blue on hover
};

interface MembersMapProps {
  members: Member[];
}

interface TooltipData {
  country: string;
  members: Member[];
  x: number;
  y: number;
}

// Determine the primary membership type for a country (prioritize: full > associate > observer)
function getPrimaryMemberType(members: Member[]): MemberType | null {
  if (members.some((m) => m.type === "full")) return "full";
  if (members.some((m) => m.type === "associate")) return "associate";
  if (members.some((m) => m.type === "observer")) return "observer";
  return null;
}

// Get country color based on membership type
function getCountryColor(members: Member[]): string {
  if (members.length === 0) return COLORS.default;
  const primaryType = getPrimaryMemberType(members);
  return primaryType ? COLORS[primaryType] : COLORS.default;
}

export default function MembersMap({ members }: MembersMapProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Group members by country code
  const membersByCountry = new Map<string, Member[]>();
  members.forEach((member) => {
    if (member.country) {
      const existing = membersByCountry.get(member.country) || [];
      existing.push(member);
      membersByCountry.set(member.country, existing);
    }
  });

  const handleMouseMove = (e: MouseEvent) => {
    if (tooltip) {
      setTooltip({
        ...tooltip,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  // Count members by type for the legend
  const memberCounts = {
    full: members.filter((m) => m.type === "full" && m.country).length,
    associate: members.filter((m) => m.type === "associate" && m.country).length,
    observer: members.filter((m) => m.type === "observer" && m.country).length,
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Map */}
      <div className="relative w-full lg:w-2/3" onMouseMove={handleMouseMove}>
        <ComposableMap
          projectionConfig={{
            scale: 220,
            center: [0, 20],
          }}
          className="w-full"
          style={{ width: "100%", height: "600px" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const countryCode = geo.id;
                const countryMembers = membersByCountry.get(countryCode) || [];
                const hasMembers = countryMembers.length > 0;
                const isHovered = hoveredCountry === countryCode;
                const baseColor = getCountryColor(countryMembers);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHovered ? COLORS.hover : baseColor}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: "none",
                        cursor: hasMembers ? "pointer" : "default",
                        transition: "fill 0.2s ease",
                      },
                      hover: {
                        outline: "none",
                        cursor: hasMembers ? "pointer" : "default",
                        transition: "fill 0.2s ease",
                      },
                      pressed: {
                        outline: "none",
                      },
                    }}
                    onMouseEnter={(e: any) => {
                      if (hasMembers) {
                        setHoveredCountry(countryCode);
                        setTooltip({
                          country: geo.properties?.name || countryCode,
                          members: countryMembers,
                          x: e.clientX || 0,
                          y: e.clientY || 0,
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      // Clear hover state when leaving this specific geography
                      if (hoveredCountry === countryCode) {
                        setHoveredCountry(null);
                        setTooltip(null);
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 rounded-lg bg-white p-4 shadow-lg border border-gray-200 pointer-events-none max-w-xs"
            style={{
              left: `${tooltip.x + 10}px`,
              top: `${tooltip.y + 10}px`,
              transform: "translate(0, 0)",
            }}
          >
            <h3 className="font-bold text-lg mb-2 text-gray-900">
              {tooltip.country}
            </h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {tooltip.members.map((member) => (
                <div key={member.id} className="text-sm">
                  <span className="font-medium text-gray-800">{member.name}</span>
                  <span className="ml-2 text-xs text-gray-500 capitalize">
                    ({member.type})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Side Panel with Information */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div>
          <h2 className="text-4xl font-bold mb-4">Our Global Network</h2>
          <p className="text-gray-700 mb-6">
            IFLRY connects liberal youth organizations from around the world. 
            Hover over countries on the map to see our member organizations.
          </p>
        </div>

        {/* Legend */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: COLORS.full }}
              />
              <div>
                <div className="font-medium">Full Member ({ memberCounts.full })</div>
                <div className="text-sm text-gray-600">Voting rights in IFLRY</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: COLORS.associate }}
              />
              <div>
                <div className="font-medium">Associate Member ({ memberCounts.associate })</div>
                <div className="text-sm text-gray-600">Limited voting rights</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: COLORS.observer }}
              />
              <div>
                <div className="font-medium">Observer Member ({ memberCounts.observer })</div>
                <div className="text-sm text-gray-600">No voting rights</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: COLORS.default }}
              />
              <div>
                <div className="font-medium">No Members</div>
                <div className="text-sm text-gray-600">No IFLRY members</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
