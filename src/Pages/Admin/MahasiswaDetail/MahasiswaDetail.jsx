import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";

import { useParams } from "react-router-dom";

import { useGetMahasiswa } from "@/Utils/Hooks/useMahasiswa";

const MahasiswaDetail = () => {
  const { id } = useParams();
  const { data: mahasiswa, isLoading } = useGetMahasiswa(id);

  if (isLoading) return <p className="text-center">Memuat data...</p>;

  if (!mahasiswa) return <p className="text-center">Data tidak ditemukan</p>;

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">Detail Mahasiswa</Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium">NIM</td>
            <td className="py-2 px-4">{mahasiswa.nim}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Nama</td>
            <td className="py-2 px-4">{mahasiswa.nama}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default MahasiswaDetail;
