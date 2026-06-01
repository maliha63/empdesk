import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useEmployees } from "../hooks/useEmployees";
import { DEPARTMENTS } from "../constants";
import { Dropdown }    from "../components/Dropdown";
import { useEffect } from "react";

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
}

const GENDER_OPTIONS = [
  { label: "Male",   value: "male"   },
  { label: "Female", value: "female" },
  { label: "Other",  value: "other"  },
];

export default function EditEmployeePage() {
  const { id }                          = useParams<{ id: string }>();
  const { employees, updateEmployee }   = useEmployees();
  const navigate                        = useNavigate();
  const employee                        = employees.find((e) => e.id === Number(id));

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    if (!employee) return;
    reset({
      firstName:  employee.firstName,
      lastName:   employee.lastName,
      email:      employee.email,
      phone:      employee.phone,
      age:        employee.age,
      gender:     employee.gender,
      department: employee.company?.department,
      title:      employee.company?.title,
      company:    employee.company?.name,
      city:       employee.address?.city,
      country:    employee.address?.country,
    });
  }, [employee, reset]);

  if (!employee) return (
    <div className="text-center py-20 text-slate-400">Employee not found.</div>
  );

  function onSubmit(data: FormValues) {
    updateEmployee({
      ...employee!,
      firstName: data.firstName,
      lastName:  data.lastName,
      email:     data.email,
      phone:     data.phone,
      age:       Number(data.age),
      gender:    data.gender,
      address:   { ...employee!.address, city: data.city, country: data.country },
      company:   { name: data.company, department: data.department, title: data.title },
    });
    navigate(`/employees/${employee!.id}`);
  }

  const deptOptions = DEPARTMENTS.filter((d) => d !== "All").map((d) => ({ label: d, value: d }));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Edit Employee</h1>
        <p className="text-sm text-slate-400 mt-0.5">{employee.firstName} {employee.lastName}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="bg-surface-card border border-surface-border rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "firstName" as const, label: "First Name", type: "text"   },
            { name: "lastName"  as const, label: "Last Name",  type: "text"   },
            { name: "email"     as const, label: "Email",      type: "email"  },
            { name: "phone"     as const, label: "Phone",      type: "text"   },
            { name: "age"       as const, label: "Age",        type: "number" },
            { name: "city"      as const, label: "City",       type: "text"   },
            { name: "country"   as const, label: "Country",    type: "text"   },
            { name: "company"   as const, label: "Company",    type: "text"   },
            { name: "title"     as const, label: "Job Title",  type: "text"   },
          ].map((f) => (
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

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm border border-surface-border text-slate-400 rounded-lg hover:text-white transition-colors">
            Cancel
          </button>
          <button type="submit"
            className="px-5 py-2.5 text-sm bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}