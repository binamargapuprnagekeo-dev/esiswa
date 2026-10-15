import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { StudentForm } from './components/StudentForm';
import { StudentList } from './components/StudentList';
import { StudentDetailModal } from './components/StudentDetailModal';
import { StudentCardModal } from './components/StudentCardModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { ExportImportModal } from './components/ExportImportModal';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { PrintReportView } from './components/PrintReportView';
import { Toast, ToastMessage } from './components/Toast';
import { Student, StudentFormData, SchoolInfo } from './types/student';
import { 
  getStoredStudents, 
  saveStudents, 
  getStoredSchoolInfo, 
  saveSchoolInfo, 
  resetToDefaultData, 
  exportToCSV 
} from './utils/storage';
import { 
  syncStudentToGoogleSheet,
  deleteStudentFromGoogleSheet,
  deleteBulkStudentsFromGoogleSheet 
} from './services/googleSheetService';

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => getStoredStudents());
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => getStoredSchoolInfo());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form' | 'list' | 'cards' | 'settings'>('dashboard');

  // Modal & Selection States
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [cardStudentId, setCardStudentId] = useState<string | null>(null);
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showGoogleSheetModal, setShowGoogleSheetModal] = useState<boolean>(false);
  const [showPrintReport, setShowPrintReport] = useState<boolean>(false);

  // Toast notification state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      text,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync students to localStorage
  useEffect(() => {
    saveStudents(students);
  }, [students]);

  // Sync school info to localStorage
  useEffect(() => {
    saveSchoolInfo(schoolInfo);
  }, [schoolInfo]);

  // Handlers
  const handleAddNewStudent = () => {
    setEditingStudent(null);
    setActiveTab('form');
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setActiveTab('form');
  };

  const handleSaveStudent = (data: StudentFormData, studentId?: string) => {
    const now = new Date().toISOString();
    let savedStudent: Student;

    if (studentId) {
      // Edit existing
      savedStudent = {
        ...data,
        id: studentId,
        createdAt: students.find((s) => s.id === studentId)?.createdAt || now,
        updatedAt: now,
      };
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? savedStudent : s))
      );
      addToast(`Data "${data.namaLengkap}" tersimpan & disinkronkan ke Google Sheet!`, 'success');
    } else {
      // Create new
      savedStudent = {
        ...data,
        id: `std-${Date.now().toString(36)}`,
        createdAt: now,
        updatedAt: now,
      };
      setStudents((prev) => [savedStudent, ...prev]);
      addToast(`Siswa "${data.namaLengkap}" berhasil didaftarkan & dikirim ke Google Sheet!`, 'success');
    }

    // Kirim data secara otomatis ke Webhook Google Sheet
    syncStudentToGoogleSheet(savedStudent, studentId ? 'update' : 'create')
      .then((res) => {
        console.log('Sinkronisasi Google Sheet berhasil:', res.message);
      })
      .catch((err) => {
        console.warn('Google Sheet Webhook info:', err);
      });

    setEditingStudent(null);
    setActiveTab('list');
  };

  const handleDeleteStudent = (studentId: string) => {
    const target = students.find((s) => s.id === studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    addToast(
      `Data siswa ${target ? `"${target.namaLengkap}"` : ''} dihapus dari aplikasi & Google Sheet.`,
      'info'
    );

    // Kirim permintaan hapus baris ke Google Sheet Webhook
    if (target) {
      deleteStudentFromGoogleSheet({
        id: target.id,
        nisn: target.nisn,
        namaLengkap: target.namaLengkap,
      })
        .then((res) => {
          console.log('Google Sheet delete response:', res.message);
        })
        .catch((err) => {
          console.warn('Google Sheet delete error:', err);
        });
    }
  };

  const handleBulkDelete = (studentIds: string[]) => {
    const targetStudents = students.filter((s) => studentIds.includes(s.id));
    setStudents((prev) => prev.filter((s) => !studentIds.includes(s.id)));
    addToast(
      `${studentIds.length} data siswa dihapus dari aplikasi & Google Sheet.`,
      'info'
    );

    // Kirim permintaan hapus baris massal ke Google Sheet Webhook
    if (targetStudents.length > 0) {
      deleteBulkStudentsFromGoogleSheet(
        targetStudents.map((s) => ({ id: s.id, nisn: s.nisn }))
      )
        .then((res) => {
          console.log('Google Sheet bulk delete response:', res.message);
        })
        .catch((err) => {
          console.warn('Google Sheet bulk delete error:', err);
        });
    }
  };

  const handleOpenCard = (student: Student) => {
    setCardStudentId(student.id);
    setShowCardModal(true);
  };

  const handleImportStudents = (imported: Student[]) => {
    setStudents(imported);
    addToast(`Berhasil mengimpor ${imported.length} data siswa ke dalam sistem!`, 'success');
  };

  const handleResetData = () => {
    const defaults = resetToDefaultData();
    setStudents(defaults);
    setSchoolInfo(getStoredSchoolInfo());
    addToast('Data siswa berhasil dimuat ulang ke data awal.', 'info');
  };

  const handleSaveSchoolInfo = (newInfo: SchoolInfo) => {
    setSchoolInfo(newInfo);
    addToast('Identitas sekolah berhasil diperbarui!', 'success');
  };

  // If in formal report view
  if (showPrintReport) {
    return (
      <PrintReportView
        students={students}
        schoolInfo={schoolInfo}
        onBack={() => setShowPrintReport(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'cards') {
            if (students.length > 0) {
              setCardStudentId(students[0].id);
              setShowCardModal(true);
            } else {
              addToast('Belum ada data siswa untuk mencetak kartu.', 'error');
            }
          } else if (tab === 'settings') {
            setShowSettingsModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
        totalStudents={students.length}
        schoolInfo={schoolInfo}
        onOpenExportModal={() => setShowExportModal(true)}
        onOpenGoogleSheetModal={() => setShowGoogleSheetModal(true)}
        onAddNewStudent={handleAddNewStudent}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardStats
            students={students}
            schoolInfo={schoolInfo}
            onAddNew={handleAddNewStudent}
            onViewList={() => setActiveTab('list')}
            onViewCards={() => {
              if (students.length > 0) {
                setCardStudentId(students[0].id);
                setShowCardModal(true);
              }
            }}
            onExportCSV={() => {
              exportToCSV(students);
              addToast('File data siswa berhasil diekspor ke format CSV!', 'success');
            }}
            onPrintReport={() => setShowPrintReport(true)}
            onSelectStudent={(student) => setDetailStudent(student)}
            onOpenGoogleSheetModal={() => setShowGoogleSheetModal(true)}
          />
        )}

        {activeTab === 'form' && (
          <StudentForm
            initialData={editingStudent}
            existingStudents={students}
            onSave={handleSaveStudent}
            onCancel={() => {
              setEditingStudent(null);
              setActiveTab('list');
            }}
          />
        )}

        {activeTab === 'list' && (
          <StudentList
            students={students}
            onAddNew={handleAddNewStudent}
            onEdit={handleEditStudent}
            onViewDetail={(student) => setDetailStudent(student)}
            onPrintCard={handleOpenCard}
            onDelete={handleDeleteStudent}
            onBulkDelete={handleBulkDelete}
            onExportCSV={(selectedList) => {
              const toExport = selectedList || students;
              exportToCSV(toExport);
              addToast(`Berhasil mengekspor ${toExport.length} data siswa!`, 'success');
            }}
            onPrintReport={() => setShowPrintReport(true)}
            onOpenGoogleSheet={() => setShowGoogleSheetModal(true)}
          />
        )}
      </main>

      {/* Modal: Student Detail Modal */}
      {detailStudent && (
        <StudentDetailModal
          student={detailStudent}
          schoolInfo={schoolInfo}
          onClose={() => setDetailStudent(null)}
          onEdit={(s) => {
            setDetailStudent(null);
            handleEditStudent(s);
          }}
          onPrintCard={(s) => {
            setDetailStudent(null);
            handleOpenCard(s);
          }}
        />
      )}

      {/* Modal: Student Card Modal (KTS) */}
      {showCardModal && students.length > 0 && (
        <StudentCardModal
          students={students}
          initialStudentId={cardStudentId || undefined}
          schoolInfo={schoolInfo}
          onClose={() => setShowCardModal(false)}
        />
      )}

      {/* Modal: School Settings */}
      {showSettingsModal && (
        <SchoolSettingsModal
          schoolInfo={schoolInfo}
          onSave={handleSaveSchoolInfo}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Modal: Export / Import / Backup */}
      {showExportModal && (
        <ExportImportModal
          students={students}
          onImportStudents={handleImportStudents}
          onResetData={handleResetData}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Modal: Google Sheet Webhook Sync */}
      {showGoogleSheetModal && (
        <GoogleSheetModal
          students={students}
          onClose={() => setShowGoogleSheetModal(false)}
          onNotify={(msg, type) => addToast(msg, type)}
        />
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
