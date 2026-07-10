import Label from "@/Pages/Admin/Components/Label";
import Input from "@/Pages/Admin/Components/Input";

const Form = ({ formData, setFormData }) => {
  return (
    <>
      <div>
        <Label>NIM</Label>
        <Input
          value={formData.nim}
          onChange={(e) =>
            setFormData({ ...formData, nim: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Nama</Label>
        <Input
          value={formData.nama}
          onChange={(e) =>
            setFormData({ ...formData, nama: e.target.value })
          }
        />
      </div>
    </>
  );
};

export default Form;