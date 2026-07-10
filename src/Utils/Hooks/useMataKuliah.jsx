import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getAllMataKuliah,
  getMataKuliah,
  storeMataKuliah,
  updateMataKuliah,
  deleteMataKuliah,
} from "@/Utils/Apis/MataKuliahApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

// Ambil semua mata kuliah
export const useMataKuliah = (query = {}) =>
  useQuery({
    queryKey: ["mata-kuliah", query],
    queryFn: () => getAllMataKuliah(query),
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res.headers["x-total-count"] ?? "0", 10),
    }),
    placeholderData: keepPreviousData,
  });

// Ambil 1 mata kuliah
export const useGetMataKuliah = (id) =>
  useQuery({
    queryKey: ["mata-kuliah", id],
    queryFn: () => getMataKuliah(id),
    select: (res) => res?.data ?? null,
    enabled: !!id,
  });

// Tambah
export const useStoreMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMataKuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      toastSuccess("Mata kuliah berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambahkan mata kuliah."),
  });
};

// Edit
export const useUpdateMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMataKuliah(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      toastSuccess("Mata kuliah berhasil diperbarui!");
    },
    onError: () => toastError("Gagal memperbarui mata kuliah."),
  });
};

// Hapus
export const useDeleteMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMataKuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      toastSuccess("Mata kuliah berhasil dihapus!");
    },
    onError: () => toastError("Gagal menghapus mata kuliah."),
  });
};
