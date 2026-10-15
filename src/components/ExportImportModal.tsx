import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileJson, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Database 
} from 'lucide-react';
import { Student } from '../types/student';
import { exportToCSV, exportToJSON } from '../utils/storage';

interface ExportImportModalProps {
  students: Student[];
  onImportStudents: (imported: Student[]) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  students,
  onImportStudents,
  onResetData,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'reset'>('export');
  const [importStatus, setImportStatus] = useState<{ success?: string; error?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportStatus(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
          throw new Error('Format file tidak valid, harus berupa array data siswa.');
        }

        // Validate basic fields
        const validStudents = parsed.filter(
          (s) => s.id && s.namaLengkap && s.nisn
        );

        if (validStudents.length === 0) {
          throw new Error('Tidak ditemukan record siswa yang valid dalam file JSON.');
        }

        onImportStudents(validStudents);
        setImportStatus({
          success: `Berhasil mengimpor ${validStudents.length} data siswa ke dalam sistem!`,
        });
      } catch (err: any) {
        setImportStatus({
          error: `Gagal membaca file: ${err.message || 'Format JSON tidak valid'}`,
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Cadangan & Ekspor Data Siswa</h3>
              <p className="text-xs text-slate-400">Sinkronisasi, unduh spreadsheet dan pemulihan arsip</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
              activeTab === 'export'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ekspor & Unduh
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
              activeTab === 'import'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Impor File JSON
          </button>
          <button
            onClick={() => setActiveTab('reset')}
            className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
              activeTab === 'reset'
                ? 'border-rose-600 text-rose-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Reset Data Demo
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600">
                Pilih format data yang ingin Anda unduh dari total <strong className="text-slate-900">{students.length} data siswa</strong> yang ada di sistem saat ini:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* CSV */}
                <button
                  onClick={() => exportToCSV(students)}
                  className="p-4 rounded-2xl border-2 border-emerald-100 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                        Format CSV / Excel
                      </h4>
                      <span className="text-[11px] text-slate-500">.csv format UTF-8</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Dapat dibuka di Microsoft Excel, Google Sheets, atau aplikasi spreadsheet lainnya.
                  </p>
                </button>

                {/* JSON */}
                <button
                  onClick={() => exportToJSON(students)}
                  className="p-4 rounded-2xl border-2 border-indigo-100 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm">
                      <FileJson className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700">
                        Format Backup JSON
                      </h4>
                      <span className="text-[11px] text-slate-500">.json database backup</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Cadangan lengkap seluruh atribut, foto base64, dan riwayat yang bisa dipulihkan kembali.
                  </p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600">
                Pulihkan atau masukkan data siswa massal dengan mengunggah file cadangan JSON yang sebelumnya diekspor.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-indigo-50/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  Klik untuk Memilih File JSON
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Format file harus berekstensi .json
                </p>
              </div>

              {importStatus?.success && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{importStatus.success}</span>
                </div>
              )}

              {importStatus?.error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{importStatus.error}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reset' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <p className="font-bold">Perhatian: Reset Data ke Kondisi Awal</p>
                  <p>
                    Tindakan ini akan mengembalikan data ke daftar siswa contoh default sekolah (6 siswa Indonesia) dan menghapus perubahan data lokal saat ini.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    onResetData();
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ya, Muat Ulang Data Contoh</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
