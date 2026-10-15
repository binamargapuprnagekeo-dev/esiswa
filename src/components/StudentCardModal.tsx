import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  QrCode, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Student, SchoolInfo } from '../types/student';

interface StudentCardModalProps {
  students: Student[];
  initialStudentId?: string;
  schoolInfo: SchoolInfo;
  onClose: () => void;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({
  students,
  initialStudentId,
  schoolInfo,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!initialStudentId) return 0;
    const idx = students.findIndex((s) => s.id === initialStudentId);
    return idx >= 0 ? idx : 0;
  });

  const [activeSide, setActiveSide] = useState<'both' | 'front' | 'back'>('both');

  const student = students[currentIndex];

  if (!student) {
    return null;
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % students.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + students.length) % students.length);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDateIndo = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-100 rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-white p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Kartu Tanda Siswa (KTS)
              </h2>
              <p className="text-xs text-slate-500">
                Siswa {currentIndex + 1} dari {students.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Student selector dropdown */}
            <select
              value={student.id}
              onChange={(e) => {
                const idx = students.findIndex((s) => s.id === e.target.value);
                if (idx >= 0) setCurrentIndex(idx);
              }}
              className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 max-w-[180px] sm:max-w-xs truncate"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.namaLengkap} ({s.kelas})
                </option>
              ))}
            </select>

            {/* Navigation buttons */}
            <div className="flex items-center">
              <button
                onClick={handlePrev}
                className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-l-xl text-slate-700"
                title="Siswa Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 border-y border-r border-slate-200 bg-white hover:bg-slate-50 rounded-r-xl text-slate-700"
                title="Siswa Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kartu</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Canvas Area */}
        <div className="p-6 sm:p-10 flex flex-col items-center justify-center gap-8 bg-slate-200/60 min-h-[460px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full">
            {/* FRONT CARD */}
            <div className="relative w-full max-w-[380px] mx-auto aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white shadow-xl overflow-hidden p-4 flex flex-col justify-between border-2 border-indigo-400/30">
              {/* Background decorative patterns */}
              <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
              <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />
              <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                <GraduationCap className="w-48 h-48 -mr-10 -mb-10 text-white" />
              </div>

              {/* Header Card */}
              <div className="relative z-10 flex items-center gap-2.5 pb-2 border-b border-white/20">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-200">
                    KARTU TANDA SISWA (KTS)
                  </div>
                  <div className="text-xs font-black tracking-tight text-white uppercase truncate max-w-[240px]">
                    {schoolInfo.namaSekolah}
                  </div>
                  <div className="text-[8px] text-indigo-200/80 font-mono">
                    NPSN: {schoolInfo.npsn} &bull; Akreditasi: {schoolInfo.akreditasi}
                  </div>
                </div>
              </div>

              {/* Student Body Info */}
              <div className="relative z-10 flex items-center gap-3.5 my-auto">
                <div className="relative shrink-0">
                  <img
                    src={student.fotoUrl}
                    alt={student.namaLengkap}
                    className="w-20 h-24 object-cover rounded-xl border-2 border-white/80 shadow-md bg-slate-200"
                  />
                  <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 border border-white">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex-1 space-y-1 text-left min-w-0">
                  <div className="text-xs sm:text-sm font-extrabold text-white leading-tight truncate">
                    {student.namaLengkap}
                  </div>
                  <div className="inline-block px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-extrabold text-[10px]">
                    NISN: {student.nisn}
                  </div>

                  <div className="text-[10px] space-y-0.5 text-indigo-100 font-medium">
                    <div className="flex gap-1">
                      <span className="text-indigo-300 w-12 shrink-0">NIS:</span>
                      <span className="font-mono font-bold text-white">{student.nis}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-indigo-300 w-12 shrink-0">Kelas:</span>
                      <span className="font-bold text-white truncate">{student.kelas}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-indigo-300 w-12 shrink-0">Jurusan:</span>
                      <span className="truncate">{student.jurusan.split('(')[0]}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-indigo-300 w-12 shrink-0">TTL:</span>
                      <span className="truncate">{student.tempatLahir}, {formatDateIndo(student.tanggalLahir)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Card with Barcode & Verification */}
              <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between text-[8px] text-indigo-200">
                <div className="flex flex-col">
                  {/* Simulated barcode */}
                  <div className="h-5 flex items-end gap-[1.5px] bg-white/90 p-1 rounded-sm">
                    <div className="w-[1px] h-full bg-slate-900" />
                    <div className="w-[2px] h-full bg-slate-900" />
                    <div className="w-[1px] h-full bg-slate-900" />
                    <div className="w-[3px] h-full bg-slate-900" />
                    <div className="w-[1px] h-full bg-slate-900" />
                    <div className="w-[2px] h-full bg-slate-900" />
                    <div className="w-[1px] h-full bg-slate-900" />
                    <div className="w-[3px] h-full bg-slate-900" />
                    <div className="w-[2px] h-full bg-slate-900" />
                    <div className="w-[1px] h-full bg-slate-900" />
                    <div className="w-[2px] h-full bg-slate-900" />
                    <div className="w-[1px] h-full bg-slate-900" />
                  </div>
                  <span className="font-mono text-[7px] text-white/80 mt-0.5 tracking-wider">
                    {student.nisn}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-[7px] text-indigo-300">Kepala Sekolah,</div>
                  <div className="font-serif italic text-[9px] text-white font-bold">
                    {schoolInfo.kepalaSekolah}
                  </div>
                  <div className="text-[7px] font-mono text-indigo-300/80">
                    NIP. {schoolInfo.nipKepalaSekolah}
                  </div>
                </div>
              </div>
            </div>

            {/* BACK CARD */}
            <div className="relative w-full max-w-[380px] mx-auto aspect-[1.58/1] rounded-2xl bg-white text-slate-800 shadow-xl overflow-hidden p-4 flex flex-col justify-between border-2 border-slate-200">
              {/* Decorative top ribbon */}
              <div className="h-2 w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 absolute top-0 left-0" />

              <div className="pt-2 text-center border-b border-slate-200 pb-2">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                  KETENTUAN PENGGUNAAN KARTU
                </h4>
                <p className="text-[8px] text-slate-500">
                  {schoolInfo.namaSekolah} &bull; TA {schoolInfo.tahunAjaranAktif}
                </p>
              </div>

              <div className="space-y-1.5 text-[8.5px] text-slate-600 leading-tight py-1 my-auto">
                <div className="flex gap-1.5">
                  <span className="font-bold text-indigo-600">1.</span>
                  <span>Kartu ini adalah bukti identitas sah siswa terdaftar resmi.</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="font-bold text-indigo-600">2.</span>
                  <span>Kartu wajib dibawa saat berada di lingkungan sekolah dan kegiatan resmi.</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="font-bold text-indigo-600">3.</span>
                  <span>Dilarang meminjamkan atau memindahtangankan kartu kepada pihak lain.</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="font-bold text-indigo-600">4.</span>
                  <span>Apabila kartu ini hilang atau rusak, segera melapor ke bagian Tata Usaha.</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-500">
                <div className="max-w-[210px] leading-tight text-left">
                  <div className="font-bold text-slate-700">{schoolInfo.alamatSekolah}</div>
                  <div className="text-[7.5px] text-slate-400 mt-0.5">
                    Jika menemukan kartu ini, mohon serahkan ke alamat sekolah tertera.
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="p-1 rounded bg-slate-100 border border-slate-300">
                    <QrCode className="w-8 h-8 text-slate-800" />
                  </div>
                  <span className="text-[6.5px] font-mono text-slate-500 mt-0.5">VERIFIED</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center no-print">
            Tips: Gunakan kertas foto atau PVC ID Card standard (85.60 &times; 53.98 mm) saat mencetak untuk hasil optimal.
          </p>
        </div>

        {/* Footer controls */}
        <div className="bg-white p-4 border-t border-slate-200 flex items-center justify-between no-print">
          <div className="text-xs text-slate-500">
            Menampilkan ID Card untuk: <strong className="text-slate-800">{student.namaLengkap}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
