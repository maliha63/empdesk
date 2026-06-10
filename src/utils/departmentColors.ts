export const departmentColors: Record<string, { bg: string; text: string; badge: string }> = {
  "Engineering": { bg: "bg-blue-50 dark:bg-blue-950/20", text: "text-blue-700 dark:text-blue-400", badge: "blue" },
  "Sales": { bg: "bg-green-50 dark:bg-green-950/20", text: "text-green-700 dark:text-green-400", badge: "green" },
  "Marketing": { bg: "bg-purple-50 dark:bg-purple-950/20", text: "text-purple-700 dark:text-purple-400", badge: "purple" },
  "Human Resources": { bg: "bg-pink-50 dark:bg-pink-950/20", text: "text-pink-700 dark:text-pink-400", badge: "pink" },
  "Finance": { bg: "bg-amber-50 dark:bg-amber-950/20", text: "text-amber-700 dark:text-amber-400", badge: "amber" },
  "Operations": { bg: "bg-cyan-50 dark:bg-cyan-950/20", text: "text-cyan-700 dark:text-cyan-400", badge: "cyan" },
  "Product": { bg: "bg-indigo-50 dark:bg-indigo-950/20", text: "text-indigo-700 dark:text-indigo-400", badge: "indigo" },
  "Design": { bg: "bg-rose-50 dark:bg-rose-950/20", text: "text-rose-700 dark:text-rose-400", badge: "rose" },
  "Support": { bg: "bg-teal-50 dark:bg-teal-950/20", text: "text-teal-700 dark:text-teal-400", badge: "teal" },
  "Legal": { bg: "bg-orange-50 dark:bg-orange-950/20", text: "text-orange-700 dark:text-orange-400", badge: "orange" },
};

export const getDepartmentColor = (dept: string): { bg: string; text: string; badge: string } => {
  return departmentColors[dept] || { bg: "bg-gray-50 dark:bg-gray-900/20", text: "text-gray-700 dark:text-gray-400", badge: "gray" };
};

export const getDepartmentBadgeVariant = (dept: string): string => {
  return getDepartmentColor(dept).badge;
};
