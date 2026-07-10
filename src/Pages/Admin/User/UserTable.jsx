import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const UserTable = ({ data = [], isLoading = false, onEdit }) => {
  const { user } = useAuthStateContext();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white text-left">
          <tr>
            <th className="py-2 px-4">Nama</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Permission</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={`skel-${idx}`} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="py-3 px-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                </td>
                <td className="py-3 px-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </td>
                <td className="py-3 px-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </td>
                <td className="py-3 px-4 animate-pulse">
                  <div className="flex gap-1">
                    <div className="h-4 bg-gray-200 rounded w-10"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-4 bg-gray-200 rounded w-10"></div>
                  </div>
                </td>
                <td className="py-3 px-4 animate-pulse">
                  <div className="flex justify-center">
                    <div className="h-7 bg-gray-200 rounded w-32"></div>
                  </div>
                </td>
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-gray-500 font-medium">
                Tidak ada data user
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-2 px-4 font-medium text-gray-900">{item.name}</td>
                <td className="py-2 px-4 text-gray-700">{item.email}</td>
                <td className="py-2 px-4">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 capitalize">
                    {item.role}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <div className="flex flex-wrap gap-1 max-w-md">
                    {(item.permission || []).slice(0, 4).map((perm) => (
                      <span
                        key={perm}
                        className="inline-block px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700"
                      >
                        {perm}
                      </span>
                    ))}
                    {(item.permission || []).length > 4 && (
                      <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-300 text-gray-600">
                        +{item.permission.length - 4} lainnya
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-4 text-center">
                  {user?.permission?.includes("user.update") && (
                    <Button size="sm" variant="warning" onClick={() => onEdit(item)}>
                      Edit Role & Permission
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
