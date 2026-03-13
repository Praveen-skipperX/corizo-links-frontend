import {
    Activity,
    ChevronLeft,
    ChevronRight,
    Download,
    ExternalLink,
    Filter,
    KeyRound,
    Loader2,
    LogIn,
    LogOut,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    UserCog,
    UserPlus,
    UserX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import { formatDateTime } from "../../lib/utils";
import {
    ActivityAction,
    Activity as ActivityType,
    Pagination,
} from "../../types";

const ACTION_ICONS: Record<ActivityAction, React.ReactNode> = {
  Login: <LogIn size={14} className="text-green-600" />,
  Logout: <LogOut size={14} className="text-gray-500" />,
  "Link Clicked": <ExternalLink size={14} className="text-blue-500" />,
  "Link Created": <Plus size={14} className="text-emerald-600" />,
  "Link Updated": <Pencil size={14} className="text-amber-500" />,
  "Link Deleted": <Trash2 size={14} className="text-red-500" />,
  "User Created": <UserPlus size={14} className="text-emerald-600" />,
  "User Updated": <UserCog size={14} className="text-amber-500" />,
  "User Deleted": <UserX size={14} className="text-red-500" />,
  "Password Reset": <KeyRound size={14} className="text-purple-500" />,
};

const ACTION_BADGE: Record<ActivityAction, string> = {
  Login: "bg-green-100 text-green-800",
  Logout: "bg-gray-100 text-gray-700",
  "Link Clicked": "bg-blue-100 text-blue-800",
  "Link Created": "bg-emerald-100 text-emerald-800",
  "Link Updated": "bg-amber-100 text-amber-800",
  "Link Deleted": "bg-red-100 text-red-800",
  "User Created": "bg-emerald-100 text-emerald-800",
  "User Updated": "bg-amber-100 text-amber-800",
  "User Deleted": "bg-red-100 text-red-800",
  "Password Reset": "bg-purple-100 text-purple-800",
};

const ALL_ACTIONS: ActivityAction[] = [
  "Login",
  "Logout",
  "Link Clicked",
  "Link Created",
  "Link Updated",
  "Link Deleted",
  "User Created",
  "User Updated",
  "User Deleted",
  "Password Reset",
];

const ActivityLog = () => {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search.trim()) params.set("search", search.trim());
    if (actionFilter !== "all") params.set("action", actionFilter);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    return params.toString();
  }, [page, limit, search, actionFilter, dateFrom, dateTo]);

  const fetchActivities = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const { data } = await api.get(`/activities?${buildParams()}`);
        if (data.success) {
          setActivities(data.data.activities);
          setPagination(data.data.pagination);
        }
      } catch {
        if (!silent) toast.error("Failed to load activity log.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [buildParams],
  );

  // Fetch on filter/page change
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    autoRefreshRef.current = setInterval(() => fetchActivities(true), 30_000);
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    };
  }, [fetchActivities]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, actionFilter, dateFrom, dateTo]);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (actionFilter !== "all") params.set("action", actionFilter);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const response = await api.get(
        `/activities/export/csv?${params.toString()}`,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `activity-log-${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("CSV exported successfully.");
    } catch {
      toast.error("Failed to export CSV.");
    } finally {
      setExporting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setActionFilter("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const hasFilters = search || actionFilter !== "all" || dateFrom || dateTo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-accent">Activity Log</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pagination ? `${pagination.total} total events` : "Loading…"}
            {refreshing && (
              <span className="ml-2 inline-flex items-center gap-1 text-primary text-xs">
                <RefreshCw size={11} className="animate-spin" /> Refreshing…
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => fetchActivities(true)}
            disabled={refreshing}
            className="btn-ghost flex items-center gap-2 text-sm py-2"
            title="Refresh"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="btn-outline flex items-center gap-2 text-sm py-2"
          >
            {exporting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Download size={15} />
            )}
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card !p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
          <Filter size={15} className="text-primary" />
          Filters
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search user, action, details…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-8 text-sm"
            />
          </div>

          {/* Action dropdown */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="input-field text-sm"
          >
            <option value="all">All Actions</option>
            {ALL_ACTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Date from */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="input-field text-sm"
            title="Date from"
          />

          {/* Date to */}
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            min={dateFrom}
            className="input-field text-sm"
            title="Date to"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={30} className="animate-spin text-primary" />
            <p className="text-sm text-gray-400">Loading activity log…</p>
          </div>
        ) : activities.length === 0 ? (
          <EmptyState hasFilters={!!hasFilters} onClearFilters={clearFilters} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 whitespace-nowrap">
                      Timestamp
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 whitespace-nowrap">
                      User
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 whitespace-nowrap">
                      Action
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">
                      Details
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell whitespace-nowrap">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activities.map((activity) => (
                    <ActivityRow key={activity._id} activity={activity} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                <p className="text-xs text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-accent">
                    {(pagination.page - 1) * pagination.limit + 1}–
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-accent">
                    {pagination.total}
                  </span>{" "}
                  events
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={!pagination.hasPrev}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const startPage = Math.max(
                        1,
                        Math.min(
                          pagination.page - 2,
                          pagination.totalPages - 4,
                        ),
                      );
                      const p = startPage + i;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                            p === pagination.page
                              ? "bg-primary text-white shadow-sm"
                              : "text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    },
                  )}
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.hasNext}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ActivityRow = ({ activity }: { activity: ActivityType }) => (
  <tr className="hover:bg-gray-50/60 transition-colors">
    <td className="px-5 py-3.5 whitespace-nowrap">
      <span className="text-xs text-gray-500 font-mono">
        {formatDateTime(activity.timestamp)}
      </span>
    </td>
    <td className="px-5 py-3.5">
      <p className="font-medium text-accent text-xs">{activity.userName}</p>
      <p className="text-gray-400 text-xs">{activity.userEmail}</p>
    </td>
    <td className="px-5 py-3.5">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
          ACTION_BADGE[activity.action] || "bg-gray-100 text-gray-700"
        }`}
      >
        {ACTION_ICONS[activity.action]}
        {activity.action}
      </span>
    </td>
    <td className="px-5 py-3.5 hidden md:table-cell max-w-xs">
      <p className="text-gray-600 text-xs truncate" title={activity.details}>
        {activity.details || <span className="text-gray-300">—</span>}
      </p>
    </td>
    <td className="px-5 py-3.5 hidden lg:table-cell">
      <span className="text-xs text-gray-400 font-mono">
        {activity.ipAddress}
      </span>
    </td>
  </tr>
);

const EmptyState = ({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
      <Activity size={32} className="text-gray-300" />
    </div>
    <div>
      <p className="font-semibold text-gray-500 text-base">No activity found</p>
      <p className="text-sm text-gray-400 mt-1">
        {hasFilters
          ? "No events match your current filters."
          : "Activity will appear here as users interact with the portal."}
      </p>
    </div>
    {hasFilters && (
      <button onClick={onClearFilters} className="btn-outline text-sm py-2">
        Clear Filters
      </button>
    )}
  </div>
);

export default ActivityLog;
