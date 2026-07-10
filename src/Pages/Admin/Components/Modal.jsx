import Form from "@/Pages/Admin/Components/Form";

const Modal = ({ isOpen, onClose, onSubmit, formData, setFormData, isEdit = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-xl"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-4 space-y-4">
          
          {/* 🔥 Pakai component Form */}
          <Form formData={formData} setFormData={setFormData} />

          {/* Footer */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Modal;