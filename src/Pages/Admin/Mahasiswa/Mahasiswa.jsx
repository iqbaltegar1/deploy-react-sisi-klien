import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MahasiswaTable from "./MahasiswaTable";
import MahasiswaModal from "./MahasiswaModal";

import {
  confirmDelete,
  confirmUpdate,
} from "@/Utils/Helpers/SwalHelpers";

import { toastError } from "@/Utils/Helpers/ToastHelpers";

import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Utils/Hooks/useMahasiswa";

import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMataKuliah } from "@/Utils/Apis/MataKuliahApi";

const Mahasiswa = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  const [kelas, setKelas] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);

  useEffect(() => {
    const fetchDB = async () => {
      try {
        const [resKelas, resMataKuliah] = await Promise.all([
          getAllKelas(),
          getAllMataKuliah(),
        ]);
        setKelas(resKelas.data || []);
        setMataKuliah(resMataKuliah.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDB();
  }, []);

  const getTotalSks = (mhsId) => {
    return kelas
      .filter((k) => k.mahasiswa_ids.includes(mhsId))
      .map((k) => mataKuliah.find((mk) => mk.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
  };

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const {
    data: result = { data: [], total: 0 },
    isLoading: isLoadingMahasiswa,
  } = useMahasiswa({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const { data: mahasiswa = [] } = result;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit);



  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  const [form, setForm] = useState({ nim: "", nama: "", max_sks: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const resetForm = () => {
    setForm({ nim: "", nama: "", max_sks: 0 });
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleChange = (e) => {
    const val = e.target.name === "max_sks" ? parseInt(e.target.value, 10) || 0 : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nim || !form.nama || !form.max_sks) {
      toastError("NIM, Nama, dan Max SKS wajib diisi");
      return;
    }

    if (isEdit) {
      confirmUpdate(() => {
        update({ id: form.id, data: form });
        resetForm();
      });
    } else {
      const exists = mahasiswa.find((m) => m.nim === form.nim);
      if (exists) {
        toastError("NIM sudah terdaftar!");
        return;
      }
      store(form);
      resetForm();
    }
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    setForm({ nim: "", nama: "", max_sks: 0 });
    setIsEdit(false);
  };

  const openEditModal = (mhs) => {
    setForm({ id: mhs.id, nim: mhs.nim, nama: mhs.nama, max_sks: mhs.max_sks || 0 });
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
          <Heading as="h2" className="mb-0 text-left">Daftar Mahasiswa</Heading>
          {user?.permission?.includes("mahasiswa.create") && (
            <Button onClick={() => openAddModal()}>+ Tambah Mahasiswa</Button>
          )}
        </div>

        {user?.permission?.includes("mahasiswa.read") && (
          <>
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              {/* Search */}
              <input
                type="text"
                placeholder="Cari nama/NIM..."
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
                <option value="nim">Sort by NIM</option>
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

            <MahasiswaTable
              data={mahasiswa}
              isLoading={isLoadingMahasiswa}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onDetail={(id) => navigate(`/admin/mahasiswa/${id}`)}
              getTotalSks={getTotalSks}
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
        <MahasiswaModal
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

export default Mahasiswa;
