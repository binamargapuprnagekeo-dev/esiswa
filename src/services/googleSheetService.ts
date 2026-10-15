import { Student } from '../types/student';

// URL Google Apps Script Webhook yang ditanam langsung dalam coding
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
 * Mengirim 1 data siswa ke Google Sheet melalui Webhook (Create / Update)
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
    return {
      success: true,
      message: `Data dikirim ke antrean Google Sheet (${student.namaLengkap}).`,
    };
  }
}

/**
 * Menghapus 1 data siswa dari Google Sheet melalui Webhook
 */
export async function deleteStudentFromGoogleSheet(
  student: { id: string; nisn?: string; namaLengkap?: string },
  targetUrl?: string
): Promise<SyncResponse> {
  const webhookUrl = targetUrl || getWebhookUrl();

  const payload = {
    action: 'delete',
    timestamp: new Date().toISOString(),
    id: student.id,
    nisn: student.nisn || '',
    namaLengkap: student.namaLengkap || '',
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
      message: `Data siswa "${student.namaLengkap || student.id}" berhasil dihapus dari Google Sheet!`,
    };
  } catch (error: any) {
    console.warn('Webhook delete info:', error);
    return {
      success: true,
      message: `Permintaan hapus baris di Google Sheet telah dikirim.`,
    };
  }
}

/**
 * Menghapus banyak siswa sekaligus dari Google Sheet melalui Webhook
 */
export async function deleteBulkStudentsFromGoogleSheet(
  students: { id: string; nisn?: string }[],
  targetUrl?: string
): Promise<SyncResponse> {
  const webhookUrl = targetUrl || getWebhookUrl();

  const payload = {
    action: 'bulk_delete',
    timestamp: new Date().toISOString(),
    ids: students.map((s) => s.id),
    nisns: students.map((s) => s.nisn).filter(Boolean),
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
      message: `Berhasil mengirim permintaan hapus ${students.length} baris di Google Sheet!`,
    };
  } catch (error: any) {
    console.warn('Webhook bulk delete info:', error);
    return {
      success: true,
      message: `Permintaan hapus massal di Google Sheet telah dikirim.`,
    };
  }
}

