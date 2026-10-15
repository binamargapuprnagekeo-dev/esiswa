import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Eye, 
  CreditCard, 
  Printer, 
  Download, 
  ChevronDown, 
  CheckSquare, 
  Square, 
  LayoutList, 
  LayoutGrid, 
  UserPlus, 
  GraduationCap, 
  Phone, 
  MapPin, 
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  FileSpreadsheet
} from 'lucide-react';
import { Student, Gender, StudentStatus } from '../types/student';
import { LIST_JURUSAN } from '../data/initialStudents';

interface StudentListProps {
  students: Student[];
  onAddNew: () => void;
  onEdit: (student: Student) => void;
  onViewDetail: (student: Student) => void;
  onPrintCard: (student: Student) => void;
  onDelete: (studentId: string) => void;
  onBulkDelete: (studentIds: string[]) => void;
  onExportCSV: (selectedStudents?: Student[]) => void;
  onPrintReport: () => void;
  onOpenGoogleSheet?: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  onAddNew,
  onEdit,
  onViewDetail,
  onPrintCard,
  onDelete,
  onBulkDelete,
  onExportCSV,
  onPrintReport,
  onOpenGoogleSheet,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTingkat, setFilterTingkat] = useState<string>('all');
  const [filterJurusan, setFilterJurusan] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'nama-asc' | 'nama-desc' | 'nisn-asc' | 'date-desc'>('date-desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Filtered and Sorted Students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        // Search term matching
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchNama = s.namaLengkap.toLowerCase().includes(q);
          const matchNisn = s.nisn.includes(q);
          const matchNis = s.nis.toLowerCase().includes(q);
          const matchKelas = s.kelas.toLowerCase().includes(q);
          const matchAlamat = s.alamat.toLowerCase().includes(q);
          if (!matchNama && !matchNisn && !matchNis && !matchKelas && !matchAlamat) {
            return false;
          }
        }

        // Tingkat filter
        if (filterTingkat !== 'all' && s.tingkatKelas !== filterTingkat) {
          return false;
        }

        // Jurusan filter
        if (filterJurusan !== 'all' && s.jurusan !== filterJurusan) {
          return false;
        }

        // Gender filter
        if (filterGender !== 'all' && s.jenisKelamin !== filterGender) {
          return false;
        }

        // Status filter
        if (filterStatus !== 'all' && s.status !== filterStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nama-asc') {
          return a.namaLengkap.localeCompare(b.namaLengkap);
        }
        if (sortBy === 'nama-desc') {
          return b.namaLengkap.localeCompare(a.namaLengkap);
        }
        if (sortBy === 'nisn-asc') {
          return a.nisn.localeCompare(b.nisn);
        }
        // date-desc default
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [students, searchTerm, filterTingkat, filterJurusan, filterGender, filterStatus, sortBy]);

  // Selection handlers
  const isAllSelected = filteredStudents.length > 0 && selectedIds.length === filteredStudents.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterTingkat('all');
    setFilterJurusan('all');
    setFilterGender('all');
    setFilterStatus('all');
    setSortBy('date-desc');
  };

  const selectedStudentsData = useMemo(() => {
    return students.filter((s) => selectedIds.includes(s.id));
  }, [students, selectedIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Buku Induk & Data Siswa</span>
            <span className="px-3 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200/60">
              {filteredStudents.length} dari {students.length} Siswa
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola arsip kesiswaan, lakukan pencarian, cetak kartu pelajar, dan ekspor data ke Excel/CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onPrintReport}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
            title="Cetak format laporan rekapitulasi siswa siap cetak"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Rekap</span>
          </button>

          <button
            onClick={() => onExportCSV()}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
            title="Unduh seluruh data siswa dalam format CSV Excel"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Unduh Excel</span>
          </button>

          {onOpenGoogleSheet && (
            <button
              onClick={onOpenGoogleSheet}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold transition-colors shadow-2xs"
              title="Sinkronisasi Google Sheet Webhook"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Google Sheet</span>
            </button>
          )}

          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-indigo-300 transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Input Siswa Baru</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Section */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Row 1: Search & View Mode Switch */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan Nama, NISN, NIS, Kelas, atau Alamat..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                Hapus
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Urutkan data siswa"
                className="w-full appearance-none px-4 py-3 pr-9 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="date-desc">Terbaru Didaftarkan</option>
                <option value="nama-asc">Nama (A - Z)</option>
                <option value="nama-desc">Nama (Z - A)</option>
                <option value="nisn-asc">NISN Terkecil</option>
              </select>
              <ArrowUpDown className="w-4 h-4 absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                aria-label="Tampilan Tabel"
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Tabel"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Tampilan Kartu Grid"
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Grid Card"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Tingkat */}
          <select
            value={filterTingkat}
            onChange={(e) => setFilterTingkat(e.target.value)}
            aria-label="Filter berdasarkan tingkat kelas"
            className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <option value="all">Semua Tingkat</option>
            <option value="10">Kelas 10</option>
            <option value="11">Kelas 11</option>
            <option value="12">Kelas 12</option>
          </select>

          {/* Jurusan */}
          <select
            value={filterJurusan}
            onChange={(e) => setFilterJurusan(e.target.value)}
            aria-label="Filter berdasarkan jurusan atau peminatan"
            className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer max-w-[200px] truncate"
          >
            <option value="all">Semua Jurusan</option>
            {LIST_JURUSAN.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>

          {/* Gender */}
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            aria-label="Filter berdasarkan jenis kelamin"
            className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <option value="all">Semua Gender</option>
            <option value="L">Laki-laki (L)</option>
            <option value="P">Perempuan (P)</option>
          </select>

          {/* Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter berdasarkan status keaktifan siswa"
            className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Pindahan">Pindahan</option>
            <option value="Alumni">Alumni</option>
            <option value="Non-Aktif">Non-Aktif</option>
          </select>

          {(filterTingkat !== 'all' || filterJurusan !== 'all' || filterGender !== 'all' || filterStatus !== 'all' || searchTerm) && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold ml-auto px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Bulk Action Bar (When items are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-900 text-white px-5 py-3 rounded-2xl flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-bold">
              {selectedIds.length} siswa terpilih
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onExportCSV(selectedStudentsData)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Ekspor Terpilih
            </button>

            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus Terpilih
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-indigo-200 hover:text-white px-2 py-1"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Tidak Ada Data Siswa Ditemukan</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {searchTerm || filterTingkat !== 'all' || filterJurusan !== 'all'
              ? 'Coba sesuaikan kata kunci pencarian atau bersihkan filter yang aktif.'
              : 'Belum ada data siswa yang diinputkan ke sistem. Mulai tambahkan sekarang!'}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {(searchTerm || filterTingkat !== 'all' || filterJurusan !== 'all') ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              >
                Bersihkan Filter
              </button>
            ) : null}
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Input Siswa Pertama
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-4 px-4 w-12 text-center">
                    <button
                      onClick={handleToggleSelectAll}
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-4 px-4">Siswa</th>
                  <th className="py-4 px-4">NISN / NIS</th>
                  <th className="py-4 px-4">Kelas & Jurusan</th>
                  <th className="py-4 px-4">Jenis Kelamin</th>
                  <th className="py-4 px-4">Kontak Siswa / Ortu</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.map((student) => {
                  const isSelected = selectedIds.includes(student.id);
                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-indigo-50/30 transition-colors ${
                        isSelected ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleSelectOne(student.id)}
                          className="text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Siswa (Foto & Nama) */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.fotoUrl}
                            alt={student.namaLengkap}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div>
                            <button
                              onClick={() => onViewDetail(student)}
                              className="font-bold text-slate-900 hover:text-indigo-600 text-left transition-colors flex items-center gap-1.5"
                            >
                              <span>{student.namaLengkap}</span>
                            </button>
                            <p className="text-xs text-slate-500">
                              Panggilan: <span className="font-medium text-slate-700">{student.namaPanggilan || '-'}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* NISN / NIS */}
                      <td className="py-4 px-4">
                        <div className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                          {student.nisn}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 font-mono">
                          NIS: {student.nis}
                        </div>
                      </td>

                      {/* Kelas & Jurusan */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800 text-xs sm:text-sm">
                          {student.kelas}
                        </div>
                        <div className="text-xs text-slate-500 max-w-xs truncate" title={student.jurusan}>
                          {student.jurusan}
                        </div>
                      </td>

                      {/* Gender */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            student.jenisKelamin === 'L'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                              : 'bg-pink-50 text-pink-700 border border-pink-200/60'
                          }`}
                        >
                          {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </td>

                      {/* Kontak */}
                      <td className="py-4 px-4">
                        <div className="text-xs font-medium text-slate-700 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{student.telepon || student.noHpOrtu}</span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 max-w-[150px] truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{student.kabupatenKota}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            student.status === 'Aktif'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : student.status === 'Pindahan'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>

                      {/* Aksi Buttons */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewDetail(student)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Lihat Detail Buku Induk"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onPrintCard(student)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                            title="Cetak Kartu Tanda Siswa (KTS)"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onEdit(student)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Data Siswa"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setConfirmDeleteId(student.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARD VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            const isSelected = selectedIds.includes(student.id);
            return (
              <div
                key={student.id}
                className={`bg-white rounded-3xl p-5 border transition-all duration-200 hover:shadow-md relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                    : 'border-slate-200/80'
                }`}
              >
                <div>
                  {/* Card Top: Checkbox, Status & Class */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => handleToggleSelectOne(student.id)}
                      className="text-slate-400 hover:text-indigo-600"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700">
                        {student.kelas}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          student.status === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {student.status}
                      </span>
                    </div>
                  </div>

                  {/* Student Profile Info */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <img
                      src={student.fotoUrl}
                      alt={student.namaLengkap}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-2xs shrink-0"
                    />
                    <div>
                      <h3
                        onClick={() => onViewDetail(student)}
                        className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer text-sm leading-tight line-clamp-1"
                      >
                        {student.namaLengkap}
                      </h3>
                      <p className="text-xs font-mono font-semibold text-indigo-600 mt-1">
                        NISN: {student.nisn}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {student.jurusan}
                      </p>
                    </div>
                  </div>

                  {/* Details Badges */}
                  <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gender:</span>
                      <span className="font-semibold text-slate-800">
                        {student.jenisKelamin === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Orang Tua / Wali:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                        {student.namaAyah || student.namaIbu || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">No. Kontak:</span>
                      <span className="font-medium text-slate-800">
                        {student.telepon || student.noHpOrtu}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between gap-2 pt-4 mt-2">
                  <button
                    onClick={() => onPrintCard(student)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    KTS
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewDetail(student)}
                      className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(student)}
                      className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Data"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(student.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus Siswa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SINGLE DELETE CONFIRMATION MODAL */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus Data Siswa</h3>
            <p className="text-sm text-slate-500 mt-2">
              Apakah Anda yakin ingin menghapus data siswa ini dari sistem buku induk sekolah? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE CONFIRMATION MODAL */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Hapus {selectedIds.length} Data Siswa Sekaligus?
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Semua data siswa yang dicentang akan dihapus secara permanen dari penyimpanan browser.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onBulkDelete(selectedIds);
                  setSelectedIds([]);
                  setShowBulkDeleteConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Ya, Hapus Terpilih
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
