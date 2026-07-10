import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MataKuliahTable from "./MataKuliahTable";
import MataKuliahModal from "./MataKuliahModal";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

import {
  useMataKuliah,
  useStoreMataKuliah,
  useUpdateMataKuliah,
  useDeleteMataKuliah,
} from "@/Utils/Hooks/useMataKuliah";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const MataKuliah = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const {
    data: result = { data: [], total: 0 },
    isLoading: isLoadingMataKuliah,
  } = useMataKuliah({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const { data: mataKuliah = [] } = result;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit);

  const { mutate: store } = useStoreMataKuliah();
  const { mutate: update } = useUpdateMataKuliah();
  const { mutate: remove } = useDeleteMataKuliah();

  const [form, setForm] = useState({ kode: "", nama: "", sks: "", semester: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const resetForm = () => {
    setForm({ kode: "", nama: "", sks: "", semester: "" });
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
    if (!form.kode || !form.nama || !form.sks || !form.semester) {
      toastError("Semua field wajib diisi");
      return;
    }

    const payload = {
      ...form,
      sks: Number(form.sks),
      semester: Number(form.semester),
    };

    if (isEdit) {
      confirmUpdate(() => {
        update({ id: form.id, data: payload });
        resetForm();
      });
    } else {
      const exists = mataKuliah.find((mk) => mk.kode === form.kode);
      if (exists) {
        toastError("Kode mata kuliah sudah terdaftar!");
        return;
      }
      store(payload);
      resetForm();
    }
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    setForm({ kode: "", nama: "", sks: "", semester: "" });
    setIsEdit(false);
  };

  const openEditModal = (item) => {
    setForm({
      id: item.id,
      kode: item.kode,
      nama: item.nama,
      sks: item.sks,
      semester: item.semester,
    });
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
          <Heading as="h2" className="mb-0 text-left">Daftar Mata Kuliah</Heading>
          {user?.permission?.includes("matakuliah.create") && (
            <Button onClick={() => openAddModal()}>+ Tambah Mata Kuliah</Button>
          )}
        </div>

        {user?.permission?.includes("matakuliah.read") && (
          <>
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              {/* Search */}
              <input
                type="text"
                placeholder="Cari nama/kode..."
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
                <option value="kode">Sort by Kode</option>
                <option value="sks">Sort by SKS</option>
                <option value="semester">Sort by Semester</option>
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

            <MataKuliahTable
              data={mataKuliah}
              isLoading={isLoadingMataKuliah}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onDetail={(id) => navigate(`/admin/matakuliah/${id}`)}
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
        <MataKuliahModal
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

export default MataKuliah;
