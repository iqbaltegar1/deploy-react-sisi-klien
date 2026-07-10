import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";

import { useParams } from "react-router-dom";

import { useGetMataKuliah } from "@/Utils/Hooks/useMataKuliah";

const MataKuliahDetail = () => {
  const { id } = useParams();
  const { data: mataKuliah, isLoading } = useGetMataKuliah(id);

  if (isLoading) return <p className="text-center">Memuat data...</p>;

  if (!mataKuliah) return <p className="text-center">Data tidak ditemukan</p>;

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">Detail Mata Kuliah</Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium">Kode</td>
            <td className="py-2 px-4">{mataKuliah.kode}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Nama</td>
            <td className="py-2 px-4">{mataKuliah.nama}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">SKS</td>
            <td className="py-2 px-4">{mataKuliah.sks}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Semester</td>
            <td className="py-2 px-4">{mataKuliah.semester}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default MataKuliahDetail;
