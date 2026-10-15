import React, { useState } from 'react';
import { X, School, Save, Check } from 'lucide-react';
import { SchoolInfo } from '../types/student';

interface SchoolSettingsModalProps {
  schoolInfo: SchoolInfo;
  onSave: (info: SchoolInfo) => void;
  onClose: () => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  schoolInfo,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<SchoolInfo>(schoolInfo);

  const handleChange = (field: keyof SchoolInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="bg-indigo-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Identitas Sekolah</h3>
              <p className="text-xs text-indigo-200">Kop laporan resmi dan informasi kartu pelajar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nama Sekolah / Madrasah
            </label>
            <input
              type="text"
              required
              value={formData.namaSekolah}
              onChange={(e) => handleChange('namaSekolah', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                NPSN
              </label>
              <input
                type="text"
                required
                value={formData.npsn}
                onChange={(e) => handleChange('npsn', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Status Akreditasi
              </label>
              <input
                type="text"
                value={formData.akreditasi}
                onChange={(e) => handleChange('akreditasi', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Alamat Lengkap Sekolah
            </label>
            <textarea
              rows={2}
              value={formData.alamatSekolah}
              onChange={(e) => handleChange('alamatSekolah', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nama Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.kepalaSekolah}
                onChange={(e) => handleChange('kepalaSekolah', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.nipKepalaSekolah}
                onChange={(e) => handleChange('nipKepalaSekolah', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-mono focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Tahun Ajaran Aktif
            </label>
            <input
              type="text"
              value={formData.tahunAjaranAktif}
              onChange={(e) => handleChange('tahunAjaranAktif', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Konfigurasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
