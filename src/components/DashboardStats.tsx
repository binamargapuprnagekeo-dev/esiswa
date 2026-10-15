import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  GraduationCap, 
  BookOpen, 
  Download, 
  Printer, 
  ArrowRight, 
  TrendingUp,
  Award,
  CreditCard,
  Eye,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { Student, SchoolInfo } from '../types/student';

interface DashboardStatsProps {
  students: Student[];
  schoolInfo: SchoolInfo;
  onAddNew: () => void;
  onViewList: () => void;
  onViewCards: () => void;
  onExportCSV: () => void;
  onPrintReport: () => void;
  onSelectStudent: (student: Student) => void;
  onOpenGoogleSheetModal: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  students,
  schoolInfo,
  onAddNew,
  onViewList,
  onViewCards,
  onExportCSV,
  onPrintReport,
  onSelectStudent,
  onOpenGoogleSheetModal,
}) => {
  const total = students.length;
  const maleCount = students.filter((s) => s.jenisKelamin === 'L').length;
  const femaleCount = students.filter((s) => s.jenisKelamin === 'P').length;
  const activeCount = students.filter((s) => s.status === 'Aktif').length;

  const malePercent = total > 0 ? Math.round((maleCount / total) * 100) : 0;
  const femalePercent = total > 0 ? Math.round((femaleCount / total) * 100) : 0;

  // Grade level distribution
  const kelas10Count = students.filter((s) => s.tingkatKelas === '10').length;
  const kelas11Count = students.filter((s) => s.tingkatKelas === '11').length;
  const kelas12Count = students.filter((s) => s.tingkatKelas === '12').length;

  // Jurusan distribution counts
  const jurusanMap = students.reduce((acc, s) => {
    acc[s.jurusan] = (acc[s.jurusan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedJurusan = Object.entries(jurusanMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Recent 5 students
  const recentStudents = [...students]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-indigo-100 text-xs font-semibold backdrop-blur-xs mb-3 border border-white/20">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Sistem Buku Induk Siswa Digital Terintegrasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang di {schoolInfo.namaSekolah}
            </h1>
            <p className="text-indigo-100/90 text-sm mt-2 leading-relaxed">
              Tahun Ajaran <span className="font-bold text-white">{schoolInfo.tahunAjaranAktif}</span>. 
              Sistem siap digunakan untuk pencatatan profil siswa, verifikasi nomor induk, pencetakan kartu tanda siswa, dan rekapitulasi data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs sm:text-sm font-extrabold shadow-lg shadow-indigo-950/20 transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4 text-indigo-600" />
              <span>Input Siswa Baru</span>
            </button>
            <button
              onClick={onViewList}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs sm:text-sm font-bold backdrop-blur-xs transition-colors"
            >
              <span>Semua Data Siswa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Siswa */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Siswa Terdaftar</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">{total}</h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Semua tingkat kelas</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* Siswa Aktif */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Siswa Aktif</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">{activeCount}</h3>
            <p className="text-xs text-emerald-600 mt-1 font-bold">
              {total > 0 ? Math.round((activeCount / total) * 100) : 0}% Tingkat Keaktifan
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck className="w-7 h-7" />
          </div>
        </div>

        {/* Rasio Gender Siswa */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Komposisi Gender</p>
            <span className="text-[11px] font-mono font-bold text-slate-500">{maleCount}L &bull; {femaleCount}P</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-blue-600 font-mono">{malePercent}%</span>
            <span className="text-xs font-bold text-slate-400">/</span>
            <span className="text-2xl font-extrabold text-pink-600 font-mono">{femalePercent}%</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 flex overflow-hidden mt-3">
            <div style={{ width: `${malePercent}%` }} className="bg-blue-500 h-full" title={`Laki-laki: ${maleCount}`} />
            <div style={{ width: `${femalePercent}%` }} className="bg-pink-500 h-full" title={`Perempuan: ${femaleCount}`} />
          </div>
        </div>

        {/* Tingkat Kelas */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Rombongan Belajar</p>
            <div className="flex items-center gap-3 mt-2 text-sm font-bold text-slate-800">
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">X: {kelas10Count}</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700">XI: {kelas11Count}</span>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700">XII: {kelas12Count}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Kelas 10, 11, dan 12</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <BookOpen className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Analytics & Quick Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Distribution & Recent Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Added Students */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Siswa Baru Ditambahkan
                </h3>
                <p className="text-xs text-slate-500">Pembaruan terkini dari buku registrasi sekolah</p>
              </div>
              <button
                onClick={onViewList}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                Lihat Semua ({total}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentStudents.map((s) => (
                <div
                  key={s.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={s.fotoUrl}
                      alt={s.namaLengkap}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4
                        onClick={() => onSelectStudent(s)}
                        className="text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer truncate"
                      >
                        {s.namaLengkap}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        NISN: {s.nisn} &bull; <span className="font-semibold text-slate-700">{s.kelas}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.jenisKelamin === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                      }`}
                    >
                      {s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                    <button
                      onClick={() => onSelectStudent(s)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                      title="Lihat Detail Siswa"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Jurusan Distribution & Fast Shortcuts */}
        <div className="space-y-6">
          {/* Jurusan Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Sebaran Program Keahlian / Jurusan
            </h3>
            <p className="text-xs text-slate-500 mb-4">Jumlah siswa per peminatan jurusan</p>

            <div className="space-y-3">
              {sortedJurusan.map(([jurusan, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={jurusan} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span className="truncate max-w-[200px]">{jurusan}</span>
                      <span className="font-mono font-bold text-indigo-600">{count} Siswa ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="bg-indigo-600 h-full rounded-full transition-all"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-lg space-y-4">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Pusat Administrasi & Arsip</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Akses cepat laporan dan pencetakan kartu tanda siswa resmi.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={onOpenGoogleSheetModal}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/40 text-xs font-bold text-emerald-200 transition-colors border border-emerald-500/40"
              >
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Sinkronisasi Google Sheet (Webhook)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
              </button>

              <button
                onClick={onViewCards}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors border border-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-purple-300" />
                  <span>Cetak Kartu Tanda Siswa (KTS)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </button>

              <button
                onClick={onExportCSV}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors border border-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-emerald-300" />
                  <span>Ekspor Seluruh Data ke Excel / CSV</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </button>

              <button
                onClick={onPrintReport}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors border border-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-blue-300" />
                  <span>Cetak Rekapitulasi Data Siswa</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
