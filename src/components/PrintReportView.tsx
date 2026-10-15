import React from 'react';
import { Printer, ArrowLeft, Download } from 'lucide-react';
import { Student, SchoolInfo } from '../types/student';

interface PrintReportViewProps {
  students: Student[];
  schoolInfo: SchoolInfo;
  onBack: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  students,
  schoolInfo,
  onBack,
}) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
    <div className="min-h-screen bg-slate-100 py-6 px-4">
      {/* Top Floating Control Bar (Hidden on print) */}
      <div className="max-w-5xl mx-auto mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-md flex items-center justify-between no-print">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Aplikasi</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Sekarang (PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (Simulated A4 Paper) */}
      <div className="max-w-5xl mx-auto bg-white p-8 sm:p-12 shadow-xl rounded-xl border border-slate-200 text-slate-900 print:shadow-none print:border-none print:p-0">
        {/* Kop Surat Resmi */}
        <div className="text-center pb-4 border-b-4 border-double border-slate-900 relative">
          <div className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-700">
            PEMERINTAH PROVINSI / DAERAH KHUSUS
          </div>
          <div className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-700">
            DINAS PENDIDIKAN & KEBUDAYAAN
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase mt-0.5">
            {schoolInfo.namaSekolah}
          </div>
          <div className="text-xs text-slate-600 font-medium mt-1">
            {schoolInfo.alamatSekolah} &bull; NPSN: {schoolInfo.npsn} &bull; Akreditasi: {schoolInfo.akreditasi}
          </div>
        </div>

        {/* Judul Laporan */}
        <div className="text-center my-6">
          <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide underline underline-offset-4">
            DAFTAR REKAPITULASI BUKU INDUK SISWA
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Tahun Ajaran {schoolInfo.tahunAjaranAktif} &bull; Jumlah: {students.length} Siswa Terdaftar
          </p>
        </div>

        {/* Tabel Rekapitulasi */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-300 text-[11px] sm:text-xs">
            <thead>
              <tr className="bg-slate-100 font-bold uppercase text-slate-700 border-b border-slate-300">
                <th className="p-2 border border-slate-300 w-8 text-center">No</th>
                <th className="p-2 border border-slate-300 w-24">NISN / NIS</th>
                <th className="p-2 border border-slate-300">Nama Lengkap Siswa</th>
                <th className="p-2 border border-slate-300 w-12 text-center">L/P</th>
                <th className="p-2 border border-slate-300">Tempat, Tgl Lahir</th>
                <th className="p-2 border border-slate-300">Kelas & Jurusan</th>
                <th className="p-2 border border-slate-300">Nama Orang Tua</th>
                <th className="p-2 border border-slate-300">No. HP Ortu</th>
                <th className="p-2 border border-slate-300 w-16 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.map((student, idx) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="p-2 border border-slate-300 text-center font-bold">
                    {idx + 1}
                  </td>
                  <td className="p-2 border border-slate-300 font-mono">
                    <div className="font-bold">{student.nisn}</div>
                    <div className="text-[10px] text-slate-500">{student.nis}</div>
                  </td>
                  <td className="p-2 border border-slate-300 font-bold text-slate-900">
                    {student.namaLengkap}
                  </td>
                  <td className="p-2 border border-slate-300 text-center font-bold">
                    {student.jenisKelamin}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {student.tempatLahir}, {formatDateIndo(student.tanggalLahir)}
                  </td>
                  <td className="p-2 border border-slate-300">
                    <div className="font-bold">{student.kelas}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{student.jurusan}</div>
                  </td>
                  <td className="p-2 border border-slate-300">
                    {student.namaAyah || student.namaIbu || '-'}
                  </td>
                  <td className="p-2 border border-slate-300 font-mono text-[10px]">
                    {student.noHpOrtu}
                  </td>
                  <td className="p-2 border border-slate-300 text-center font-bold">
                    {student.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tanda Tangan Pengesahan */}
        <div className="mt-12 flex justify-between items-start text-xs sm:text-sm text-slate-800">
          <div className="text-center w-48">
            <p>Mengetahui,</p>
            <p className="font-semibold">Petugas Tata Usaha</p>
            <div className="h-20" />
            <p className="font-bold underline">Hj. Nuraini, S.AP.</p>
            <p className="text-[11px] font-mono text-slate-600">NIP. 19820314 200604 2 008</p>
          </div>

          <div className="text-center w-56">
            <p>Jakarta, {currentDate}</p>
            <p className="font-semibold">Kepala Sekolah</p>
            <div className="h-20" />
            <p className="font-bold underline">{schoolInfo.kepalaSekolah}</p>
            <p className="text-[11px] font-mono text-slate-600">NIP. {schoolInfo.nipKepalaSekolah}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