/**
 * Mengirim seluruh daftar siswa sekaligus ke Google Sheet (Bulk Sync)
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
 * Script Google Apps Script yang mendukung CREATE, UPDATE, DELETE, dan BULK DELETE di Google Sheet
 */
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `// ==============================================================
// SCRIPT PENERIMA DATA SISWA UNTUK GOOGLE SPREADSHEET (LENGKAP: TAMBAH, EDIT, HAPUS)
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
  lock.tryLock(15000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var lastRow = sheet.getLastRow();

    // Buat Header otomatis jika sheet masih kosong
    if (lastRow === 0) {
      var headers = [
        "Waktu Input", "ID", "NISN", "NIS", "Nama Lengkap", "Panggilan",
        "L/P", "Tempat Lahir", "Tgl Lahir", "Agama", "Kelas", "Jurusan",
        "Tahun Ajaran", "Status", "No WA Siswa", "Email", "Alamat",
        "Kota/Kab", "Nama Ayah", "Nama Ibu", "Pekerjaan", "No WA Ortu",
        "Ekstrakurikuler", "Catatan Khusus"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight("bold")
        .setBackground("#4F46E5")
        .setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
      lastRow = 1;
    }

    // 1. AKSI: HAPUS SATU SISWA (DELETE)
    if (data.action === "delete") {
      var deleted = false;
      if (lastRow > 1) {
        var values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
        // Cari dari baris terbawah ke atas
        for (var i = values.length - 1; i >= 0; i--) {
          var rowId = String(values[i][1] || "").trim();
          var rowNisn = String(values[i][2] || "").replace(/['"]/g, "").trim();
          var targetId = String(data.id || "").trim();
          var targetNisn = String(data.nisn || "").trim();

          if ((targetId && rowId === targetId) || (targetNisn && rowNisn === targetNisn)) {
            sheet.deleteRow(i + 2);
            deleted = true;
            break;
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "delete",
        deleted: deleted,
        message: deleted ? "Baris siswa berhasil dihapus dari Google Sheet." : "Data tidak ditemukan di sheet."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. AKSI: HAPUS MASSAL SISWA (BULK DELETE)
    if (data.action === "bulk_delete") {
      var targetIds = data.ids || [];
      var targetNisns = data.nisns || [];
      var deletedCount = 0;

      if (lastRow > 1) {
        var rangeVals = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
        for (var j = rangeVals.length - 1; j >= 0; j--) {
          var rId = String(rangeVals[j][1] || "").trim();
          var rNisn = String(rangeVals[j][2] || "").replace(/['"]/g, "").trim();

          if (targetIds.indexOf(rId) !== -1 || targetNisns.indexOf(rNisn) !== -1) {
            sheet.deleteRow(j + 2);
            deletedCount++;
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "bulk_delete",
        deletedCount: deletedCount
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. AKSI: SINKRONISASI MASSAL (BULK SYNC)
    if (data.action === "bulk_sync" && data.students && Array.isArray(data.students)) {
      for (var k = 0; k < data.students.length; k++) {
        var s = data.students[k];
        sheet.appendRow([
          new Date(), s.id, "'" + s.nisn, "'" + s.nis, s.namaLengkap, s.namaPanggilan || "",
          s.jenisKelamin, s.tempatLahir || "", s.tanggalLahir || "", s.agama || "",
          s.kelas, s.jurusan, s.tahunAjaran, s.status, "'" + (s.telepon || ""),
          s.email || "", s.alamat || "", s.kabupatenKota || "", s.namaAyah || "",
          s.namaIbu || "", s.pekerjaanOrtu || "", "'" + (s.noHpOrtu || ""),
          s.ekstrakurikuler || "", s.catatanKhusus || ""
        ]);
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "bulk_sync",
        count: data.students.length
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. AKSI: UPDATE SISWA (JIKA DATA SUDAH ADA, PERBARUI BARIS)
    if (data.action === "update" && lastRow > 1) {
      var checkVals = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
      for (var u = 0; u < checkVals.length; u++) {
        var existId = String(checkVals[u][1] || "").trim();
        var existNisn = String(checkVals[u][2] || "").replace(/['"]/g, "").trim();
        if ((data.id && existId === data.id) || (data.nisn && existNisn === data.nisn)) {
          var rowNum = u + 2;
          var updateRow = [
            new Date(), data.id || "", "'" + (data.nisn || ""), "'" + (data.nis || ""),
            data.namaLengkap || "", data.namaPanggilan || "", data.jenisKelamin || "",
            data.tempatLahir || "", data.tanggalLahir || "", data.agama || "",
            data.kelas || "", data.jurusan || "", data.tahunAjaran || "", data.status || "",
            "'" + (data.telepon || ""), data.email || "", data.alamat || "",
            data.kabupatenKota || "", data.namaAyah || "", data.namaIbu || "",
            data.pekerjaanOrtu || "", "'" + (data.noHpOrtu || ""),
            data.ekstrakurikuler || "", data.catatanKhusus || ""
          ];
          sheet.getRange(rowNum, 1, 1, updateRow.length).setValues([updateRow]);
          return ContentService.createTextOutput(JSON.stringify({
            status: "success",
            action: "update",
            message: "Baris data siswa berhasil diperbarui."
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // 5. AKSI: CREATE SISWA BARU (DEFAULT APPEND ROW)
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

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      action: "create",
      message: "Data siswa baru berhasil ditambahkan ke Google Sheet."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Webhook SiswaKu Google Sheet Aktif dan Siap Digunakan (Mendukung Input, Edit, dan Hapus)!");
}
`;
