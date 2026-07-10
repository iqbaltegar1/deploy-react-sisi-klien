import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getAllUsers, updateUser } from "@/Utils/Apis/UserApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

// Ambil semua users
export const useUser = (query = {}) =>
  useQuery({
    queryKey: ["users", query],
    queryFn: () => getAllUsers(query),
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res.headers["x-total-count"] ?? "0", 10),
    }),
    placeholderData: keepPreviousData,
  });

// Edit user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toastSuccess("Role dan permission berhasil diperbarui!");
    },
    onError: () => toastError("Gagal memperbarui role dan permission."),
  });
};
