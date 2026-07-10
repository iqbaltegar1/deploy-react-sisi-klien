import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DosenTable from "./DosenTable";
import DosenModal from "./DosenModal";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

import {
  useDosen,
  useStoreDosen,
  useUpdateDosen,
  useDeleteDosen,
} from "@/Utils/Hooks/useDosen";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Dosen = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const {
    data: result = { data: [], total: 0 },
    isLoading: isLoadingDosen,
  } = useDosen({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const { data: dosen = [] } = result;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit);

  const { mutate: store } = useStoreDosen();
  const { mutate: update } = useUpdateDosen();
  const { mutate: remove } = useDeleteDosen();

  const [form, setForm] = useState({ nidn: "", nama: "", prodi: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const resetForm = () => {
    setForm({ nidn: "", nama: "", prodi: "" });
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nidn || !form.nama || !form.prodi) {
      toastError("NIDN, Nama, dan Prodi wajib diisi");
      return;
    }

    if (isEdit) {
      confirmUpdate(() => {
        update({ id: form.id, data: form });
        resetForm();
      });
    } else {
      const exists = dosen.find((d) => d.nidn === form.nidn);
      if (exists) {
        toastError("NIDN sudah terdaftar!");
        return;
      }
      store(form);
      resetForm();
    }
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    setForm({ nidn: "", nama: "", prodi: "" });
    setIsEdit(false);
  };

  const openEditModal = (item) => {
    setForm({ id: item.id, nidn: item.nidn, nama: item.nama, prodi: item.prodi });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">Daftar Dosen</Heading>
          {user?.permission?.includes("dosen.create") && (
            <Button onClick={() => openAddModal()}>+ Tambah Dosen</Button>
          )}
        </div>

        {user?.permission?.includes("dosen.read") && (
          <>
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              {/* Search */}
              <input
                type="text"
                placeholder="Cari nama/NIDN/prodi..."
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
                <option value="nama">Sort by Nama</option>
                <option value="nidn">Sort by NIDN</option>
                <option value="prodi">Sort by Prodi</option>
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

            <DosenTable
              data={dosen}
              isLoading={isLoadingDosen}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onDetail={(id) => navigate(`/admin/dosen/${id}`)}
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
        <DosenModal
          isOpen={isModalOpen}
          isEdit={isEdit}
          form={form}
          onChange={handleChange}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default Dosen;
