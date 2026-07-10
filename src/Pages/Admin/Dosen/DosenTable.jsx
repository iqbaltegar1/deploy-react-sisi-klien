import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const DosenTable = ({ data = [], isLoading = false, onEdit, onDelete, onDetail }) => {
  const { user } = useAuthStateContext();

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white text-left">
        <tr>
          <th className="py-2 px-4">NIDN</th>
          <th className="py-2 px-4">Nama</th>
          <th className="py-2 px-4">Prodi</th>
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
                <div className="h-4 bg-gray-200 rounded w-36"></div>
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
            <td colSpan="4" className="py-8 text-center text-gray-500 font-medium">
              Tidak ada data dosen
            </td>
          </tr>
        ) : (
          data.map((item, index) => (
            <tr key={item.nidn || item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="py-2 px-4 font-medium text-gray-900">{item.nidn}</td>
              <td className="py-2 px-4 text-gray-900">{item.nama}</td>
              <td className="py-2 px-4 text-gray-700">{item.prodi}</td>
              <td className="py-2 px-4 text-center space-x-2">
                {user?.permission?.includes("dosen.read") && (
                  <Button size="sm" onClick={() => onDetail(item.id)}>
                    Detail
                  </Button>
                )}
                {user?.permission?.includes("dosen.update") && (
                  <Button size="sm" variant="warning" onClick={() => onEdit(item)}>
                    Edit
                  </Button>
                )}
                {user?.permission?.includes("dosen.delete") && (
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

export default DosenTable;
