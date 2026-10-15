import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  BookOpen, 
  MapPin, 
  Users, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Save, 
  RotateCcw,
  Camera,
  HeartHandshake,
  FileText
} from 'lucide-react';
import { Student, StudentFormData, Gender, StudentStatus, Religion } from '../types/student';
import { LIST_JURUSAN, LIST_KELAS, LIST_EKSTRAKURIKULER, AVATAR_PRESETS } from '../data/initialStudents';

interface StudentFormProps {
  initialData?: Student | null;
  existingStudents: Student[];
  onSave: (data: StudentFormData, studentId?: string) => void;
  onCancel: () => void;
}

const EMPTY_FORM: StudentFormData = {
  nisn: '',
  nis: '',
  namaLengkap: '',
  namaPanggilan: '',
  jenisKelamin: 'L',
  tempatLahir: '',
  tanggalLahir: '',
  agama: 'Islam',
  tingkatKelas: '10',
  kelas: 'X-RPL 1',
  jurusan: 'Rekayasa Perangkat Lunak (RPL)',
  tahunAjaran: '2024/2025',
  status: 'Aktif',
  telepon: '',
  email: '',
  alamat: '',
  kabupatenKota: 'Jakarta Selatan',
  provinsi: 'DKI Jakarta',
  namaAyah: '',
  namaIbu: '',
  pekerjaanOrtu: '',
  noHpOrtu: '',
  fotoUrl: AVATAR_PRESETS[0].url,
  ekstrakurikuler: ['Pramuka'],
  catatanKhusus: '',
};

