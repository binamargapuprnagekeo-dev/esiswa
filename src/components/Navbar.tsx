import React from 'react';
import { 
  GraduationCap, 
  UserPlus, 
  Users, 
  LayoutDashboard, 
  CreditCard, 
  Download, 
  School,
  FileSpreadsheet
} from 'lucide-react';
import { SchoolInfo } from '../types/student';

interface NavbarProps {
  activeTab: 'dashboard' | 'form' | 'list' | 'cards' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'form' | 'list' | 'cards' | 'settings') => void;
  totalStudents: number;
  schoolInfo: SchoolInfo;
  onOpenExportModal: () => void;
  onOpenGoogleSheetModal: () => void;
  onAddNewStudent: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  totalStudents,
  schoolInfo,
  onOpenExportModal,
  onOpenGoogleSheetModal,
  onAddNewStudent,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & School Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  Siswa<span className="text-indigo-600">Ku</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  TA {schoolInfo.tahunAjaranAktif}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
                {schoolInfo.namaSekolah}
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                activeTab === 'dashboard'
                  ? 'bg-white text-indigo-700 shadow-xs shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                activeTab === 'list'
                  ? 'bg-white text-indigo-700 shadow-xs shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Data Siswa</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'list' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {totalStudents}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cards')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                activeTab === 'cards'
                  ? 'bg-white text-indigo-700 shadow-xs shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Kartu Pelajar</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                activeTab === 'settings'
                  ? 'bg-white text-indigo-700 shadow-xs shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
              title="Pengaturan Sekolah"
            >
              <School className="w-4 h-4" />
              <span>Sekolah</span>
            </button>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenGoogleSheetModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800 text-xs sm:text-sm font-bold transition-colors shadow-2xs"
              title="Webhook Google Sheet Otomatis"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Google Sheet</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            <button
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
              title="Ekspor & Cadangan Data"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Ekspor/Impor</span>
            </button>

            <button
              onClick={onAddNewStudent}
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-indigo-300 transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Input Siswa</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-2 border-t border-slate-100 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'list' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Data Siswa ({totalStudents})
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'cards' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Kartu Pelajar
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            Sekolah
          </button>
          <button
            onClick={onOpenGoogleSheetModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-emerald-50 text-emerald-800 border border-emerald-200"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Google Sheet
          </button>
        </div>
      </div>
    </header>
  );
};
