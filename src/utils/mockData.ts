import type { AttendanceRecord, Document, PerformanceRecord } from "../types";

// Seeded by userId so same user always gets same data
function seed(id: number, i: number) {
  return ((id * 9301 + i * 49297) % 233280) / 233280;
}

const statuses = ["Present", "Absent", "Late", "Leave"] as const;
const ratings  = ["Excellent", "Good", "Average", "Poor"] as const;
const months   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function getMockAttendance(userId: number): AttendanceRecord[] {
  return Array.from({ length: 20 }, (_, i) => {
    const d    = new Date(2025, 11 - Math.floor(i / 5), 28 - (i % 20));
    const s    = statuses[Math.floor(seed(userId, i) * 4)];
    return {
      date:     d.toISOString().split("T")[0],
      status:   s,
      checkIn:  s === "Absent" ? "—" : `0${8 + Math.floor(seed(userId, i + 1) * 2)}:${String(Math.floor(seed(userId, i + 2) * 59)).padStart(2, "0")}`,
      checkOut: s === "Absent" ? "—" : `1${7 + Math.floor(seed(userId, i + 3) * 2)}:${String(Math.floor(seed(userId, i + 4) * 59)).padStart(2, "0")}`,
    };
  });
}

export function getMockDocuments(userId: number): Document[] {
  const types = ["PDF", "DOCX", "PNG", "XLSX"];
  const names = ["Offer Letter", "NDA Agreement", "ID Proof", "Resume", "Appraisal Letter"];
  return Array.from({ length: 4 }, (_, i) => ({
    id:         `${userId}-doc-${i}`,
    name:       names[Math.floor(seed(userId, i) * names.length)],
    type:       types[Math.floor(seed(userId, i + 1) * types.length)],
    uploadedAt: new Date(2024, Math.floor(seed(userId, i + 2) * 11), Math.floor(seed(userId, i + 3) * 27) + 1).toISOString().split("T")[0],
    size:       `${(seed(userId, i + 4) * 900 + 100).toFixed(0)} KB`,
  }));
}

export function getMockPerformance(userId: number): PerformanceRecord[] {
  return months.map((month, i) => {
    const score = Math.floor(seed(userId, i) * 40 + 60);
    return {
      month,
      score,
      tasksCompleted: Math.floor(seed(userId, i + 1) * 20 + 5),
      rating: score >= 90 ? "Excellent" : score >= 75 ? "Good" : score >= 60 ? "Average" : "Poor",
    };
  });
}

export function getRecentActivity() {
  return [
    { id: 1, action: "Emily Johnson added as Manager",        time: "2 hours ago",  type: "add"    },
    { id: 2, action: "Michael Williams updated profile",      time: "4 hours ago",  type: "edit"   },
    { id: 3, action: "Sophia Brown applied for leave",        time: "6 hours ago",  type: "leave"  },
    { id: 4, action: "James Davis attendance marked",         time: "8 hours ago",  type: "attend" },
    { id: 5, action: "Emma Jones performance review updated", time: "1 day ago",    type: "review" },
    { id: 6, action: "Olivia Wilson joined Engineering",      time: "2 days ago",   type: "add"    },
  ];
}