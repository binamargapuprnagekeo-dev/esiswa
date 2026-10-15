import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  RefreshCw, 
  Check, 
  Copy, 
  FileSpreadsheet, 
  Code, 
  Sparkles, 
  Save, 
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2
} from 'lucide-react';
import { Student } from '../types/student';
import { 
  getWebhookUrl, 
  saveWebhookUrl, 
  getSheetViewUrl, 
  saveSheetViewUrl,
  syncAllStudentsToGoogleSheet, 
  GOOGLE_APPS_SCRIPT_TEMPLATE,
  DEFAULT_GOOGLE_SHEET_WEBHOOK_URL,
  DEFAULT_GOOGLE_SHEET_VIEW_URL
} from '../services/googleSheetService';

interface GoogleSheetModalProps {
  students: Student[];
  onClose: () => void;
  onNotify: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  students,
  onClose,
  onNotify,
}) => {
  const [webhookUrl, setWebhookUrl] = useState(getWebhookUrl());
  const [sheetUrl, setSheetUrl] = useState(getSheetViewUrl());
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showScriptCode, setShowScriptCode] = useState(false);

  const handleSaveUrls = (e: React.FormEvent) => {
    e.preventDefault();
    saveWebhookUrl(webhookUrl.trim());
    saveSheetViewUrl(sheetUrl.trim());
    onNotify('Pengaturan URL Webhook Google Sheet berhasil disimpan!', 'success');
  };

  const handleResetToDefault = () => {
    setWebhookUrl(DEFAULT_GOOGLE_SHEET_WEBHOOK_URL);
    setSheetUrl(DEFAULT_GOOGLE_SHEET_VIEW_URL);
    saveWebhookUrl(DEFAULT_GOOGLE_SHEET_WEBHOOK_URL);
    saveSheetViewUrl(DEFAULT_GOOGLE_SHEET_VIEW_URL);
    onNotify('URL Webhook dikembalikan ke default koding.', 'info');
  };

  const handleSyncAll = async () => {
    if (students.length === 0) {
      onNotify('Belum ada data siswa untuk disinkronkan.', 'error');
      return;
    }

    setIsSyncing(true);
    try {
      const res = await syncAllStudentsToGoogleSheet(students, webhookUrl);
      onNotify(res.message, 'success');
    } catch {
      onNotify('Gagal mengirim data ke Webhook Google Sheet.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
    onNotify('Kode Google Apps Script disalin ke clipboard!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-md">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-emerald-100 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Webhook Aktif & Ditanam di Koding</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">
                Penyimpanan Otomatis Google Sheet
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-slate-700 text-xs sm:text-sm">
          {/* Info Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-950">
                Sinkronisasi Penuh: Simpan, Edit & Hapus Terhubung ke Sheet
              </p>
              <p className="text-emerald-800 text-xs leading-relaxed">
                Saat Anda <strong>mendaftarkan</strong> siswa, <strong>mengedit data</strong>, atau menekan tombol <strong>Hapus / Hapus Terpilih</strong> di web, Webhook akan langsung menghapus baris data yang bersangkutan di Google Sheet secara otomatis!
              </p>
            </div>
          </div>

          {/* Action: Open Sheet & Bulk Sync */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl border-2 border-emerald-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/50 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 text-sm">
                    Buka Google Sheet
                  </h4>
                  <p className="text-[11px] text-slate-500">Lihat tabel baris data siswa</p>
                </div>
              </div>
            </a>

            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="p-4 rounded-2xl border-2 border-indigo-200 hover:border-indigo-500 bg-white hover:bg-indigo-50/50 flex items-center justify-between group transition-all text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
                  <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 text-sm">
                    {isSyncing ? 'Mengirim Data...' : `Kirim Semua (${students.length}) Siswa`}
                  </h4>
                  <p className="text-[11px] text-slate-500">Sinkronisasi massal seluruh arsip</p>
                </div>
              </div>
            </button>
          </div>

          {/* Form Configuration URL Webhook */}
          <form onSubmit={handleSaveUrls} className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  URL Webhook Google Apps Script (Tersimpan di Koding)
                </label>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Kembalikan ke Default
                </button>
              </div>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-mono text-xs focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Endpoint Web App Apps Script yang menerima data POST JSON secara langsung.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                URL Tautan Google Spreadsheet
              </label>
              <input
                type="url"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-mono text-xs focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan URL</span>
              </button>
            </div>
          </form>

          {/* Apps Script Guide & Code */}
          {/* Apps Script Guide & Code */}
          <div className="pt-4 border-t border-slate-100">
            {/* Warning / Troubleshooting Notice */}
            <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs leading-relaxed space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Penting: Cara Memperbarui Skrip di Google Sheet Anda</span>
              </div>
              <p>
                Jika sebelumnya tombol Hapus atau Edit membuat baris kosong di sheet Anda, hal tersebut karena Google Apps Script lama hanya memiliki perintah tambah (<em>appendRow</em>).
              </p>
              <p className="font-medium">
                <strong>Langkah Pembaruan:</strong> Salin script di bawah &rarr; Buka Apps Script spreadsheet Anda &rarr; Tempelkan script &rarr; Klik <strong>Deploy &gt; Manage deployments &gt; Ikon Pensil (Edit) &gt; Pilih "New version" &gt; Deploy</strong>.
              </p>
            </div>

            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setShowScriptCode(!showScriptCode)}
                className="inline-flex items-center gap-2 font-bold text-slate-800 hover:text-emerald-700 text-xs sm:text-sm"
              >
                <Code className="w-4 h-4 text-emerald-600" />
                <span>Lihat Script Google Apps Script (Versi Hapus & Edit Lengkap)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyScript}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Tersalin!' : 'Salin Script Baru'}</span>
              </button>
            </div>

            {showScriptCode && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <li>Buka spreadsheet Anda di <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">sheets.new</a> atau buka sheet yang terhubung.</li>
                  <li>Buka menu <strong>Ekstensi &gt; Apps Script</strong>.</li>
                  <li>Hapus semua kode lama dan tempelkan kode di bawah ini.</li>
                  <li>Klik <strong>Deploy &gt; Manage deployments (Kelola penerapan) &gt; Edit (Pensil) &gt; Versi Baru (New version) &gt; Deploy</strong>.</li>
                  <li>Selesai! Sekarang tombol Hapus dan Edit akan langsung memproses baris yang tepat tanpa pernah membuat baris kosong.</li>
                </ol>

                <div className="relative">
                  <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-64 leading-relaxed">
                    {GOOGLE_APPS_SCRIPT_TEMPLATE}
                  </pre>
                </div>
              </div>
            )}
          </div>
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
