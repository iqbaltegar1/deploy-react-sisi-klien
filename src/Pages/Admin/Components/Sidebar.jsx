import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuthStateContext();

  return (
    <aside className="bg-blue-800 text-white min-h-screen transition-all duration-300 w-64">
      <div className="p-4 border-b border-blue-700">
        <span className="text-2xl font-bold block">Admin</span>
      </div>
      <nav className="p-4 space-y-2">
        {user?.permission?.includes("dashboard.page") && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>🏠</span>
            <span className="menu-text inline">Dashboard</span>
          </NavLink>
        )}
        {user?.permission?.includes("mahasiswa.page") && (
          <NavLink
            to="/admin/mahasiswa"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>🎓</span>
            <span className="menu-text inline">Mahasiswa</span>
          </NavLink>
        )}
        {user?.permission?.includes("dosen.page") && (
          <NavLink
            to="/admin/dosen"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>👨‍🏫</span>
            <span className="menu-text inline">Dosen</span>
          </NavLink>
        )}
        {user?.permission?.includes("matakuliah.page") && (
          <NavLink
            to="/admin/matakuliah"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>📚</span>
            <span className="menu-text inline">Mata Kuliah</span>
          </NavLink>
        )}
        {user?.permission?.includes("rencana-studi.page") && (
          <NavLink
            to="/admin/rencana-studi"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>📖</span>
            <span className="menu-text inline">Rencana Studi</span>
          </NavLink>
        )}
        {user?.permission?.includes("user.page") && (
          <NavLink
            to="/admin/user"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>👤</span>
            <span className="menu-text inline">User</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
