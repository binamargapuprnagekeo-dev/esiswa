import { Student, SchoolInfo } from '../types/student';
import { INITIAL_STUDENTS, DEFAULT_SCHOOL_INFO } from '../data/initialStudents';

const STORAGE_KEY_STUDENTS = 'siswaku_students_data_v1';
const STORAGE_KEY_SCHOOL = 'siswaku_school_info_v1';

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_STUDENTS;
  } catch (e) {
    console.error('Failed reading students from localStorage', e);
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Failed saving students to localStorage', e);
  }
}

export function getStoredSchoolInfo(): SchoolInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SCHOOL);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SCHOOL, JSON.stringify(DEFAULT_SCHOOL_INFO));
      return DEFAULT_SCHOOL_INFO;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading school info', e);
    return DEFAULT_SCHOOL_INFO;
  }
}

export function saveSchoolInfo(info: SchoolInfo): void {
  try {
    localStorage.setItem(STORAGE_KEY_SCHOOL, JSON.stringify(info));
  } catch (e) {
    console.error('Failed saving school info', e);
  }
}

export function resetToDefaultData(): Student[] {
  localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  localStorage.setItem(STORAGE_KEY_SCHOOL, JSON.stringify(DEFAULT_SCHOOL_INFO));
  return INITIAL_STUDENTS;
}

export function exportToCSV(students: Student[]): void {
  const headers = [
    'NISN',
    'NIS',
    'Nama Lengkap',
    'Panggilan',
    'L/P',
    'Tempat Lahir',
    'Tanggal Lahir',
    'Agama',
    'Kelas',
    'Tingkat',
    'Jurusan',
    'Tahun Ajaran',
    'Status',
    'No Telepon/WA',
    'Email',
    'Alamat',
    'Kota/Kabupaten',
    'Nama Ayah',
    'Nama Ibu',
    'Pekerjaan Ortu',
    'No HP Ortu',
    'Ekstrakurikuler',
    'Catatan Khusus',
  ];

  const escapeCSV = (val: unknown) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = students.map((s) => [
    escapeCSV(s.nisn),
    escapeCSV(s.nis),
    escapeCSV(s.namaLengkap),
    escapeCSV(s.namaPanggilan),
    escapeCSV(s.jenisKelamin),
    escapeCSV(s.tempatLahir),
    escapeCSV(s.tanggalLahir),
    escapeCSV(s.agama),
    escapeCSV(s.kelas),
    escapeCSV(s.tingkatKelas),
    escapeCSV(s.jurusan),
    escapeCSV(s.tahunAjaran),
    escapeCSV(s.status),
    escapeCSV(s.telepon),
    escapeCSV(s.email),
    escapeCSV(s.alamat),
    escapeCSV(s.kabupatenKota),
    escapeCSV(s.namaAyah),
    escapeCSV(s.namaIbu),
    escapeCSV(s.pekerjaanOrtu),
    escapeCSV(s.noHpOrtu),
    escapeCSV(s.ekstrakurikuler ? s.ekstrakurikuler.join('; ') : ''),
    escapeCSV(s.catatanKhusus || ''),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Data_Siswa_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(students: Student[]): void {
  const jsonContent = JSON.stringify(students, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Backup_Data_Siswa_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
