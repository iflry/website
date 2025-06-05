import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { getTranslations } from "next-intl/server";
import Link from "next/link";


export type RoleType = "bureau-member" | "regional-representative" | "office" | "honorary-member" | "ombudsperson" | "advisory-council" | "individual-member";
export type BureauRole = "president" | "vice-president" | "secretary-general" | "treasurer";
export type OfficeRole = "executive-director" | "intern" | "project-manager";

interface RoleViewProps {
  picture: string | null;
  name: string | null;
  title: string | null;
  email: string | null;
  type: RoleType | null;
  bureauRole: BureauRole | null;
  officeRole: OfficeRole | null;
}

export default async function RoleView({ picture, name, title, email, type, bureauRole, officeRole }: RoleViewProps) {
  const t = await getTranslations("role")

  function getRole() {
    if (title) return title
    if (type == "bureau-member") {
        switch (bureauRole) {
          case "president":
            return t("president")
          case "vice-president":
            return t("vice-president")
          case "secretary-general":
            return t("secretary-general")
          case "treasurer":
            return t("treasurer")
        }
    } else if (type == "office") {
        switch (officeRole) {
          case "executive-director":
            return t("executive-director")
          case "intern":
            return t("intern")
          case "project-manager":
            return t("project-manager")
        }
    } else if (type == "ombudsperson") {
        return t("ombudsperson")
    }
  }
  

  return (
    <div className="flex flex-row items-center gap-4">
      <Avatar className="w-24 h-24">
        <AvatarImage className="object-cover" src={picture || ""} alt={name || ""} />
        <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-lg font-bold">{name}</p>
        <p className="text-gray-500">{getRole()}</p>
        <Link href={`mailto:${email}`}>{email}</Link>
      </div>
    </div>
  );
}