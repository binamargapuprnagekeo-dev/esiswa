export type Gender = 'L' | 'P';

export type StudentStatus = 'Aktif' | 'Pindahan' | 'Alumni' | 'Non-Aktif';

export type Religion = 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';

export interface Student {
  id: string;
  nisn: string; // 10 digit
  nis: string;
  namaLengkap: string;
  namaPanggilan: string;
  jenisKelamin: Gender;
  tempatLahir: string;
  tanggalLahir: string;
  agama: Religion;
  tingkatKelas: '10' | '11' | '12';
  kelas: string; // e.g. 'X-RPL 1', 'XI-MIPA 2'
  jurusan: string;
  tahunAjaran: string; // e.g. '2024/2025'
  status: StudentStatus;
  telepon: string;
  email: string;
  alamat: string;
  kabupatenKota: string;
  provinsi: string;
  namaAyah: string;
  namaIbu: string;
  pekerjaanOrtu: string;
  noHpOrtu: string;
  fotoUrl: string;
  ekstrakurikuler: string[];
  catatanKhusus?: string;
  createdAt: string;
  updatedAt: string;
}

export type StudentFormData = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;

export interface SchoolInfo {
  namaSekolah: string;
  npsn: string;
  alamatSekolah: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  akreditasi: string;
  tahunAjaranAktif: string;
}
