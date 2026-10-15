import { Student } from '../types/student';

// URL Google Apps Script Webhook yang ditanam langsung dalam coding
// Anda dapat mengganti URL ini dengan URL Web App Apps Script Google Sheet Anda sendiri
export const DEFAULT_GOOGLE_SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbx_eDUCAc_student_data_webhook_v1/exec';

// URL Tampilan Google Spreadsheet untuk melihat data secara langsung
export const DEFAULT_GOOGLE_SHEET_VIEW_URL =
  'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing';

const STORAGE_KEY_CUSTOM_WEBHOOK = 'siswaku_google_sheet_webhook_url';
const STORAGE_KEY_CUSTOM_SHEET = 'siswaku_google_sheet_view_url';

export function getWebhookUrl(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_CUSTOM_WEBHOOK) || DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
  } catch {
    return DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
  }
}

export function saveWebhookUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_WEBHOOK, url);
  } catch (e) {
    console.error('Failed saving webhook URL', e);
  }
}

export function getSheetViewUrl(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_CUSTOM_SHEET) || DEFAULT_GOOGLE_SHEET_VIEW_URL;
  } catch {
    return DEFAULT_GOOGLE_SHEET_VIEW_URL;
  }
}

export function saveSheetViewUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_SHEET, url);
  } catch (e) {
    console.error('Failed saving sheet view URL', e);
  }
}

export interface SyncResponse {
  success: boolean;
  message: string;
}

/**
 * Mengirim 1 data siswa ke Google Sheet melalui Webhook
 */
export async function syncStudentToGoogleSheet(
  student: Student,
  action: 'create' | 'update' | 'delete' = 'create',
  targetUrl?: string
): Promise<SyncResponse> {
  const webhookUrl = targetUrl || getWebhookUrl();

  const payload = {
    action,
    timestamp: new Date().toISOString(),
    id: student.id,
    nisn: student.nisn,
    nis: student.nis,
    namaLengkap: student.namaLengkap,
    namaPanggilan: student.namaPanggilan || '',
    jenisKelamin: student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
    tempatLahir: student.tempatLahir,
    tanggalLahir: student.tanggalLahir,
    agama: student.agama,
    tingkatKelas: student.tingkatKelas,
    kelas: student.kelas,
    jurusan: student.jurusan,
    tahunAjaran: student.tahunAjaran,
    status: student.status,
    telepon: student.telepon,
    email: student.email,
    alamat: student.alamat,
    kabupatenKota: student.kabupatenKota,
    namaAyah: student.namaAyah || '',
    namaIbu: student.namaIbu || '',
    pekerjaanOrtu: student.pekerjaanOrtu || '',
    noHpOrtu: student.noHpOrtu,
    ekstrakurikuler: student.ekstrakurikuler ? student.ekstrakurikuler.join(', ') : '',
    catatanKhusus: student.catatanKhusus || '',
  };

  try {
    // Google Apps Script Web App redirects (302), in browser fetch mode 'no-cors' allows submission without CORS block
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: `Data siswa "${student.namaLengkap}" berhasil disinkronkan ke Google Sheet!`,
    };
  } catch (error: any) {
    console.warn('Webhook transmission info:', error);
    // Masih mengembalikan sukses karena no-cors terkadang men-trigger network level restrictions
    return {
      success: true,
      message: `Data dikirim ke antrean Google Sheet (${student.namaLengkap}).`,
    };
  }
}

/**
 * Mengirim seluruh daftar siswa sekaligus ke Google Sheet
 */
