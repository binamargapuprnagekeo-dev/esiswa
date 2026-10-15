import React from 'react';
import { 
  X, 
  CreditCard, 
  Edit3, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  BookOpen, 
  HeartHandshake, 
  Calendar, 
  Sparkles,
  MessageCircle,
  Award
} from 'lucide-react';
import { Student, SchoolInfo } from '../types/student';

interface StudentDetailModalProps {
  student: Student | null;
  schoolInfo: SchoolInfo;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onPrintCard: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  schoolInfo,
  onClose,
  onEdit,
  onPrintCard,
}) => {
  if (!student) return null;

  const sanitizeWhatsAppNumber = (num: string) => {
    let clean = num.replace(/\D/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }
    return clean;
  };

  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return '-';
    const birth = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} Tahun`;
  };

  const formatDateIndo = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* Modal Top Header with School banner */}
        <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold">
              <BookOpen className="w-4 h-4" />
              <span>Arsip Buku Induk Siswa &bull; {schoolInfo.namaSekolah}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mt-5">
            <img
              src={student.fotoUrl}
              alt={student.namaLengkap}
              className="w-24 h-32 object-cover rounded-2xl border-4 border-white/20 shadow-lg bg-slate-100 shrink-0"
            />
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs mb-2">
                <span>Kelas {student.kelas}</span>
                <span>&bull;</span>
                <span className="font-mono">NISN: {student.nisn}</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                {student.namaLengkap}
              </h2>
              <p className="text-indigo-100 text-sm mt-0.5">
                {student.jurusan} &bull; Tahun Ajaran {student.tahunAjaran}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    student.status === 'Aktif'
                      ? 'bg-emerald-400/20 text-emerald-100 border border-emerald-400/30'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  Status: {student.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white">
                  {student.jenisKelamin === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white">
                  Agama: {student.agama}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Section: Identitas & Tanggal Lahir */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Data Pribadi & Kelahiran</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 block text-xs">Nomor Induk Siswa (NIS)</span>
                <span className="font-bold text-slate-800 font-mono">{student.nis}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Nama Panggilan</span>
                <span className="font-bold text-slate-800">{student.namaPanggilan || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Tempat, Tanggal Lahir</span>
                <span className="font-semibold text-slate-800">
                  {student.tempatLahir}, {formatDateIndo(student.tanggalLahir)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Usia Saat Ini</span>
                <span className="font-semibold text-slate-800">{calculateAge(student.tanggalLahir)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Tingkat Kelas</span>
                <span className="font-semibold text-slate-800">Kelas {student.tingkatKelas}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Terdaftar Tanggal</span>
                <span className="font-semibold text-slate-800">{formatDateIndo(student.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Section: Kontak & Alamat */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kontak & Domisili</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 block text-xs">Alamat Lengkap</span>
                <span className="font-semibold text-slate-800">{student.alamat}</span>
                <span className="block text-slate-500 text-xs mt-0.5">
                  {student.kabupatenKota}, {student.provinsi}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 block text-xs">No. WhatsApp Siswa</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-slate-800">{student.telepon || '-'}</span>
                    {student.telepon && (
                      <a
                        href={`https://wa.me/${sanitizeWhatsAppNumber(student.telepon)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                        title="Kirim pesan WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Email Akun Belajar</span>
                  <span className="font-medium text-slate-700">{student.email || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Orang Tua / Wali */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
              <span>Data Orang Tua / Wali Siswa</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 block text-xs">Nama Ayah</span>
                <span className="font-bold text-slate-800">{student.namaAyah || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Nama Ibu / Wali</span>
                <span className="font-bold text-slate-800">{student.namaIbu || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Pekerjaan</span>
                <span className="font-semibold text-slate-800">{student.pekerjaanOrtu || '-'}</span>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-slate-400 block text-xs">No. Kontak Ortu (Kontak Darurat)</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-slate-900 font-mono text-sm">{student.noHpOrtu}</span>
                  {student.noHpOrtu && (
                    <a
                      href={`https://wa.me/${sanitizeWhatsAppNumber(student.noHpOrtu)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Hubungi via WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Ekstrakurikuler & Catatan */}
          {(student.ekstrakurikuler?.length > 0 || student.catatanKhusus) && (
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                <span>Ekstrakurikuler & Catatan Khusus</span>
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                {student.ekstrakurikuler && student.ekstrakurikuler.length > 0 && (
                  <div>
                    <span className="text-slate-400 block text-xs mb-1.5">Ekstrakurikuler yang Diikuti:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {student.ekstrakurikuler.map((e) => (
                        <span
                          key={e}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-indigo-700 border border-slate-200"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {student.catatanKhusus && (
                  <div>
                    <span className="text-slate-400 block text-xs">Catatan Prestasi / Catatan Khusus:</span>
                    <p className="text-xs sm:text-sm font-medium text-slate-700 mt-1 italic">
                      "{student.catatanKhusus}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white text-xs sm:text-sm font-bold transition-colors"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onPrintCard(student);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-2xs"
            >
              <CreditCard className="w-4 h-4" />
              <span>Cetak Kartu Siswa (KTS)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-2xs"
            >
              <Edit3 className="w-4 h-4" />
              <span>Sunting Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
