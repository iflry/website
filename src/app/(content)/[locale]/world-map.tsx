'use client'

import { ComposableMap, Geographies, Geography, Graticule, Sphere } from 'react-simple-maps';
import React from 'react';

// Define types for our membership data
interface RawMember {
  country: string;
  type: string;
  name: string;
  id: string;
  votes: number | string;
  website: string;
  fb: string;
  twitter: string;
  ig: string;
}

interface Member {
  country: string;
  type: 'full' | 'associate' | 'observer';
  name: string;
  id: string;
  votes: number | string;
  website: string;
  fb: string;
  twitter: string;
  ig: string;
}

interface WorldMapProps {
  membershipData: RawMember[];
}

const membershipTypes = {
  full: '#F4C542', // blue
  associate: '#5AB4F2', // green
  observer: '#3A94DE', // yellow
};

function isValidMember(data: RawMember): data is Member {
  return ['full', 'associate', 'observer'].includes(data.type);
}

const WorldMap = ({ membershipData }: WorldMapProps) => {
  const validMembers = membershipData.filter(isValidMember);
  console.log(validMembers);

  const countryMembership = React.useMemo(() => {
    return validMembers.reduce((acc: Record<string, Member>, member: Member) => {
      acc[member.country] = member;
      return acc;
    }, {});
  }, [validMembers]);

  console.log(countryMembership);

  return (
    <div className="w-full bg-[#3A94DE] rounded-lg shadow-lg p-4">
        <h2 className="mb-8 text-4xl text-white font-bold md:text-5xl">
          Our Global Network
         
        </h2>
        <p className="mb-8 text-lg text-white"> { membershipData.length } members</p>
      <ComposableMap width={800} height={400} projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147
      }}>
       
        <Graticule stroke="rgba(255, 255, 255, 0.3)" strokeWidth={0.5} />
        <Geographies geography={"/countries.json"}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const membershipType = countryMembership[geo.id];
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={membershipType ? membershipTypes[membershipType.type] : "rgba(255, 255, 255, 0.1)"}
                  stroke="#ffffff"
                  style={{
                    default: {
                      outline: "none",
                    },
                    hover: {
                      outline: "none",
                    },
                    pressed: {
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#F4C542]"></div>
          <span>Full Member</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#16a34a]"></div>
          <span>Associate Member</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#ca8a04]"></div>
          <span>Observer</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
