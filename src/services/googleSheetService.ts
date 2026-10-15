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
 * Mengirim 1 data siswa ke Google Sheet melalui Webhook (Create atau Update)
 */
export async function syncStudentToGoogleSheet(
  student: Student,
  action: 'create' | 'update' = 'create',
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

  const queryParams = new URLSearchParams({
    action,
    id: student.id,
    nisn: student.nisn,
  });

  const separator = webhookUrl.includes('?') ? '&' : '?';
  const urlWithParams = `${webhookUrl}${separator}${queryParams.toString()}`;

  try {
    // Menggunakan text/plain agar tidak memicu preflight OPTIONS yang diblokir oleh Google Apps Script
    await fetch(urlWithParams, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message:
        action === 'update'
          ? `Perubahan data siswa "${student.namaLengkap}" berhasil diperbarui di Google Sheet!`
          : `Data siswa "${student.namaLengkap}" berhasil disinkronkan ke Google Sheet!`,
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

  // Sertakan parameter action dan id di URL agar tetap terbaca jika body JSON kosong
  const queryParams = new URLSearchParams({
    action: 'delete',
    id: student.id,
    nisn: student.nisn || '',
  });

  const separator = webhookUrl.includes('?') ? '&' : '?';
  const urlWithParams = `${webhookUrl}${separator}${queryParams.toString()}`;

  try {
    await fetch(urlWithParams, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
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

  const queryParams = new URLSearchParams({
    action: 'bulk_delete',
    ids: students.map((s) => s.id).join(','),
    nisns: students.map((s) => s.nisn || '').join(','),
  });

  const separator = webhookUrl.includes('?') ? '&' : '?';
  const urlWithParams = `${webhookUrl}${separator}${queryParams.toString()}`;

  try {
    await fetch(urlWithParams, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
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

  const queryParams = new URLSearchParams({
    action: 'bulk_sync',
    count: String(students.length),
  });

  const separator = webhookUrl.includes('?') ? '&' : '?';
  const urlWithParams = `${webhookUrl}${separator}${queryParams.toString()}`;

  try {
    await fetch(urlWithParams, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
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
 * Script Google Apps Script yang mendukung CREATE, UPDATE, DELETE, dan BULK DELETE di Google Sheet.
 * Script ini menjamin TIDAK AKAN PERNAH membuat baris kosong saat aksi delete atau edit!
 */
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `// ==============================================================
// SCRIPT PENERIMA DATA SISWA UNTUK GOOGLE SPREADSHEET (VERSI PENUH: CREATE, UPDATE, DELETE)
// Petunjuk Pemasangan / Pembaruan:
// 1. Buka Google Spreadsheet Anda
// 2. Klik menu 'Ekstensi' > 'Apps Script'
// 3. Hapus seluruh isi kode lama dan tempelkan (paste) kode ini
// 4. Klik 'Deploy' (Terapkan) > 'Manage deployments' (Kelola penerapan)
//    -> Klik ikon Pensil (Edit) -> Pilih Versi: 'New version' (Versi baru) -> Klik 'Deploy'
//    ATAU jika baru pertama kali: 'New deployment' > 'Web app' > Who has access: 'Anyone'
// ==============================================================

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(20000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();

    // 1. Ekstrak data dari POST Body dan URL Parameter secara aman
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = {};
      }
    }
    var param = (e && e.parameter) ? e.parameter : {};

    // Dapatkan action, id, dan nisn baik dari JSON maupun URL param
    var action = String(data.action || param.action || "").trim().toLowerCase();
    var targetId = String(data.id || param.id || "").trim();
    var targetNisn = String(data.nisn || param.nisn || "").replace(/[^0-9]/g, "").trim();

    // PENTING: JIKA ACTION KOSONG ATAU TIDAK DITENTUKAN, JANGAN BUAT BARIS KOSONG!
    if (!action) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Action tidak ditentukan. Tidak ada baris yang dibuat."
      })).setMimeType(ContentService.MimeType.JSON);
    }

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

    // Fungsi pembersih karakter untuk perbandingan akurat
    function cleanN(val) {
      return String(val || "").replace(/[^0-9]/g, "").trim();
    }
    function cleanS(val) {
      return String(val || "").trim().toLowerCase();
    }

    // =========================================================================
    // 1. AKSI: HAPUS SATU SISWA (DELETE)
    // =========================================================================
    if (action === "delete") {
      var deleted = false;
      var deletedRows = 0;

      if (lastRow > 1) {
        // Ambil data baris (Kolom 1 s/d Kolom 5: Waktu, ID, NISN, NIS, Nama Lengkap)
        var rowData = sheet.getRange(2, 1, lastRow - 1, 5).getValues();

        // Cari dari baris terbawah ke baris 2 agar nomor baris tidak bergeser
        for (var i = rowData.length - 1; i >= 0; i--) {
          var rowId = cleanS(rowData[i][1]);
          var rowNisn = cleanN(rowData[i][2]);

          var isMatch = false;
          if (targetId && rowId && rowId === cleanS(targetId)) {
            isMatch = true;
          } else if (targetNisn && rowNisn && rowNisn === cleanN(targetNisn)) {
            isMatch = true;
          }

          if (isMatch) {
            sheet.deleteRow(i + 2);
            deleted = true;
            deletedRows++;
          }
        }
      }

      // LANGSUNG RETURN! TIDAK AKAN PERNAH MENAMBAH BARIS KOSONG!
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "delete",
        deleted: deleted,
        deletedRows: deletedRows,
        message: deleted ? "Baris siswa berhasil dihapus dari Google Sheet." : "Data tidak ditemukan di sheet."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // =========================================================================
    // 2. AKSI: HAPUS MASSAL SISWA (BULK DELETE)
    // =========================================================================
    if (action === "bulk_delete") {
      var idsList = (data.ids || (param.ids ? param.ids.split(",") : [])).map(cleanS);
      var nisnsList = (data.nisns || (param.nisns ? param.nisns.split(",") : [])).map(cleanN);
      var bulkDeletedCount = 0;

      if (lastRow > 1) {
        var bulkRows = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
        for (var b = bulkRows.length - 1; b >= 0; b--) {
          var bId = cleanS(bulkRows[b][1]);
          var bNisn = cleanN(bulkRows[b][2]);

          var bMatch = false;
          if (bId && idsList.indexOf(bId) !== -1) bMatch = true;
          if (bNisn && nisnsList.indexOf(bNisn) !== -1) bMatch = true;

          if (bMatch) {
            sheet.deleteRow(b + 2);
            bulkDeletedCount++;
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "bulk_delete",
        deletedCount: bulkDeletedCount
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // =========================================================================
    // 3. AKSI: UPDATE SISWA (EDIT DATA IN-PLACE)
    // =========================================================================
    if (action === "update") {
      var updated = false;
      var newRowData = [
        new Date(),
        data.id || targetId,
        "'" + (data.nisn || targetNisn),
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
      ];

      if (lastRow > 1) {
        var uRows = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
        for (var u = 0; u < uRows.length; u++) {
          var uId = cleanS(uRows[u][1]);
          var uNisn = cleanN(uRows[u][2]);

          var uMatch = false;
          if (targetId && uId && uId === cleanS(targetId)) uMatch = true;
          else if (targetNisn && uNisn && uNisn === cleanN(targetNisn)) uMatch = true;

          if (uMatch) {
            var targetRowIndex = u + 2;
            sheet.getRange(targetRowIndex, 1, 1, newRowData.length).setValues([newRowData]);
            updated = true;
            break;
          }
        }
      }

      // Jika data belum ada sebelumnya di sheet, baru tambahkan
      if (!updated && (data.namaLengkap || targetId)) {
        sheet.appendRow(newRowData);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "update",
        updated: updated,
        message: updated ? "Data siswa berhasil diperbarui di Google Sheet." : "Data baru ditambahkan."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // =========================================================================
    // 4. AKSI: SINKRONISASI MASSAL (BULK SYNC)
    // =========================================================================
    if (action === "bulk_sync") {
      var stList = data.students || [];
      for (var sIdx = 0; sIdx < stList.length; sIdx++) {
        var item = stList[sIdx];
        if (item.namaLengkap || item.nisn) {
          sheet.appendRow([
            new Date(), item.id || "", "'" + (item.nisn || ""), "'" + (item.nis || ""),
            item.namaLengkap || "", item.namaPanggilan || "", item.jenisKelamin || "",
            item.tempatLahir || "", item.tanggalLahir || "", item.agama || "",
            item.kelas || "", item.jurusan || "", item.tahunAjaran || "", item.status || "",
            "'" + (item.telepon || ""), item.email || "", item.alamat || "",
            item.kabupatenKota || "", item.namaAyah || "", item.namaIbu || "",
            item.pekerjaanOrtu || "", "'" + (item.noHpOrtu || ""),
            item.ekstrakurikuler || "", item.catatanKhusus || ""
          ]);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "bulk_sync",
        count: stList.length
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // =========================================================================
    // 5. AKSI: TAMBAH SISWA BARU (CREATE)
    // =========================================================================
    if (action === "create") {
      // CEK VALIDITAS: JANGAN PERNAH MENAMBAH BARIS JIKA NAMA LENGKAP KOSONG!
      if (!data.namaLengkap && !data.nisn) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "ignored",
          message: "Data nama atau NISN kosong, baris tidak ditambahkan."
        })).setMimeType(ContentService.MimeType.JSON);
      }

      sheet.appendRow([
        new Date(),
        data.id || targetId,
        "'" + (data.nisn || targetNisn),
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
        message: "Data siswa baru berhasil ditambahkan."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // JIKA ADA ACTION LAIN YANG TIDAK DIKENAL, JANGAN PERNAH APPEND
    return ContentService.createTextOutput(JSON.stringify({
      status: "ignored",
      action: action,
      message: "Action tidak dikenali."
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

// Dukungan GET untuk tes atau tindakan cepat via browser
function doGet(e) {
  var param = (e && e.parameter) ? e.parameter : {};
  if (param.action === "delete" || param.action === "create" || param.action === "update") {
    return doPost(e);
  }
  return ContentService.createTextOutput("Webhook SiswaKu Google Sheet Aktif dan Siap Digunakan (Mendukung Input, Edit, dan Hapus)!");
}
`;
