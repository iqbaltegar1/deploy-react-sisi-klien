import ReactDOM from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";

import './App.css'

import AuthLayout from "@/Pages/Auth/AuthLayout";
import AdminLayout from "@/Pages/Admin/AdminLayout";
import ProtectedRoute from "@/Pages/Admin/Components/ProtectedRoute";

import Login from "@/Pages/Auth/Login/Login";
import Register from "@/Pages/Auth/Register/Register";
import Dashboard from "@/Pages/Admin/Dashboard/Dashboard";
import Mahasiswa from "@/Pages/Admin/Mahasiswa/Mahasiswa";
import MahasiswaDetail from "@/Pages/Admin/MahasiswaDetail/MahasiswaDetail";
import Dosen from "@/Pages/Admin/Dosen/Dosen";
import DosenDetail from "@/Pages/Admin/DosenDetail/DosenDetail";
import MataKuliah from "@/Pages/Admin/MataKuliah/MataKuliah";
import MataKuliahDetail from "@/Pages/Admin/MataKuliahDetail/MataKuliahDetail";
import User from "@/Pages/Admin/User/User";
import RencanaStudi from "@/Pages/Admin/RencanaStudi/RencanaStudi";
import PageNotFound from "@/Pages/Error/PageNotFound";

import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/Utils/Contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "mahasiswa",
        children: [
          {
            index: true,
            element: <Mahasiswa />,
          },
          {
            path: ":id",
            element: <MahasiswaDetail />,
          },
        ],
      },
      {
        path: "dosen",
        children: [
          {
            index: true,
            element: <Dosen />,
          },
          {
            path: ":id",
            element: <DosenDetail />,
          },
        ],
      },
      {
        path: "matakuliah",
        children: [
          {
            index: true,
            element: <MataKuliah />,
          },
          {
            path: ":id",
            element: <MataKuliahDetail />,
          },
        ],
      },
      {
        path: "user",
        element: <User />,
      },
      {
        path: "rencana-studi",
        element: <RencanaStudi />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  </QueryClientProvider>
);
