import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useEmployees } from "../hooks/useEmployees";
import { DEPARTMENTS }  from "../constants";
import type { Employee } from "../types";
import { useState, useCallback } from "react";
import { PageHeader }   from "../components/PageHeader";
import { Dropdown }     from "../components/Dropdown";
import { Plus, X, UserCircle } from "lucide-react";

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

export default function AddEmployeePage() {
  const { addEmployee } = useEmployees();
  const navigate        = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
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
    navigate("/employees");
  }

  const deptOptions = DEPARTMENTS.filter((d) => d !== "All").map((d) => ({ label: d, value: d }));

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Add Employee"
        description="Fill in the details below"
        crumbs={[
          { label: "Dashboard",  to: "/dashboard" },
          { label: "Employees",  to: "/employees"  },
          { label: "Add"                            },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Image */}
        <div className="bg-surface-card border border-surface-border rounded-xl p-5 flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl bg-surface border border-surface-border overflow-hidden flex items-center justify-center text-slate-600">
            {preview
              ? <img src={preview} className="w-full h-full object-cover" />
              : <UserCircle size={28} />
            }
          </div>
          <div>
            <p className="text-sm text-white font-medium">Profile Photo</p>
            <label className="mt-1 inline-block text-xs text-brand-500 cursor-pointer hover:underline">
              Upload image
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </div>
        </div>

        {/* Fields */}
        <div className="bg-surface-card border border-surface-border rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            { name: "firstName" as const, label: "First Name", type: "text"   },
            { name: "lastName"  as const, label: "Last Name",  type: "text"   },
            { name: "email"     as const, label: "Email",      type: "email"  },
            { name: "phone"     as const, label: "Phone",      type: "text"   },
            { name: "age"       as const, label: "Age",        type: "number" },
            { name: "city"      as const, label: "City",       type: "text"   },
            { name: "country"   as const, label: "Country",    type: "text"   },
            { name: "company"   as const, label: "Company",    type: "text"   },
            { name: "title"     as const, label: "Job Title",  type: "text"   },
          ]).map((f) => (
            <div key={f.name}>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">{f.label}</label>
              <input
                type={f.type}
                className={`w-full bg-surface border rounded-lg px-3 py-2 text-sm text-white
                  placeholder-slate-600 outline-none focus:border-brand-500 transition-colors
                  ${errors[f.name] ? "border-red-500" : "border-surface-border"}`}
                {...register(f.name, { required: `${f.label} is required` })}
              />
              {errors[f.name] && <p className="mt-1 text-xs text-red-400">{errors[f.name]?.message}</p>}
            </div>
          ))}

          {/* Gender — custom dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Gender</label>
            <Controller
              name="gender"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Dropdown
                  options={GENDER_OPTIONS}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select gender"
                />
              )}
            />
          </div>

          {/* Department — custom dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Department</label>
            <Controller
              name="department"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Dropdown
                  options={deptOptions}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select department"
                />
              )}
            />
          </div>
        </div>

        {/* Dynamic skills */}
        <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">Skills</p>
            <button
              type="button"
              onClick={() => append({ value: "" })}
              className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 transition-colors"
            >
              <Plus size={12} /> Add skill
            </button>
          </div>
          {fields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <input
                type="text"
                placeholder={`Skill ${i + 1}`}
                className="flex-1 bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-white
                  placeholder-slate-600 outline-none focus:border-brand-500 transition-colors"
                {...register(`skills.${i}.value`)}
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm border border-surface-border text-slate-400 rounded-lg hover:text-white transition-colors">
            Cancel
          </button>
          <button type="submit"
            className="px-5 py-2.5 text-sm bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors">
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
}