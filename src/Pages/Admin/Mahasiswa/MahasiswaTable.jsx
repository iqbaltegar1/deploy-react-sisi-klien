import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const MahasiswaTable = ({
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
  onDetail,
  getTotalSks,
}) => {
  const { user } = useAuthStateContext();

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white text-left">
        <tr>
          <th className="py-2 px-4">NIM</th>
          <th className="py-2 px-4">Nama</th>
          <th className="py-2 px-4 text-center">Max SKS</th>
          <th className="py-2 px-4 text-center">SKS Terpakai</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <tr key={`skel-${idx}`} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="py-3 px-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="py-3 px-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </td>
              <td className="py-3 px-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
              </td>
              <td className="py-3 px-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
              </td>
              <td className="py-3 px-4 animate-pulse">
                <div className="flex justify-center gap-2">
                  <div className="h-7 bg-gray-200 rounded w-16"></div>
                  <div className="h-7 bg-gray-200 rounded w-12"></div>
                  <div className="h-7 bg-gray-200 rounded w-14"></div>
                </div>
              </td>
            </tr>
          ))
        ) : data.length === 0 ? (
          <tr>
            <td colSpan="5" className="py-8 text-center text-gray-500 font-medium">
              Tidak ada data mahasiswa
            </td>
          </tr>
        ) : (
          data.map((mhs, index) => {
            const totalSks = getTotalSks ? getTotalSks(mhs.id) : 0;
            return (
              <tr key={mhs.nim || mhs.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="py-2 px-4 font-medium text-gray-900">{mhs.nim}</td>
                <td className="py-2 px-4 text-gray-900">{mhs.nama || mhs.name}</td>
                <td className="py-2 px-4 text-center text-gray-900">{mhs.max_sks || 0} SKS</td>
                <td className="py-2 px-4 text-center text-gray-900">{totalSks} SKS</td>
                <td className="py-2 px-4 text-center space-x-2">
                  {user?.permission?.includes("mahasiswa.read") && (
                    <Button size="sm" onClick={() => onDetail(mhs.id)}>
                      Detail
                    </Button>
                  )}
                  {user?.permission?.includes("mahasiswa.update") && (
                    <Button size="sm" variant="warning" onClick={() => onEdit(mhs)}>
                      Edit
                    </Button>
                  )}
                  {user?.permission?.includes("mahasiswa.delete") && (
                    <Button size="sm" variant="danger" onClick={() => onDelete(mhs.id)}>
                      Hapus
                    </Button>
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default MahasiswaTable;
