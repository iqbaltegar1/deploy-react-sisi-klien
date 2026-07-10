import Label from "@/Pages/Admin/Components/Label";
import Button from "@/Pages/Admin/Components/Button";
import {
  ROLES,
  PERMISSION_GROUPS,
} from "@/Data/RolePermission";

const UserModal = ({
  isOpen,
  form,
  onRoleChange,
  onPermissionToggle,
  onApplyDefaultPermissions,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">Edit Role & Permission</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nama</Label>
              <p className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                {form.name}
              </p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                {form.email}
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={onRoleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Mengubah role akan menerapkan permission default role tersebut.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Permission</Label>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={onApplyDefaultPermissions}
              >
                Reset ke Default Role
              </Button>
            </div>

            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              {PERMISSION_GROUPS.map((group) => (
                <div key={group.label}>
                  <h3 className="font-semibold text-sm text-gray-800 mb-2">
                    {group.label}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.permissions.map((perm) => (
                      <label
                        key={perm.value}
                        className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={(form.permission || []).includes(perm.value)}
                          onChange={() => onPermissionToggle(perm.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Permission terpilih: {(form.permission || []).length} dari{" "}
              {PERMISSION_GROUPS.reduce((acc, g) => acc + g.permissions.length, 0)}
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t">
            <Button type="button" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
