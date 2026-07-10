import { useState, useEffect } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import {
  getAllKelas,
  storeKelas,
  updateKelas,
  deleteKelas,
} from "@/Utils/Apis/KelasApi";
import { getAllDosen } from "@/Utils/Apis/DosenApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllMataKuliah } from "@/Utils/Apis/MataKuliahApi";
import { confirmDelete } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import TableRencanaStudi from "./TableRencanaStudi";
import ModalRencanaStudi from "./ModalRencanaStudi";

export default function RencanaStudi() {
  const { user } = useAuthStateContext();
  const [kelas, setKelas] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedMhs, setSelectedMhs] = useState({});
  const [selectedDsn, setSelectedDsn] = useState({});

  const [form, setForm] = useState({ mata_kuliah_id: "", dosen_id: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const results = await Promise.allSettled([
        getAllKelas(),
        getAllDosen(),
        getAllMahasiswa(),
        getAllMataKuliah(),
      ]);
      
      if (results[0].status === 'fulfilled') {
        setKelas(results[0].value?.data || []);
      }
      if (results[1].status === 'fulfilled') {
        setDosen(results[1].value?.data || []);
      }
      if (results[2].status === 'fulfilled') {
        setMahasiswa(results[2].value?.data || []);
      }
      if (results[3].status === 'fulfilled') {
        setMataKuliah(results[3].value?.data || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toastError("Gagal mengambil data");
    } finally {
      setIsLoading(false);
    }
  };

  const mataKuliahSudahDipakai = kelas.map((k) => k.mata_kuliah_id);
  const mataKuliahBelumAdaKelas = mataKuliah.filter(
    (m) => !mataKuliahSudahDipakai.includes(m.id)
  );

  const getMaxSks = (id) => mahasiswa.find((m) => m.id === id)?.max_sks || 0;
  const getDosenMaxSks = (id) => dosen.find((d) => d.id === id)?.max_sks || 0;

  const handleAddMahasiswa = async (kelasItem, mhsId) => {
    if (!mhsId) {
      toastError("Silakan pilih mahasiswa terlebih dahulu");
      return;
    }
    const matkul = mataKuliah.find((m) => m.id === kelasItem.mata_kuliah_id);
    const sks = matkul?.sks || 0;

    const totalSksMahasiswa = kelas
      .filter((k) => k.mahasiswa_ids.includes(mhsId))
      .map((k) => mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((acc, curr) => acc + curr, 0);

    const maxSks = getMaxSks(mhsId);

    if (totalSksMahasiswa + sks > maxSks) {
      toastError(`SKS melebihi batas maksimal (${maxSks})`);
      return;
    }

    if (kelasItem.mahasiswa_ids.includes(mhsId)) {
      toastError("Mahasiswa sudah terdaftar");
      return;
    }

    const updated = {
      ...kelasItem,
      mahasiswa_ids: [...kelasItem.mahasiswa_ids, mhsId],
    };

    try {
      await updateKelas(kelasItem.id, updated);
      toastSuccess("Mahasiswa ditambahkan");
      setSelectedMhs((prev) => ({ ...prev, [kelasItem.id]: "" }));
      fetchData();
    } catch (err) {
      console.error(err);
      toastError("Gagal menambahkan mahasiswa");
    }
  };

  const handleDeleteMahasiswa = async (kelasItem, mhsId) => {
    const updated = {
      ...kelasItem,
      mahasiswa_ids: kelasItem.mahasiswa_ids.filter((id) => id !== mhsId),
    };

    try {
      await updateKelas(kelasItem.id, updated);
      toastSuccess("Mahasiswa dihapus");
      fetchData();
    } catch (err) {
      console.error(err);
      toastError("Gagal menghapus mahasiswa");
    }
  };

  const handleChangeDosen = async (kelasItem) => {
    const dsnId = selectedDsn[kelasItem.id];
    if (!dsnId) {
      toastError("Silakan pilih dosen pengampu");
      return;
    }

    const totalSksDosen = kelas
      .filter((k) => k.dosen_id === dsnId)
      .map((k) => mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((acc, curr) => acc + curr, 0);

    const kelasSks = mataKuliah.find((m) => m.id === kelasItem.mata_kuliah_id)?.sks || 0;
    const maxSks = getDosenMaxSks(dsnId);

    if (totalSksDosen + kelasSks > maxSks) {
      toastError(`Dosen melebihi batas maksimal SKS (${maxSks})`);
      return;
    }

    try {
      await updateKelas(kelasItem.id, { ...kelasItem, dosen_id: dsnId });
      toastSuccess("Dosen diperbarui");
      fetchData();
    } catch (err) {
      console.error(err);
      toastError("Gagal memperbarui dosen");
    }
  };

  const handleDeleteKelas = async (kelasId) => {
    confirmDelete(async () => {
      try {
        await deleteKelas(kelasId);
        toastSuccess("Kelas dihapus");
        fetchData();
      } catch (err) {
        console.error(err);
        toastError("Gagal menghapus kelas");
      }
    });
  };

  const openAddModal = () => {
    setForm({ mata_kuliah_id: "", dosen_id: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mata_kuliah_id || !form.dosen_id) {
      toastError("Form tidak lengkap");
      return;
    }
    try {
      await storeKelas({ ...form, mahasiswa_ids: [] });
      setIsModalOpen(false);
      toastSuccess("Kelas ditambahkan");
      fetchData();
    } catch (err) {
      console.error(err);
      toastError("Gagal menambahkan kelas");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Heading as="h2" className="mb-0 text-left">Rencana Studi</Heading>
          {user?.permission?.includes("rencana-studi.create") && (
            <Button onClick={openAddModal}>+ Tambah Kelas</Button>
          )}
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 py-6">Loading...</p>
        ) : user?.permission?.includes("rencana-studi.read") ? (
          <TableRencanaStudi
            kelas={kelas}
            mahasiswa={mahasiswa}
            dosen={dosen}
            mataKuliah={mataKuliah}
            selectedMhs={selectedMhs}
            setSelectedMhs={setSelectedMhs}
            selectedDsn={selectedDsn}
            setSelectedDsn={setSelectedDsn}
            handleAddMahasiswa={handleAddMahasiswa}
            handleDeleteMahasiswa={handleDeleteMahasiswa}
            handleChangeDosen={handleChangeDosen}
            handleDeleteKelas={handleDeleteKelas}
          />
        ) : null}
      </Card>

      {isModalOpen && (
        <ModalRencanaStudi
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onChange={handleChange}
          onSubmit={handleSubmit}
          form={form}
          dosen={dosen}
          mataKuliah={mataKuliahBelumAdaKelas}
        />
      )}
    </>
  );
}
