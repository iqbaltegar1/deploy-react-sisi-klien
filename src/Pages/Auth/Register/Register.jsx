import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

import Input from "@/Pages/Auth/Components/Input";
import Label from "@/Pages/Auth/Components/Label";
import Button from "@/Pages/Auth/Components/Button";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Form from "@/Pages/Auth/Components/Form";

import { register } from "@/Utils/Apis/AuthApi";

const Register = () => {
  const { user } = useAuthStateContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (user) return <Navigate to="/admin" />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      toastError("Semua field wajib diisi");
      return;
    }

    if (password !== confirmPassword) {
      toastError("Konfirmasi password tidak cocok");
      return;
    }

    if (password.length < 6) {
      toastError("Password minimal 6 karakter");
      return;
    }

    try {
      await register({ name, email, password });
      toastSuccess("Registrasi berhasil! Silakan login.");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toastError(err.message);
    }
  };

  return (
    <Card className="max-w-md">
      <Heading as="h2">Registrasi Akun</Heading>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Masukkan email"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Masukkan password"
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Ulangi password"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Daftar
        </Button>
      </Form>
      <p className="text-sm text-center text-gray-600 mt-4">
        Sudah punya akun?{" "}
        <Link to="/" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </Card>
  );
};

export default Register;
