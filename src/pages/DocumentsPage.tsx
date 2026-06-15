import React, { useState, useMemo, useRef } from "react";
import { PageHeader } from "../components/PageHeader";
import { Badge } from "../components/Badge";
import { Eye, Download, FileText, Trash2, Plus, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Shared System Component Imports
import Button from "../components/Button";
import SearchBox from "../components/SearchBox";
import Pagination from "../components/Pagination";
import TableHeader, { type Column } from "../components/TableHeader";
import { ConfirmModal } from "../components/ConfirmModal";

interface DocumentItem {
  id: string;
  name: string;
  type: "Payslip" | "ID Proof" | "Certificate" | "Others";
  date: string;
  size: string;
  dataUrl?: string;
}

const SEED_DOCUMENTS: DocumentItem[] = [
  {
    id: "1",
    name: "Payslip_May_2025.pdf",
    type: "Payslip",
    date: "01 May 2025",
    size: "245 KB",
  },
  {
    id: "2",
    name: "Aadhaar_Card.pdf",
    type: "ID Proof",
    date: "20 Apr 2025",
    size: "520 KB",
  },
  {
    id: "3",
    name: "PAN_Card.pdf",
    type: "ID Proof",
    date: "20 Apr 2025",
    size: "412 KB",
  },
  {
    id: "4",
    name: "Experience_Letter.pdf",
    type: "Certificate",
    date: "18 Mar 2025",
    size: "320 KB",
  },
  {
    id: "5",
    name: "Offer_Letter.pdf",
    type: "Certificate",
    date: "18 Mar 2025",
    size: "290 KB",
  },
  {
    id: "6",
    name: "Salary_Structure.pdf",
    type: "Others",
    date: "10 Feb 2025",
    size: "180 KB",
  },
  {
    id: "7",
    name: "IT_Declaration_Form.pdf",
    type: "Others",
    date: "10 Feb 2025",
    size: "210 KB",
  },
  {
    id: "8",
    name: "Payslip_April_2025.pdf",
    type: "Payslip",
    date: "01 Apr 2025",
    size: "244 KB",
  },
  {
    id: "9",
    name: "Payslip_March_2025.pdf",
    type: "Payslip",
    date: "01 Mar 2025",
    size: "245 KB",
  },
  {
    id: "10",
    name: "Payslip_February_2025.pdf",
    type: "Payslip",
    date: "01 Feb 2025",
    size: "242 KB",
  },
];

const ITEMS_PER_PAGE = 7;

const BADGE_VARIANT: Record<
  DocumentItem["type"],
  "green" | "blue" | "purple" | "slate"
> = {
  Payslip: "green",
  "ID Proof": "blue",
  Certificate: "purple",
  Others: "slate",
};

const CATEGORIES = [
  {
    id: "All",
    label: "All Documents",
    color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
  },
  {
    id: "Payslip",
    label: "Payslip",
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    id: "ID Proof",
    label: "ID Proof",
    color: "text-red-500 bg-red-50 dark:bg-red-950/40",
  },
  {
    id: "Certificate",
    label: "Certificates",
    color: "text-purple-500 bg-purple-50 dark:bg-purple-950/40",
  },
  {
    id: "Others",
    label: "Others",
    color: "text-gray-500 bg-gray-100 dark:bg-gray-800",
  },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(SEED_DOCUMENTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DocumentItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const counts = useMemo(
    () => ({
      All: documents.length,
      Payslip: documents.filter((d) => d.type === "Payslip").length,
      "ID Proof": documents.filter((d) => d.type === "ID Proof").length,
      Certificate: documents.filter((d) => d.type === "Certificate").length,
      Others: documents.filter((d) => d.type === "Others").length,
    }),
    [documents],
  );

  const filtered = useMemo(
    () =>
      documents.filter((doc) => {
        const catOk = activeCategory === "All" || doc.type === activeCategory;
        const searchOk = doc.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return catOk && searchOk;
      }),
    [documents, activeCategory, searchQuery],
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [filtered, currentPage],
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDocuments((prev) => [
        {
          id: `doc-${Date.now()}`,
          name: file.name,
          type: file.name.toLowerCase().includes("payslip")
            ? "Payslip"
            : "Others",
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          size:
            file.size > 1024 * 1024
              ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
              : `${Math.round(file.size / 1024)} KB`,
          dataUrl: reader.result as string,
        },
        ...prev,
      ]);
      toast.success(`${file.name} uploaded successfully!`);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDownload = (doc: DocumentItem) => {
    if (doc.dataUrl) {
      const a = Object.assign(document.createElement("a"), {
        href: doc.dataUrl,
        download: doc.name,
      });
      a.click();
    } else {
      toast.success(`Downloading ${doc.name} (Simulation pulled)`);
    }
  };

  const columns: Column<DocumentItem>[] = [
    {
      key: "name",
      label: "Document Name",
      render: (_v, row) => (
        <div className="flex items-center gap-2.5">
          <FileText size={14} className="text-red-500 shrink-0" />
          <span className="font-semibold truncate max-w-xs">{row.name}</span>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (_v, row) => (
        <Badge variant={BADGE_VARIANT[row.type]}>{row.type}</Badge>
      ),
    },
    { key: "date", label: "Uploaded On" },
    {
      key: "size",
      label: "Size",
      render: (_v, row) => <span className="font-mono">{row.size}</span>,
    },
    {
      key: "actions" as any,
      label: "Actions",
      render: (_v, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setPreviewDoc(row)}
            className="p-1.5 border border-(--border) hover:bg-(--bg-card2) text-(--text-secondary) rounded-xl transition-colors"
            title="Preview"
          >
            <Eye size={13} />
          </button>
          <button
            onClick={() => handleDownload(row)}
            className="p-1.5 border border-(--border) hover:bg-(--bg-card2) text-(--text-secondary) rounded-xl transition-colors"
            title="Download"
          >
            <Download size={13} />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 border border-(--border) hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-xl transition-colors"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
      />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <PageHeader
          title="My Documents"
          description="View, manage and download your documents"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "My Documents" },
          ]}
        />
        <Button
          icon={<Plus size={14} />}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-3 p-4 border rounded-2xl text-left transition-all ${activeCategory === cat.id ? "border-blue-500 ring-2 ring-blue-500/10 bg-white dark:bg-[#111827]" : "border-(--border) bg-white dark:bg-[#111827] hover:bg-gray-50/60"}`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${cat.color}`}>
              <FileText size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-(--text-primary) truncate">
                {cat.label}
              </p>
              <p className="text-sm font-bold text-(--text-primary) font-mono mt-0.5">
                {counts[cat.id as keyof typeof counts]}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-4 flex items-center shadow-sm">
        <SearchBox
          value={searchQuery}
          onChange={(v) => {
            setSearchQuery(v);
            setCurrentPage(1);
          }}
          onClear={() => {
            setSearchQuery("");
            setCurrentPage(1);
          }}
          placeholder="Search documents..."
        />
      </div>

      <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <TableHeader columns={columns} />
            <tbody className="divide-y divide-(--border) text-(--text-primary)">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-16 text-center text-sm text-gray-400"
                  >
                    No documents found.
                  </td>
                </tr>
              ) : (
                paginated.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50/40 dark:hover:bg-[#1f2a3d]/40 transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-6 py-4 text-xs">
                        {col.render
                          ? col.render((doc as any)[col.key], doc, 0)
                          : (doc as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={() => {
          setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget?.id));
          setDeleteTarget(null);
          toast.success("Document removed.");
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Full Real Preview Lightbox Overlay Modal Panel */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-(--border)">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={15} className="text-red-500 shrink-0" />
                  <p className="text-sm font-semibold text-(--text-primary) truncate">
                    {previewDoc.name}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleDownload(previewDoc)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Download size={15} />
                  </button>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-4 overflow-auto flex items-center justify-center">
                {previewDoc.dataUrl ? (
                  previewDoc.dataUrl.startsWith("data:image") ? (
                    <img
                      src={previewDoc.dataUrl}
                      alt="Preview"
                      className="max-w-full max-h-full rounded-lg object-contain shadow-md"
                    />
                  ) : (
                    <iframe
                      src={previewDoc.dataUrl}
                      className="w-full h-full rounded-xl border-none bg-white"
                      title="PDF Frame Render"
                    />
                  )
                ) : (
                  <div className="text-center space-y-3">
                    <FileText
                      size={48}
                      className="mx-auto text-gray-300 dark:text-gray-700"
                    />
                    <p className="text-xs font-semibold text-(--text-muted)">
                      Local browser sandbox file previewing emulation active
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
