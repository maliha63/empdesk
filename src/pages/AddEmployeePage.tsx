import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useEmployees } from "../hooks/useEmployees";
import { DEPARTMENTS }  from "../constants";
import type { Employee } from "../types";
import { useState, useCallback } from "react";
import { PageHeader }  from "../components/PageHeader";
import { Dropdown }    from "../components/Dropdown";
import { Plus, X, UserCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface FormValues {
  firstName:  string;
  lastName:   string;
  email:      string;
  phone:      string;
  age:        number;
  gender:     string;
  department: string;
  title:      string;
  company:    string;
  city:       string;
  country:    string;
  skills:     { value: string }[];
}

const GENDER_OPTIONS = [
  { label: "Male",   value: "male"   },
  { label: "Female", value: "female" },
  { label: "Other",  value: "other"  },
];

const JOB_TITLES = [
  { label: "Senior Software Engineer", value: "Senior Software Engineer" },
  { label: "Software Engineer", value: "Software Engineer" },
  { label: "Junior Software Engineer", value: "Junior Software Engineer" },
  { label: "DevOps Engineer", value: "DevOps Engineer" },
  { label: "QA Engineer", value: "QA Engineer" },
  { label: "Product Manager", value: "Product Manager" },
  { label: "Product Designer", value: "Product Designer" },
  { label: "UI/UX Designer", value: "UI/UX Designer" },
  { label: "Marketing Manager", value: "Marketing Manager" },
  { label: "Marketing Specialist", value: "Marketing Specialist" },
  { label: "Sales Manager", value: "Sales Manager" },
  { label: "Sales Executive", value: "Sales Executive" },
  { label: "Finance Manager", value: "Finance Manager" },
  { label: "Finance Analyst", value: "Finance Analyst" },
  { label: "HR Manager", value: "HR Manager" },
  { label: "HR Specialist", value: "HR Specialist" },
];

export default function AddEmployeePage() {
  const { addEmployee } = useEmployees();
  const navigate        = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, control, getValues, formState: { errors } } = useForm<FormValues>({
    defaultValues: { skills: [{ value: "" }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "skills" });

  const handleImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  function onSubmit(data: FormValues) {
    const newEmployee: Employee = {
      id:        Date.now(),
      firstName: data.firstName,
      lastName:  data.lastName,
      email:     data.email,
      phone:     data.phone,
      age:       Number(data.age),
      gender:    data.gender,
      username:  `${data.firstName.toLowerCase()}${data.lastName.toLowerCase()}`,
      image:     preview ?? `https://dummyjson.com/icon/user/128`,
      address:   { address: "", city: data.city, state: "", country: data.country },
      company:   { name: data.company, department: data.department, title: data.title },
    };
    addEmployee(newEmployee);
    toast.success(`${data.firstName} ${data.lastName} added.`);
    setTimeout(() => navigate("/employees"), 1000);
  }

  const deptOptions = DEPARTMENTS.filter((d) => d !== "All").map((d) => ({ label: d, value: d }));
  const titleOptions = JOB_TITLES;

  const inputClass = (hasError: boolean) =>
    `w-full bg-[#f8fafc] dark:bg-[#0b0f1a] border rounded-lg px-3 py-2 text-sm
    text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-[#2a3a54]
    outline-none focus:border-brand-500 transition-colors
    ${hasError ? "border-red-400 dark:border-red-500" : "border-[#e2e8f0] dark:border-[#1f2a3d]"}`;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #e2e8f0",
            fontSize: "13px",
            borderRadius: "12px",
          },
        }}
      />

      <div className="w-full space-y-6">
        <PageHeader
          title="Add Employee"
          description="Fill in the details to add a new employee to the system"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Employees", to: "/employees" },
            { label: "Add" },
          ]}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Section 1: Personal Information */}
          <div className="bg-white dark:bg-[#111827] border border-[var(--border)] rounded-xl">
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[#f8fafc] dark:bg-[#0f172a]">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Personal Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-[var(--border)]">
                <div className="w-20 h-20 rounded-lg bg-[#f8fafc] dark:bg-[#0b0f1a] border border-[var(--border)] overflow-hidden flex items-center justify-center">
                  {preview
                    ? <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    : <UserCircle size={40} className="text-[var(--text-muted)]" />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Profile Photo</p>
                  <label className="text-xs text-blue-600 cursor-pointer hover:underline font-medium">
                    Upload image
                    <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {([
                  { name: "firstName" as const, label: "First Name", type: "text" },
                  { name: "lastName" as const, label: "Last Name", type: "text" },
                  { name: "email" as const, label: "Email", type: "email" },
                  { name: "phone" as const, label: "Phone", type: "text" },
                  { name: "age" as const, label: "Age", type: "number" },
                ]).map((f) => (
                  <div key={f.name}>
                    <label className="block text-xs font-medium text-[var(--text-primary)] mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      className={inputClass(!!errors[f.name])}
                      {...register(f.name, { required: `${f.label} is required` })}
                    />
                    {errors[f.name] && <p className="mt-1 text-xs text-red-500">{errors[f.name]?.message}</p>}
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] mb-1.5">Gender</label>
                  <Controller
                    name="gender" control={control} rules={{ required: true }}
                    render={({ field }) => (
                      <Dropdown options={GENDER_OPTIONS} value={field.value ?? ""} onChange={field.onChange} placeholder="Select gender" />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Address Information */}
          <div className="bg-white dark:bg-[#111827] border border-[var(--border)] rounded-xl">
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[#f8fafc] dark:bg-[#0f172a]">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Address Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {([
                  { name: "city" as const, label: "City", type: "text" },
                  { name: "country" as const, label: "Country", type: "text" },
                  { name: "company" as const, label: "Company", type: "text" },
                ]).map((f) => (
                  <div key={f.name}>
                    <label className="block text-xs font-medium text-[var(--text-primary)] mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      className={inputClass(!!errors[f.name])}
                      {...register(f.name, { required: `${f.label} is required` })}
                    />
                    {errors[f.name] && <p className="mt-1 text-xs text-red-500">{errors[f.name]?.message}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Professional Information */}
          <div className="bg-white dark:bg-[#111827] border border-[var(--border)] rounded-xl">
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[#f8fafc] dark:bg-[#0f172a]">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Professional Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] mb-1.5">Department</label>
                  <Controller
                    name="department" control={control} rules={{ required: true }}
                    render={({ field }) => (
                      <Dropdown options={deptOptions} value={field.value ?? ""} onChange={field.onChange} placeholder="Select department" />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] mb-1.5">Job Title</label>
                  <Controller
                    name="title" control={control} rules={{ required: "Job title is required" }}
                    render={({ field }) => (
                      <Dropdown options={titleOptions} value={field.value ?? ""} onChange={field.onChange} placeholder="Select job title" />
                    )}
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title?.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Skills */}
          <div className="bg-white dark:bg-[#111827] border border-[var(--border)] rounded-xl">
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Skills</h2>
              <button
                type="button"
                onClick={() => {
                  const skills = getValues("skills");
                  const last = skills[skills.length - 1];
                  if (last && !last.value?.trim()) return;
                  append({ value: "" });
                }}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity font-medium"
              >
                <Plus size={14} /> Add skill
              </button>
            </div>
            <div className="p-6 space-y-3">
              {fields.map((field, i) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Skill ${i + 1}`}
                    className={inputClass(false)}
                    {...register(`skills.${i}.value`)}
                  />
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)} className="w-10 flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-card2)] transition-colors font-medium">
              Cancel
            </button>
            <button type="submit"
              className="px-5 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
