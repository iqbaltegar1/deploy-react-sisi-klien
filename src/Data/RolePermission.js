export const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "dosen", label: "Dosen" },
  { value: "mahasiswa", label: "Mahasiswa" },
];

export const PERMISSION_GROUPS = [
  {
    label: "Dashboard",
    permissions: [{ value: "dashboard.page", label: "Akses Dashboard" }],
  },
  {
    label: "Mahasiswa",
    permissions: [
      { value: "mahasiswa.page", label: "Halaman Mahasiswa" },
      { value: "mahasiswa.read", label: "Lihat Mahasiswa" },
      { value: "mahasiswa.create", label: "Tambah Mahasiswa" },
      { value: "mahasiswa.update", label: "Edit Mahasiswa" },
      { value: "mahasiswa.delete", label: "Hapus Mahasiswa" },
    ],
  },
  {
    label: "Dosen",
    permissions: [
      { value: "dosen.page", label: "Halaman Dosen" },
      { value: "dosen.read", label: "Lihat Dosen" },
      { value: "dosen.create", label: "Tambah Dosen" },
      { value: "dosen.update", label: "Edit Dosen" },
      { value: "dosen.delete", label: "Hapus Dosen" },
    ],
  },
  {
    label: "Mata Kuliah",
    permissions: [
      { value: "matakuliah.page", label: "Halaman Mata Kuliah" },
      { value: "matakuliah.read", label: "Lihat Mata Kuliah" },
      { value: "matakuliah.create", label: "Tambah Mata Kuliah" },
      { value: "matakuliah.update", label: "Edit Mata Kuliah" },
      { value: "matakuliah.delete", label: "Hapus Mata Kuliah" },
    ],
  },
  {
    label: "User",
    permissions: [
      { value: "user.page", label: "Halaman User" },
      { value: "user.read", label: "Lihat User" },
      { value: "user.update", label: "Edit Role & Permission" },
    ],
  },
  {
    label: "KRS",
    permissions: [
      { value: "krs.page", label: "Halaman KRS" },
      { value: "krs.read", label: "Lihat KRS" },
    ],
  },
];

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) =>
  g.permissions.map((p) => p.value)
);

export const DEFAULT_PERMISSIONS_BY_ROLE = {
  admin: [
    "dashboard.page",
    "mahasiswa.page",
    "mahasiswa.read",
    "mahasiswa.create",
    "mahasiswa.update",
    "mahasiswa.delete",
    "dosen.page",
    "dosen.read",
    "dosen.create",
    "dosen.update",
    "dosen.delete",
    "matakuliah.page",
    "matakuliah.read",
    "matakuliah.create",
    "matakuliah.update",
    "matakuliah.delete",
    "user.page",
    "user.read",
    "user.update",
  ],
  dosen: [
    "dashboard.page",
    "mahasiswa.page",
    "mahasiswa.read",
    "matakuliah.page",
    "matakuliah.read",
  ],
  mahasiswa: ["krs.page", "krs.read"],
};
