import {
    Clipboard,
    ClipboardList,
    FileSpreadsheet,
    FileText,
    Link2,
} from "lucide-react";
import type { LinkType } from "../types";

export const getLinkIcon = (
  type: LinkType | undefined,
  size = 18,
): React.ReactElement => {
  switch (type) {
    case "Google Sheets":
      return <FileSpreadsheet size={size} />;
    case "Google Docs":
      return <FileText size={size} />;
    case "Google Forms":
      return <ClipboardList size={size} />;
    case "Microsoft Forms":
      return <Clipboard size={size} />;
    case "Microsoft Excel":
      return <FileSpreadsheet size={size} />;
    case "Microsoft Word":
      return <FileText size={size} />;
    default:
      return <Link2 size={size} />;
  }
};

export const getLinkTypeColor = (type: LinkType | undefined): string => {
  switch (type) {
    case "Google Sheets":
      return "text-green-600";
    case "Google Docs":
      return "text-blue-600";
    case "Google Forms":
      return "text-primary";
    case "Microsoft Forms":
      return "text-sky-600";
    case "Microsoft Excel":
      return "text-emerald-700";
    case "Microsoft Word":
      return "text-blue-800";
    default:
      return "text-gray-500";
  }
};

export const getLinkTypeBg = (type: LinkType | undefined): string => {
  switch (type) {
    case "Google Sheets":
      return "bg-green-50";
    case "Google Docs":
      return "bg-blue-50";
    case "Google Forms":
      return "bg-primary/10";
    case "Microsoft Forms":
      return "bg-sky-50";
    case "Microsoft Excel":
      return "bg-emerald-50";
    case "Microsoft Word":
      return "bg-blue-50";
    default:
      return "bg-gray-100";
  }
};
