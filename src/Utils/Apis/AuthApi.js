import axios from "@/Utils/AxiosInstance";

export const login = async (email, password) => {
  const res = await axios.get("/user", { params: { email } });
  const user = res.data[0];

  if (!user) throw new Error("Email tidak ditemukan");
  if (user.password !== password) throw new Error("Password salah");

  return user;
};

export const register = async ({ name, email, password }) => {
  const res = await axios.get("/user", { params: { email } });

  if (res.data.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  const newUser = {
    name,
    email,
    password,
    role: "mahasiswa",
    permission: ["krs.page", "krs.read"],
  };

  const postRes = await axios.post("/user", newUser);
  return postRes.data;
};