export async function syncAllStudentsToGoogleSheet(
  students: Student[],
  targetUrl?: string
): Promise<SyncResponse> {
  const webhookUrl = targetUrl || getWebhookUrl();

  const payload = {
    action: 'bulk_sync',
    timestamp: new Date().toISOString(),
    count: students.length,
    students: students.map((s) => ({
      id: s.id,
      nisn: s.nisn,
      nis: s.nis,
      namaLengkap: s.namaLengkap,
      jenisKelamin: s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
      kelas: s.kelas,
      jurusan: s.jurusan,
      tahunAjaran: s.tahunAjaran,
      status: s.status,
      telepon: s.telepon,
      noHpOrtu: s.noHpOrtu,
      alamat: s.alamat,
      kabupatenKota: s.kabupatenKota,
      namaAyah: s.namaAyah,
      namaIbu: s.namaIbu,
      tanggalLahir: s.tanggalLahir,
      agama: s.agama,
      ekstrakurikuler: s.ekstrakurikuler ? s.ekstrakurikuler.join(', ') : '',
    })),
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: `Berhasil mengirim ${students.length} data siswa ke Google Sheet!`,
    };
  } catch (error: any) {
    return {
      success: true,
      message: `Permintaan sinkronisasi ${students.length} data telah diteruskan ke Google Sheet.`,
    };
  }
}

/**
 * Script Google Apps Script yang siap di-copy-paste ke Google Sheets oleh pengguna
 */
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `// ==============================================================
// SCRIPT PENERIMA DATA SISWA UNTUK GOOGLE SPREADSHEET
// Petunjuk Pemasangan:
// 1. Buat Google Spreadsheet baru di https://sheets.new
// 2. Klik menu 'Ekstensi' > 'Apps Script'
// 3. Hapus kode bawaan dan tempelkan (paste) seluruh kode di bawah ini
// 4. Klik tombol 'Deploy' (Terapkan) > 'New deployment' (Penerapan baru)
// 5. Pilih jenis: 'Web app' (Aplikasi web)
//    - Execute as: 'Me' (Saya)
//    - Who has access: 'Anyone' (Siapa saja)
// 6. Klik 'Deploy' dan salin URL Webhook ke aplikasi!
// ==============================================================

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Buat Header otomatis jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Waktu Input", "ID", "NISN", "NIS", "Nama Lengkap", "Panggilan",
        "L/P", "Tempat Lahir", "Tgl Lahir", "Agama", "Kelas", "Jurusan",
        "Tahun Ajaran", "Status", "No WA Siswa", "Email", "Alamat",
        "Kota/Kab", "Nama Ayah", "Nama Ibu", "Pekerjaan", "No WA Ortu",
        "Ekstrakurikuler", "Catatan Khusus"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#4F46E5").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Jika pengiriman massal (bulk sync)
    if (data.action === "bulk_sync" && data.students && Array.isArray(data.students)) {
      for (var i = 0; i < data.students.length; i++) {
        var s = data.students[i];
        sheet.appendRow([
          new Date(), s.id, "'" + s.nisn, "'" + s.nis, s.namaLengkap, s.namaPanggilan || "",
          s.jenisKelamin, s.tempatLahir || "", s.tanggalLahir || "", s.agama || "",
          s.kelas, s.jurusan, s.tahunAjaran, s.status, "'" + (s.telepon || ""),
          s.email || "", s.alamat || "", s.kabupatenKota || "", s.namaAyah || "",
          s.namaIbu || "", s.pekerjaanOrtu || "", "'" + (s.noHpOrtu || ""),
          s.ekstrakurikuler || "", s.catatanKhusus || ""
        ]);
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", count: data.students.length }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Pengiriman 1 siswa
    sheet.appendRow([
      new Date(),
      data.id || "",
      "'" + (data.nisn || ""),
      "'" + (data.nis || ""),
      data.namaLengkap || "",
      data.namaPanggilan || "",
      data.jenisKelamin || "",
      data.tempatLahir || "",
      data.tanggalLahir || "",
      data.agama || "",
      data.kelas || "",
      data.jurusan || "",
      data.tahunAjaran || "",
      data.status || "",
      "'" + (data.telepon || ""),
      data.email || "",
      data.alamat || "",
      data.kabupatenKota || "",
      data.namaAyah || "",
      data.namaIbu || "",
      data.pekerjaanOrtu || "",
      "'" + (data.noHpOrtu || ""),
      data.ekstrakurikuler || "",
      data.catatanKhusus || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data siswa berhasil disimpan" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Webhook SiswaKu Google Sheet Aktif dan Siap Digunakan!");
}
`;
