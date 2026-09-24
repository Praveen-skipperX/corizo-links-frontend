import {
  AlertCircle,
  ExternalLink,
  FolderOpen,
  Info,
  Link2,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { getLinkIcon, getLinkTypeBg, getLinkTypeColor } from "../lib/linkIcons";
import { truncate } from "../lib/utils";
import { Link } from "../types";

const CATEGORY_COLORS: Record<string, string> = {
  General: "bg-slate-100 text-slate-700",
  Internship: "bg-sky-100 text-sky-700",
  Leads: "bg-emerald-100 text-emerald-700",
  Workshop: "bg-amber-100 text-amber-700",
  Event: "bg-rose-100 text-rose-700",
  Templates: "bg-violet-100 text-violet-700",
  HR: "bg-teal-100 text-teal-700",
};

const getCategoryClass = (cat: string) =>
  CATEGORY_COLORS[cat] || "bg-primary/10 text-primary-dark";

const Dashboard = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data } = await api.get("/links/active");
        if (data.success) setLinks(data.data.links as Link[]);
      } catch {
        toast.error("Failed to load links. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(links.map((l) => l.category)))],
    [links],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return links.filter((l) => {
      const matchesCategory =
        activeCategory === "All" || l.category === activeCategory;
      const matchesSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        (l.type || "").toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [links, search, activeCategory]);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-1.5">
            Resources
          </p>
          <h1 className="text-2xl font-extrabold text-accent tracking-tight">
            Shared Links
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {links.length} active resource
            {links.length !== 1 ? "s" : ""} available for your team
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search title, type, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 pr-10"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Notice */}
      {!bannerDismissed && (
        <div className="flex items-start gap-3 rounded-2xl border border-sky-200/80 bg-gradient-to-r from-sky-50 to-primary/5 p-4 animate-slide-in">
          <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
            <Info size={15} className="text-sky-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-accent text-sm font-semibold mb-0.5">
              Access notice
            </p>
            <p className="text-gray-600 text-xs leading-relaxed">
              This portal organizes links only. Sign in to the account that has
              been granted access before opening a resource.
            </p>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="text-gray-400 hover:text-gray-600 text-xs font-semibold flex-shrink-0 transition-colors px-2 py-1 rounded-lg hover:bg-white/60"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={<Link2 size={18} className="text-primary" />}
          iconBg="bg-primary/10"
          value={links.length}
          label="Total links"
        />
        <StatCard
          icon={<FolderOpen size={18} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          value={Math.max(0, categories.length - 1)}
          label="Categories"
        />
        <StatCard
          icon={<Search size={18} className="text-sky-600" />}
          iconBg="bg-sky-50"
          value={filtered.length}
          label="Showing"
          className="col-span-2 lg:col-span-1"
        />
      </div>

      {/* Category filters */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={[
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200",
                  active
                    ? "bg-accent text-white shadow-soft"
                    : "bg-white text-gray-500 border border-gray-100 hover:border-primary/30 hover:text-primary",
                ].join(" ")}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
          <Loader2 size={28} className="animate-spin text-primary" />
          <p className="text-sm font-medium">Loading links…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
            <AlertCircle size={28} className="text-gray-300" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-600">No links found</p>
            <p className="text-sm mt-1 text-gray-400">
              {search || activeCategory !== "All"
                ? "Try a different search or category."
                : "No active links have been added yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((link, i) => (
            <LinkCard key={link._id} link={link} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  icon,
  iconBg,
  value,
  label,
  className = "",
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: number;
  label: string;
  className?: string;
}) => (
  <div
    className={`card flex items-center gap-3.5 !p-4 hover:shadow-card-hover transition-shadow duration-300 ${className}`}
  >
    <div
      className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
    >
      {icon}
    </div>
    <div>
      <p className="text-2xl font-extrabold text-accent tracking-tight leading-none">
        {value}
      </p>
      <p className="text-[11px] font-medium text-gray-400 mt-1 uppercase tracking-wide">
        {label}
      </p>
    </div>
  </div>
);

const LinkCard = ({ link, index }: { link: Link; index: number }) => {
  const trackClick = () => {
    api
      .post("/activities/log-click", {
        linkTitle: link.title,
        linkType: link.type,
        linkId: link._id,
      })
      .catch(() => {
        /* non-blocking */
      });
  };

  return (
    <article
      className="card group flex flex-col !p-0 overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div
            className={[
              "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105",
              getLinkTypeBg(link.type),
            ].join(" ")}
          >
            <span className={getLinkTypeColor(link.type)}>
              {getLinkIcon(link.type, 18)}
            </span>
          </div>
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide ${getCategoryClass(
              link.category,
            )}`}
          >
            {link.category}
          </span>
        </div>

        <h3 className="font-bold text-accent text-[14px] leading-snug mb-1 group-hover:text-primary transition-colors">
          {link.title}
        </h3>

        {link.type && (
          <p
            className={`text-[11px] font-semibold mb-2 ${getLinkTypeColor(
              link.type,
            )}`}
          >
            {link.type}
          </p>
        )}

        {link.description && (
          <p className="text-gray-500 text-xs leading-relaxed flex-1">
            {truncate(link.description, 110)}
          </p>
        )}
      </div>

      <div className="px-5 pb-5 pt-0 mt-auto">
        <div className="h-px bg-gray-50 mb-4" />
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackClick}
          className="btn-primary w-full flex items-center justify-center gap-2 text-[13px] py-2.5"
        >
          <ExternalLink size={14} />
          Open link
        </a>
      </div>
    </article>
  );
};

export default Dashboard;
