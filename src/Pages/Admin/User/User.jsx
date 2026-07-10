import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";

import { useState } from "react";

import UserTable from "./UserTable";
import UserModal from "./UserModal";
import { DEFAULT_PERMISSIONS_BY_ROLE } from "@/Data/RolePermission";

import { confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

import { useUser, useUpdateUser } from "@/Utils/Hooks/useUser";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const User = () => {
  const { user: currentUser, setUser } = useAuthStateContext();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const {
    data: result = { data: [], total: 0 },
    isLoading: isLoadingUsers,
  } = useUser({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const { data: users = [] } = result;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit);

  const { mutateAsync: update } = useUpdateUser();

  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    role: "mahasiswa",
    permission: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const openEditModal = (selectedUser) => {
    setForm({
      id: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email,
      role: selectedUser.role,
      permission: [...(selectedUser.permission || [])],
      password: selectedUser.password,
    });
    setIsModalOpen(true);
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setForm({
      ...form,
      role: newRole,
      permission: [...(DEFAULT_PERMISSIONS_BY_ROLE[newRole] || [])],
    });
  };

  const handlePermissionToggle = (perm) => {
    const current = form.permission || [];
    const updated = current.includes(perm)
      ? current.filter((p) => p !== perm)
      : [...current, perm];
    setForm({ ...form, permission: updated });
  };

  const handleApplyDefaultPermissions = () => {
    setForm({
      ...form,
      permission: [...(DEFAULT_PERMISSIONS_BY_ROLE[form.role] || [])],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.permission || form.permission.length === 0) {
      toastError("Minimal pilih satu permission");
      return;
    }

    confirmUpdate(async () => {
      try {
        const payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          permission: form.permission,
        };

        await update({ id: form.id, data: payload });
        setIsModalOpen(false);

        if (String(currentUser?.id) === String(form.id)) {
          setUser({ ...currentUser, role: form.role, permission: form.permission });
        }
      } catch {
        // Handled by react-query onError
      }
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Manajemen User — Role & Permission
          </Heading>
        </div>

        {currentUser?.permission?.includes("user.read") && (
          <>
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              {/* Search */}
              <input
                type="text"
                placeholder="Cari nama/email..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-grow shadow-sm text-sm transition"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />

              {/* Sort By Field */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-sm transition cursor-pointer"
              >
                <option value="name">Sort by Nama</option>
                <option value="email">Sort by Email</option>
                <option value="role">Sort by Role</option>
              </select>

              {/* Sort Order */}
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-sm transition cursor-pointer"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>

              {/* Per Page */}
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-sm transition cursor-pointer"
              >
                <option value={5}>5 / halaman</option>
                <option value={10}>10 / halaman</option>
                <option value={25}>25 / halaman</option>
              </select>
            </div>

            <UserTable
              data={users}
              isLoading={isLoadingUsers}
              onEdit={openEditModal}
            />

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Halaman <span className="font-semibold text-blue-600">{page}</span> dari <span className="font-semibold">{totalPages || 1}</span> (Total: {totalCount} data)
              </p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 text-sm font-medium rounded-lg transition disabled:hover:bg-gray-200 cursor-pointer disabled:cursor-not-allowed"
                  onClick={handlePrev}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 text-sm font-medium rounded-lg transition disabled:hover:bg-gray-200 cursor-pointer disabled:cursor-not-allowed"
                  onClick={handleNext}
                  disabled={page === totalPages || totalPages === 0}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </Card>

      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          form={form}
          onRoleChange={handleRoleChange}
          onPermissionToggle={handlePermissionToggle}
          onApplyDefaultPermissions={handleApplyDefaultPermissions}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default User;
