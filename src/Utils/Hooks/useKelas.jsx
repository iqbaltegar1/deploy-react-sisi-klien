import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllKelas,
  getKelas,
  storeKelas,
  updateKelas,
  deleteKelas,
} from "@/Utils/Apis/KelasApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

// Ambil semua kelas
export const useKelas = () =>
  useQuery({
    queryKey: ["kelas"],
    queryFn: getAllKelas,
    select: (res) => res?.data ?? [],
  });

// Ambil 1 kelas
export const useGetKelas = (id) =>
  useQuery({
    queryKey: ["kelas", id],
    queryFn: () => getKelas(id),
    select: (res) => res?.data ?? null,
    enabled: !!id,
  });

// Tambah
export const useStoreKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeKelas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      toastSuccess("Kelas berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambahkan kelas."),
  });
};

// Edit
export const useUpdateKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateKelas(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      toastSuccess("Kelas berhasil diperbarui!");
    },
    onError: () => toastError("Gagal memperbarui kelas."),
  });
};

// Hapus
export const useDeleteKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteKelas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      toastSuccess("Kelas berhasil dihapus!");
    },
    onError: () => toastError("Gagal menghapus kelas."),
  });
};
