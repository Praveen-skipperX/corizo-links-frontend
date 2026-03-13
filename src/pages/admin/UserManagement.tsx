import {
    AlertTriangle,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    Pencil,
    Plus,
    Save,
    Search,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import { formatDate, formatDateTime, getInitials } from "../../lib/utils";
import { User, UserRole } from "../../types";
import { Modal } from "./LinksManagement";

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface ResetForm {
  newPassword: string;
}

const emptyForm: UserForm = {
  name: "",
  email: "",
  password: "",
  role: "author",
};

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetForm, setResetForm] = useState<ResetForm>({ newPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetting, setResetting] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      if (data.success) setUsers(data.data.users as User[]);
    } catch {
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAdd = () => {
    setEditUser(null);
    setForm(emptyForm);
    setShowPassword(false);
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowPassword(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditUser(null);
    setForm(emptyForm);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    if (!editUser && form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
      if (editUser) {
        const payload = { name: form.name, email: form.email, role: form.role };
        const { data } = await api.patch(`/users/${editUser._id}`, payload);
        if (data.success) {
          setUsers((prev) =>
            prev.map((u) => (u._id === editUser._id ? data.data.user : u)),
          );
          toast.success("User updated successfully.");
          closeModal();
        }
      } else {
        const { data } = await api.post("/users", form);
        if (data.success) {
          setUsers((prev) => [data.data.user, ...prev]);
          toast.success("User created successfully.");
          closeModal();
        }
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save user.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const { data } = await api.delete(`/users/${deleteId}`);
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== deleteId));
        toast.success("User deleted.");
        setDeleteId(null);
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete user.";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setResetting(true);
    try {
      const { data } = await api.patch(
        `/users/${resetUserId}/reset-password`,
        resetForm,
      );
      if (data.success) {
        toast.success("Password reset successfully.");
        setResetUserId(null);
        setResetForm({ newPassword: "" });
      }
    } catch {
      toast.error("Failed to reset password.");
    } finally {
      setResetting(false);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-accent">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {users.length} user{users.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          Add New User
        </button>
      </div>

      {/* Search */}
      <div className="card !p-4">
        <div className="relative max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search users..."
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
            <p className="font-medium">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    User
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden sm:table-cell">
                    Role
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">
                    Created
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell">
                    Last Login
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="font-medium text-accent flex items-center gap-1.5">
                            {user.name}
                            {user._id === currentUser?._id && (
                              <span className="text-xs text-gray-400 font-normal">
                                (you)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span
                        className={
                          user.role === "admin" ? "badge-admin" : "badge-author"
                        }
                      >
                        {user.role === "admin" ? "Admin" : "Author"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs hidden md:table-cell">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs hidden lg:table-cell">
                      {formatDateTime(user.lastLogin)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setResetUserId(user._id);
                            setResetForm({ newPassword: "" });
                            setShowResetPassword(false);
                          }}
                          className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound size={15} />
                        </button>
                        <button
                          onClick={() => openEdit(user)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        {user._id !== currentUser?._id && (
                          <button
                            onClick={() => setDeleteId(user._id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit User Modal */}
      {modalOpen && (
        <Modal
          title={editUser ? "Edit User" : "Add New User"}
          onClose={closeModal}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                placeholder="user@corizo.in"
                required
                disabled={!!editUser}
              />
            </div>
            {!editUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="input-field pr-11"
                    placeholder="Min. 8 characters"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as UserRole })
                }
                className="input-field"
              >
                <option value="author">Author (View Only)</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />{" "}
                    {editUser ? "Update User" : "Create User"}
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal title="Delete User" onClose={() => setDeleteId(null)}>
          <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
            <AlertTriangle
              size={18}
              className="text-red-500 flex-shrink-0 mt-0.5"
            />
            <p className="text-red-700 text-sm">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn-danger flex-1 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={15} /> Delete
                </>
              )}
            </button>
          </div>
        </Modal>
      )}

      {/* Reset Password */}
      {resetUserId && (
        <Modal
          title="Reset Password"
          onClose={() => {
            setResetUserId(null);
            setResetForm({ newPassword: "" });
          }}
        >
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter a new password for{" "}
              <span className="font-semibold text-accent">
                {users.find((u) => u._id === resetUserId)?.name}
              </span>
              .
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showResetPassword ? "text" : "password"}
                  value={resetForm.newPassword}
                  onChange={(e) =>
                    setResetForm({ newPassword: e.target.value })
                  }
                  className="input-field pr-11"
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowResetPassword(!showResetPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showResetPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setResetUserId(null);
                  setResetForm({ newPassword: "" });
                }}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={resetting}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {resetting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Resetting...
                  </>
                ) : (
                  <>
                    <KeyRound size={15} /> Reset Password
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;
