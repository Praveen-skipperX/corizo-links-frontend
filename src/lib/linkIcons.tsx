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
    case "Figma":
      return <svg width={size} height={size} viewBox="0 0 30 45" role="img" aria-label="Figma"><path fill="#f24e1e" d="M7.5 0h7.5v15H7.5a7.5 7.5 0 010-15"/><path fill="#ff7262" d="M15 0h7.5a7.5 7.5 0 010 15H15z"/><path fill="#a259ff" d="M7.5 15H15v15H7.5a7.5 7.5 0 010-15"/><circle fill="#1abcfe" cx="22.5" cy="22.5" r="7.5"/><path fill="#0acf83" d="M7.5 30H15v7.5A7.5 7.5 0 117.5 30"/></svg>;
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
    case "Figma":
      return "text-rose-600";
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
    case "Figma":
      return "bg-rose-50";
    default:
      return "bg-gray-100";
  }
};

export function resolveLinkType(link: { url: string; type?: LinkType }): LinkType {
  try { const host = new URL(link.url).hostname.toLowerCase(); if (host === 'figma.com' || host.endsWith('.figma.com')) return 'Figma'; } catch { /* preserve existing type */ }
  return link.type || 'Other';
}

export function safeLinkUrl(value: string): string | undefined {
  try { const url = new URL(value); if (['http:', 'https:'].includes(url.protocol) && !url.username && !url.password) return url.href; } catch { /* invalid stored URL */ }
  return undefined;
}
