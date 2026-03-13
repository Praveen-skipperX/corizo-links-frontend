import {
    AlertCircle,
    ExternalLink,
    Info,
    Link2,
    Loader2,
    Search,
    TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { getLinkIcon, getLinkTypeBg, getLinkTypeColor } from "../lib/linkIcons";
import { truncate } from "../lib/utils";
import { Link } from "../types";

const CATEGORY_COLORS: Record<string, string> = {
  General: "bg-gray-100 text-gray-700",
  Internship: "bg-blue-100 text-blue-700",
  Leads: "bg-green-100 text-green-700",
  Workshop: "bg-orange-100 text-orange-700",
  Event: "bg-pink-100 text-pink-700",
};

const getCategoryClass = (cat: string) =>
  CATEGORY_COLORS[cat] || "bg-purple-100 text-purple-700";

const Dashboard = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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

  const filtered = links.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase()) ||
      (l.type || "").toLowerCase().includes(search.toLowerCase()),
  );

  const categories = [...new Set(links.map((l) => l.category))];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-accent">Resource Links</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {links.length} link{links.length !== 1 ? "s" : ""} available
          </p>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by title, type, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* Info banner */}
      {!bannerDismissed && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 animate-slide-in">
          <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-blue-800 text-sm font-semibold mb-0.5">
              Important Notice
            </p>
            <p className="text-blue-700 text-xs leading-relaxed">
              Direct access to these resources is not provided through this
              portal for security reasons. You must be logged into the
              appropriate account that has been granted access. This portal only
              provides organized links.
            </p>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="text-blue-400 hover:text-blue-600 text-xs font-medium flex-shrink-0 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Link2 size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">{links.length}</p>
            <p className="text-xs text-gray-500">Total Links</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">
              {categories.length}
            </p>
            <p className="text-xs text-gray-500">Categories</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Search size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">{filtered.length}</p>
            <p className="text-xs text-gray-500">Shown</p>
          </div>
        </div>
      </div>

      {/* Links grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="text-sm">Loading links...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <AlertCircle size={40} className="text-gray-300" />
          <div className="text-center">
            <p className="font-medium text-gray-500">No links found</p>
            <p className="text-sm mt-1">
              {search
                ? "Try a different search term."
                : "No active links have been added yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((link) => (
            <LinkCard key={link._id} link={link} />
          ))}
        </div>
      )}
    </div>
  );
};

const LinkCard = ({ link }: { link: Link }) => {
  const trackClick = () => {
    api
      .post("/activities/log-click", {
        linkTitle: link.title,
        linkType: link.type,
        linkId: link._id,
      })
      .catch(() => {
        /* non-blocking, ignore errors */
      });
  };

  return (
    <div className="card hover:shadow-card-hover transition-shadow duration-200 flex flex-col group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className={[
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
            getLinkTypeBg(link.type),
          ].join(" ")}
        >
          <span className={getLinkTypeColor(link.type)}>
            {getLinkIcon(link.type, 18)}
          </span>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${getCategoryClass(
            link.category,
          )}`}
        >
          {link.category}
        </span>
      </div>

      <h3 className="font-semibold text-accent text-sm leading-snug mb-1">
        {link.title}
      </h3>

      {link.type && (
        <p
          className={`text-xs font-medium mb-1.5 ${getLinkTypeColor(link.type)}`}
        >
          {link.type}
        </p>
      )}

      {link.description && (
        <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">
          {truncate(link.description, 100)}
        </p>
      )}

      <div className="mt-auto pt-3 border-t border-gray-50">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackClick}
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2"
        >
          <ExternalLink size={14} />
          Open Link
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
