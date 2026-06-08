import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import Button from "../components/Button";
import toast, { Toaster } from "react-hot-toast";

const initialDepartments = [
  { id: 1, name: "English Department", description: "Head of the entire school/institution" },
  { id: 2, name: "Mathematics Department", description: "Assists the principal in academic/admin" },
];

export default function DepartmentPage() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const handleSave = () => {
    setDepartments([...departments, { id: Date.now(), ...form }]);
    toast.success("Department added");
    setShowModal(false);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Department"
          description="School departments and sections"
          crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Department" }]}
          action={<Button onClick={() => setShowModal(true)}>+ Add Department</Button>}
        />

        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#0f172a] border-b">
                <th className="text-left pl-8 py-4">S.L</th>
                <th className="text-left py-4">Name</th>
                <th className="text-left py-4">Description</th>
                <th className="text-right pr-8 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {departments.map((dept, i) => (
                <tr key={dept.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                  <td className="pl-8 py-5">{String(i+1).padStart(2,'0')}</td>
                  <td className="py-5 font-medium">{dept.name}</td>
                  <td className="py-5 text-(--text-secondary)">{dept.description}</td>
                  <td className="pr-8 py-5 text-right">
                    <button className="text-blue-600 hover:underline mr-4">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal same as Designation */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#111827] rounded-2xl w-full max-w-md p-8">
            <h3 className="text-xl font-semibold mb-6">Add Department</h3>
            <input type="text" placeholder="Department Name" className="w-full border rounded-xl px-4 py-3 mb-4" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <textarea placeholder="Description" className="w-full border rounded-xl px-4 py-3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            <div className="flex gap-3 mt-6">
              <Button variant="danger" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} className="flex-1">Save</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}