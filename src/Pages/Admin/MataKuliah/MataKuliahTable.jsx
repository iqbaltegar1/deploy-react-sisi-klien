import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const MataKuliahTable = ({ data = [], isLoading = false, onEdit, onDelete, onDetail }) => {
  const { user } = useAuthStateContext();

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white text-left">
        <tr>
          <th className="py-2 px-4">Kode</th>
          <th className="py-2 px-4">Nama</th>
          <th className="py-2 px-4">SKS</th>
          <th className="py-2 px-4">Semester</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <tr key={`skel-${idx}`} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="py-3 px-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </td>
              <td className="py-3 px-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </td>
              <td className="py-3 px-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </td>
              <td className="py-3 px-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
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
              Tidak ada data mata kuliah
            </td>
          </tr>
        ) : (
          data.map((item, index) => (
            <tr key={item.kode || item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="py-2 px-4 font-medium text-gray-900">{item.kode}</td>
              <td className="py-2 px-4 text-gray-900">{item.nama}</td>
              <td className="py-2 px-4 text-gray-700">{item.sks}</td>
              <td className="py-2 px-4 text-gray-700">{item.semester}</td>
              <td className="py-2 px-4 text-center space-x-2">
                {user?.permission?.includes("matakuliah.read") && (
                  <Button size="sm" onClick={() => onDetail(item.id)}>
                    Detail
                  </Button>
                )}
                {user?.permission?.includes("matakuliah.update") && (
                  <Button size="sm" variant="warning" onClick={() => onEdit(item)}>
                    Edit
                  </Button>
                )}
                {user?.permission?.includes("matakuliah.delete") && (
                  <Button size="sm" variant="danger" onClick={() => onDelete(item.id)}>
                    Hapus
                  </Button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default MataKuliahTable;
