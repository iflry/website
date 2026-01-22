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
    <div className="flex flex-col gap-3 text-sm/7">
      {picture ? (
        <div className="aspect-3/4 w-full overflow-hidden rounded-sm outline -outline-offset-1 outline-black/5">
          <img
            src={picture}
            alt={name || ""}
            className="size-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-3/4 w-full overflow-hidden rounded-sm outline -outline-offset-1 outline-black/5 bg-gray-100 flex items-center justify-center">
          <span className="text-xl text-gray-400">{name?.charAt(0) || ""}</span>
        </div>
      )}
      <div>
        <p className="font-semibold text-gray-900">{name}</p>
        {getRole() && (
          <p className="text-gray-600">{getRole()}</p>
        )}
        {email && (
          <p className="mt-1">
            <Link
              href={`mailto:${email}`}
              className="font-semibold text-gray-900 underline underline-offset-4"
            >
              {email}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}