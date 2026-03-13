import { useEffect, useState } from 'react';
import {
  Plus, Pencil, Trash2, Search, ExternalLink, Loader2,
  X, Save, AlertTriangle, ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { Link, LinkStatus, LinkType, LINK_TYPES } from '../../types';
import { formatDate, truncate } from '../../lib/utils';
import { getLinkIcon, getLinkTypeColor } from '../../lib/linkIcons';

const URL_REGEX = /^https?:\/\/.+/i;

interface LinkForm {
  title: string;
  description: string;
  url: string;
  category: string;
  type: LinkType;
  status: LinkStatus;
}

const emptyForm: LinkForm = {
  title: '',
  description: '',
  url: '',
  category: 'General',
  type: 'Other',
  status: 'active',
};

const LinksManagement = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editLink, setEditLink] = useState<Link | null>(null);
  const [form, setForm] = useState<LinkForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LinkForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLinks = async () => {
    try {
      const { data } = await api.get('/links');
      if (data.success) setLinks(data.data.links as Link[]);
    } catch {
      toast.error('Failed to load links.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLinks(); }, []);

  const openAdd = () => {
    setEditLink(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (link: Link) => {
    setEditLink(link);
    setForm({
      title: link.title,
      description: link.description,
      url: link.url,
      category: link.category,
      type: link.type || 'Other',
      status: link.status,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditLink(null);
    setForm(emptyForm);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errs: typeof formErrors = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.url.trim()) errs.url = 'URL is required.';
    else if (!URL_REGEX.test(form.url.trim()))
      errs.url = 'Enter a valid URL starting with http:// or https://';
    if (!form.type) errs.type = 'Link type is required.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      if (editLink) {
        const { data } = await api.patch(`/links/${editLink._id}`, form);
        if (data.success) {
          setLinks((prev) => prev.map((l) => (l._id === editLink._id ? data.data.link : l)));
          toast.success('Link updated successfully.');
          closeModal();
        }
      } else {
        const { data } = await api.post('/links', form);
        if (data.success) {
          setLinks((prev) => [data.data.link, ...prev]);
          toast.success('Link created successfully.');
          closeModal();
        }
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to save link.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const { data } = await api.delete(`/links/${deleteId}`);
      if (data.success) {
        setLinks((prev) => prev.filter((l) => l._id !== deleteId));
        toast.success('Link deleted.');
        setDeleteId(null);
      }
    } catch {
      toast.error('Failed to delete link.');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = links.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase()) ||
      (l.type || '').toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-accent">Links Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {links.length} link{links.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          Add New Link
        </button>
      </div>

      {/* Search */}
      <div className="card !p-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, type, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">No links found</p>
            <p className="text-sm mt-1">
              {search ? 'Try a different search term.' : 'Add your first link above.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Title</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden sm:table-cell">
                    Type
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell">
                    Created
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((link) => (
                  <tr key={link._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className={getLinkTypeColor(link.type)}>
                          {getLinkIcon(link.type, 16)}
                        </span>
                        <div>
                          <p className="font-medium text-accent leading-tight">{link.title}</p>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <ExternalLink size={10} />
                            {truncate(link.url, 38)}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                        {link.type || 'Other'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        {link.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={link.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                        {link.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs hidden lg:table-cell">
                      {formatDate(link.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(link)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(link._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <Modal title={editLink ? 'Edit Link' : 'Add New Link'} onClose={closeModal}>
          <form onSubmit={handleSave} noValidate className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`input-field ${formErrors.title ? 'border-red-400' : ''}`}
                placeholder="e.g. Internship Applications Q1 2025"
              />
              {formErrors.title && <FormError>{formErrors.title}</FormError>}
            </div>

            {/* Link Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Link Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as LinkType })}
                  className={`input-field appearance-none pr-9 ${formErrors.type ? 'border-red-400' : ''}`}
                >
                  {LINK_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              {formErrors.type && <FormError>{formErrors.type}</FormError>}
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Link URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className={`input-field ${formErrors.url ? 'border-red-400' : ''}`}
                placeholder="https://docs.google.com/spreadsheets/d/…"
              />
              {formErrors.url && <FormError>{formErrors.url}</FormError>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field resize-none"
                rows={2}
                placeholder="Brief description of this link…"
              />
            </div>

            {/* Category + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Internship"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as LinkStatus })}
                    className="input-field appearance-none pr-9"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="btn-ghost flex-1">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><Loader2 size={15} className="animate-spin" /> Saving…</>
                ) : (
                  <><Save size={15} /> {editLink ? 'Update Link' : 'Add Link'}</>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal title="Delete Link" onClose={() => setDeleteId(null)}>
          <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
            <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">
              Are you sure you want to delete this link? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1">
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn-danger flex-1 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <><Loader2 size={15} className="animate-spin" /> Deleting…</>
              ) : (
                <><Trash2 size={15} /> Delete</>
              )}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ─── Shared Modal ──────────────────────────────────────────────────────── */
export const Modal = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-accent">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={17} />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

const FormError = ({ children }: { children: React.ReactNode }) => (
  <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
    <AlertTriangle size={11} />
    {children}
  </p>
);

export default LinksManagement;
