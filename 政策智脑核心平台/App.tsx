import React, { useState } from 'react';
import { View } from './types';
import { Sidebar, Header } from './components/Layout';
import { 
  DashboardView, 
  DataIngestionView, 
  ProcessingView, 
  SearchView,
  ApiDocsView
} from './components/CoreViews';
import { ChatComponent, ImageGenComponent } from './components/AiTools';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <DashboardView />;
      case View.INGESTION:
        return <DataIngestionView />;
      case View.PROCESSING:
        return <ProcessingView />;
      case View.SEARCH:
        return <SearchView />;
      case View.CHAT:
        return <ChatComponent />;
      case View.IMAGE_GEN:
        return <ImageGenComponent />;
      case View.API_DOCS:
        return <ApiDocsView />;
      default:
        return <DashboardView />;
    }
  };

  const getTitle = () => {
     switch (currentView) {
      case View.DASHBOARD: return '系统概览';
      case View.INGESTION: return '数据采集';
      case View.PROCESSING: return '智能体治理 (通元平台)';
      case View.SEARCH: return '政策检索';
      case View.CHAT: return 'AI 助手';
      case View.IMAGE_GEN: return '视觉工坊';
      case View.API_DOCS: return 'API 服务';
      default: return '';
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full md:w-[calc(100%-16rem)]">
        <Header 
          title={getTitle()} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
        />

        <main className="flex-1 overflow-auto p-4 md:p-8 relative">
           {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;