export const StudentForm: React.FC<StudentFormProps> = ({
  initialData,
  existingStudents,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<StudentFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, ...rest } = initialData;
      setFormData(rest);
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    // NISN validation
    if (!formData.nisn.trim()) {
      errs.nisn = 'NISN wajib diisi';
    } else if (!/^\d{10}$/.test(formData.nisn.trim())) {
      errs.nisn = 'NISN harus tepat 10 digit angka';
    } else {
      // Check duplicate
      const duplicate = existingStudents.find(
        (s) => s.nisn === formData.nisn.trim() && s.id !== initialData?.id
      );
      if (duplicate) {
        errs.nisn = `NISN sudah digunakan oleh siswa "${duplicate.namaLengkap}"`;
      }
    }

    // NIS validation
    if (!formData.nis.trim()) {
      errs.nis = 'NIS wajib diisi';
    }

    // Nama Lengkap validation
    if (!formData.namaLengkap.trim()) {
      errs.namaLengkap = 'Nama lengkap wajib diisi';
    } else if (formData.namaLengkap.trim().length < 3) {
      errs.namaLengkap = 'Nama minimal 3 karakter';
    }

    // Tanggal Lahir
    if (!formData.tanggalLahir) {
      errs.tanggalLahir = 'Tanggal lahir wajib diisi';
    }

    // Tempat Lahir
    if (!formData.tempatLahir.trim()) {
      errs.tempatLahir = 'Tempat lahir wajib diisi';
    }

    // Kontak Ortu
    if (!formData.noHpOrtu.trim()) {
      errs.noHpOrtu = 'No. HP / WA Orang Tua wajib diisi untuk kontak darurat';
    }

    // Alamat
    if (!formData.alamat.trim()) {
      errs.alamat = 'Alamat tempat tinggal wajib diisi';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    field: keyof StudentFormData,
    value: string | string[] | Gender | Religion | StudentStatus
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        handleChange('fotoUrl', event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleEkskul = (item: string) => {
    setFormData((prev) => {
      const exists = prev.ekstrakurikuler.includes(item);
      const updated = exists
        ? prev.ekstrakurikuler.filter((e) => e !== item)
        : [...prev.ekstrakurikuler, item];
      return { ...prev, ekstrakurikuler: updated };
    });
  };

  const handleFillDummy = () => {
    const randomNisn = `00${Math.floor(10000000 + Math.random() * 90000000)}`;
    const randomNis = `24.10.${Math.floor(100 + Math.random() * 900)}`;
    const dummyNames = [
      { nama: 'Raden Bagus Arya Kusuma', call: 'Arya', gender: 'L' as Gender, avatar: AVATAR_PRESETS[0].url },
      { nama: 'Zahra Annisa Maharani', call: 'Zahra', gender: 'P' as Gender, avatar: AVATAR_PRESETS[3].url },
      { nama: 'Kevin Jonathan Halim', call: 'Kevin', gender: 'L' as Gender, avatar: AVATAR_PRESETS[2].url },
      { nama: 'Nabila Syakira Ramadhani', call: 'Nabila', gender: 'P' as Gender, avatar: AVATAR_PRESETS[1].url },
    ];
    const picked = dummyNames[Math.floor(Math.random() * dummyNames.length)];

    setFormData({
      nisn: randomNisn,
      nis: randomNis,
      namaLengkap: picked.nama,
      namaPanggilan: picked.call,
      jenisKelamin: picked.gender,
      tempatLahir: 'Jakarta',
      tanggalLahir: '2008-05-18',
      agama: 'Islam',
      tingkatKelas: '10',
      kelas: 'X-RPL 1',
      jurusan: 'Rekayasa Perangkat Lunak (RPL)',
      tahunAjaran: '2024/2025',
      status: 'Aktif',
      telepon: '081298761234',
      email: `${picked.call.toLowerCase()}.${randomNis.replace(/\./g, '')}@student.sch.id`,
      alamat: 'Jl. Kemang Raya No. 19, RT 04 / RW 02',
      kabupatenKota: 'Jakarta Selatan',
      provinsi: 'DKI Jakarta',
      namaAyah: 'Ir. Susanto Kusuma',
      namaIbu: 'Hj. Ratna Dewi',
      pekerjaanOrtu: 'Wiraswasta / Konsultan',
      noHpOrtu: '081388776655',
      fotoUrl: picked.avatar,
      ekstrakurikuler: ['Coding & Robotika Club', 'Pramuka'],
      catatanKhusus: 'Tertarik bidang pemrograman web dan kecerdasan buatan.',
    });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onSave(formData, initialData?.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/10 mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-indigo-100 text-xs font-semibold backdrop-blur-xs mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              {isEditing ? 'Mode Sunting Data' : 'Formulir Registrasi Siswa'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isEditing ? 'Perbarui Data Siswa' : 'Input Data Siswa Baru'}
            </h1>
            <p className="text-indigo-100/90 text-sm mt-1 max-w-xl">
              Lengkapi formulir biodata induk siswa berikut dengan data yang valid dan terverifikasi sesuai akta lahir & kartu keluarga.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {!isEditing && (
              <button
                type="button"
                onClick={handleFillDummy}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold border border-white/30 backdrop-blur-xs transition-colors"
                title="Mengisi form dengan data acak untuk pengujian cepat"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Isi Otomatis (Demo)</span>
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              title="Tutup Form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: IDENTITAS PRIBADI */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">1. Identitas Pribadi Siswa</h2>
              <p className="text-xs text-slate-500">Nomor induk, identitas kependudukan dan biodata diri</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NISN */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                NISN (10 Digit Angka) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={10}
                  value={formData.nisn}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    handleChange('nisn', val);
                  }}
                  placeholder="Contoh: 0075482910"
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    errors.nisn
                      ? 'border-rose-300 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-400'
                      : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
                />
                <span className="absolute right-3 top-3.5 text-xs font-mono font-medium text-slate-400">
                  {formData.nisn.length}/10
                </span>
              </div>
              {errors.nisn ? (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.nisn}
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-1">Nomor Induk Siswa Nasional dari Pusdatin Kemdikbud</p>
              )}
            </div>

            {/* NIS */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                NIS (Nomor Induk Sekolah) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nis}
                onChange={(e) => handleChange('nis', e.target.value)}
                placeholder="Contoh: 24.10.001"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  errors.nis
                    ? 'border-rose-300 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-400'
                    : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              />
              {errors.nis ? (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.nis}
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-1">Nomor registrasi internal buku induk sekolah</p>
              )}
            </div>

            {/* Nama Lengkap */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Nama Lengkap Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.namaLengkap}
                onChange={(e) => handleChange('namaLengkap', e.target.value)}
                placeholder="Sesuai akta kelahiran, misal: Muhammad Rizky Pratama"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  errors.namaLengkap
                    ? 'border-rose-300 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-400'
                    : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              />
              {errors.namaLengkap && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.namaLengkap}
                </p>
              )}
            </div>

            {/* Nama Panggilan */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Nama Panggilan
              </label>
              <input
                type="text"
                value={formData.namaPanggilan}
                onChange={(e) => handleChange('namaPanggilan', e.target.value)}
                placeholder="Contoh: Rizky"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium transition-all"
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Jenis Kelamin <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('jenisKelamin', 'L')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                    formData.jenisKelamin === 'L'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Laki-laki (L)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('jenisKelamin', 'P')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                    formData.jenisKelamin === 'P'
                      ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-200'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  Perempuan (P)
                </button>
              </div>
            </div>

            {/* Tempat Lahir */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Tempat Lahir <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.tempatLahir}
                onChange={(e) => handleChange('tempatLahir', e.target.value)}
                placeholder="Kota/Kabupaten lahir, misal: Jakarta"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  errors.tempatLahir
                    ? 'border-rose-300 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-400'
                    : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              />
              {errors.tempatLahir && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.tempatLahir}
                </p>
              )}
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Tanggal Lahir <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.tanggalLahir}
                onChange={(e) => handleChange('tanggalLahir', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  errors.tanggalLahir
                    ? 'border-rose-300 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-400'
                    : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              />
              {errors.tanggalLahir && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.tanggalLahir}
                </p>
              )}
            </div>

            {/* Agama */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Agama
              </label>
              <select
                value={formData.agama}
                onChange={(e) => handleChange('agama', e.target.value as Religion)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-semibold transition-all"
              >
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen Protestan</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: AKADEMIK & PENEMPATAN KELAS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">2. Akademik & Penempatan Kelas</h2>
              <p className="text-xs text-slate-500">Penentuan rombongan belajar, jurusan, dan status keaktifan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tingkat Kelas */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Tingkat Kelas <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['10', '11', '12'] as const).map((tingkat) => (
                  <button
                    key={tingkat}
                    type="button"
                    onClick={() => handleChange('tingkatKelas', tingkat)}
                    className={`py-3 rounded-xl border text-sm font-extrabold transition-all ${
                      formData.tingkatKelas === tingkat
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Kelas {tingkat}
                  </button>
                ))}
              </div>
            </div>

            {/* Nama Rombel / Kelas */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Rombel / Kelas Spesifik <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                list="list-kelas"
                value={formData.kelas}
                onChange={(e) => handleChange('kelas', e.target.value)}
                placeholder="Pilih atau ketik (mis: X-RPL 1)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-semibold transition-all"
              />
              <datalist id="list-kelas">
                {LIST_KELAS.map((k) => (
                  <option key={k} value={k} />
                ))}
              </datalist>
            </div>

            {/* Jurusan / Peminatan */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Jurusan / Program Keahlian <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.jurusan}
                onChange={(e) => handleChange('jurusan', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-semibold transition-all"
              >
                {LIST_JURUSAN.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            {/* Tahun Ajaran */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Tahun Ajaran
              </label>
              <select
                value={formData.tahunAjaran}
                onChange={(e) => handleChange('tahunAjaran', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-semibold transition-all"
              >
                <option value="2024/2025">2024/2025 (Berjalan)</option>
                <option value="2025/2026">2025/2026 (Mendatang)</option>
                <option value="2023/2024">2023/2024</option>
              </select>
            </div>

            {/* Status Siswa */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Status Keaktifan Siswa
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Aktif', 'Pindahan', 'Alumni', 'Non-Aktif'] as StudentStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleChange('status', st)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      formData.status === st
                        ? st === 'Aktif'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200'
                          : st === 'Pindahan'
                          ? 'border-amber-600 bg-amber-50 text-amber-700 ring-2 ring-amber-200'
                          : 'border-slate-800 bg-slate-800 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: KONTAK & ALAMAT DOMISILI */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">3. Kontak & Alamat Domisili</h2>
              <p className="text-xs text-slate-500">Alamat tempat tinggal siswa dan saluran komunikasi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* No Telepon Siswa */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                No. Telepon / WhatsApp Siswa
              </label>
              <input
                type="text"
                value={formData.telepon}
                onChange={(e) => handleChange('telepon', e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium transition-all"
              />
            </div>

            {/* Email Siswa */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Email Siswa (Opsional / Akun Belajar)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="siswa@student.sch.id"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium transition-all"
              />
            </div>

            {/* Alamat Lengkap */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Alamat Lengkap Tempat Tinggal <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.alamat}
                onChange={(e) => handleChange('alamat', e.target.value)}
                placeholder="Nama jalan, RT/RW, nomor rumah, kelurahan/desa, kecamatan"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  errors.alamat
                    ? 'border-rose-300 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-400'
                    : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              />
              {errors.alamat && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.alamat}
                </p>
              )}
            </div>

            {/* Kabupaten / Kota */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Kabupaten / Kota
              </label>
              <input
                type="text"
                value={formData.kabupatenKota}
                onChange={(e) => handleChange('kabupatenKota', e.target.value)}
                placeholder="Contoh: Jakarta Selatan / Surabaya"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium transition-all"
              />
            </div>

            {/* Provinsi */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Provinsi
              </label>
              <input
                type="text"
                value={formData.provinsi}
                onChange={(e) => handleChange('provinsi', e.target.value)}
                placeholder="Contoh: DKI Jakarta / Jawa Barat"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: DATA ORANG TUA / WALI */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">4. Data Orang Tua / Wali</h2>
              <p className="text-xs text-slate-500">Informasi wali murid dan kontak darurat sekolah</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Ayah */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Nama Ayah Kandung
              </label>
              <input
                type="text"
                value={formData.namaAyah}
                onChange={(e) => handleChange('namaAyah', e.target.value)}
                placeholder="Contoh: Ahmad Pratama"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium transition-all"
              />
            </div>

            {/* Nama Ibu / Wali */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Nama Ibu Kandung / Wali
              </label>
              <input
                type="text"
                value={formData.namaIbu}
                onChange={(e) => handleChange('namaIbu', e.target.value)}
                placeholder="Contoh: Siti Rahmawati"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium transition-all"
              />
            </div>

            {/* Pekerjaan Orang Tua */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Pekerjaan Orang Tua / Wali
              </label>
              <input
                type="text"
                value={formData.pekerjaanOrtu}
                onChange={(e) => handleChange('pekerjaanOrtu', e.target.value)}
                placeholder="Contoh: PNS / Guru / Karyawan Swasta / Wiraswasta"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium transition-all"
              />
            </div>

            {/* No HP Orang Tua */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                No. HP / WhatsApp Ortu (Kontak Darurat) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.noHpOrtu}
                onChange={(e) => handleChange('noHpOrtu', e.target.value)}
                placeholder="Contoh: 081298765432"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  errors.noHpOrtu
                    ? 'border-rose-300 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-400'
                    : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              />
              {errors.noHpOrtu && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.noHpOrtu}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 5: FOTO PROFIL & EKSTRAKURIKULER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">5. Pas Foto & Ekstrakurikuler</h2>
              <p className="text-xs text-slate-500">Pas foto resmi kartu pelajar dan kegiatan pengembangan minat</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Foto Preview & Upload */}
            <div className="flex flex-col items-center p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-center">
              <div className="relative mb-3">
                <img
                  src={formData.fotoUrl || AVATAR_PRESETS[0].url}
                  alt="Foto Siswa"
                  className="w-28 h-36 object-cover rounded-xl border-2 border-indigo-200 shadow-md bg-slate-200"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md transition-colors"
                  title="Upload Foto Baru"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              <div className="flex flex-col gap-2 w-full mt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-indigo-600 border border-indigo-200 rounded-xl text-xs font-bold transition-colors shadow-2xs"
                >
                  Unggah dari Komputer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="w-full py-2 px-3 bg-slate-200/70 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  {showAvatarPicker ? 'Tutup Galeri Avatar' : 'Pilih dari Preset'}
                </button>
              </div>

              {/* Avatar Presets Modal / Dropper */}
              {showAvatarPicker && (
                <div className="grid grid-cols-3 gap-2 mt-3 p-2 bg-white rounded-xl border border-slate-200 shadow-sm w-full">
                  {AVATAR_PRESETS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleChange('fotoUrl', av.url);
                        setShowAvatarPicker(false);
                      }}
                      className="group relative rounded-lg overflow-hidden border border-slate-200 hover:border-indigo-500 transition-all aspect-square"
                      title={av.label}
                    >
                      <img src={av.url} alt={av.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ekstrakurikuler Choices */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Pilihan Ekstrakurikuler
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200/80 rounded-2xl bg-slate-50/50">
                {LIST_EKSTRAKURIKULER.map((ekskul) => {
                  const isChecked = formData.ekstrakurikuler.includes(ekskul);
                  return (
                    <button
                      type="button"
                      key={ekskul}
                      onClick={() => handleToggleEkskul(ekskul)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        isChecked
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          isChecked ? 'text-indigo-600 fill-indigo-100' : 'text-slate-300'
                        }`}
                      />
                      <span className="truncate">{ekskul}</span>
                    </button>
                  );
                })}
              </div>

              {/* Catatan Khusus */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Catatan Prestasi / Riwayat Kesehatan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formData.catatanKhusus || ''}
                  onChange={(e) => handleChange('catatanKhusus', e.target.value)}
                  placeholder="Misal: Juara olimpiade sains, riwayat asma, alergi makanan tertentu, dll."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs font-medium transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-xl flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-bold transition-colors"
          >
            Batal
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData(EMPTY_FORM)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Form
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan' : 'Daftarkan Siswa'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
