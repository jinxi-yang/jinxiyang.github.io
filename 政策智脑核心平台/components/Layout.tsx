import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Cpu, 
  Search, 
  MessageSquare, 
  Image as ImageIcon, 
  FileCode,
  Menu,
  Bell,
  User,
  Activity
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: '系统概览', icon: LayoutDashboard },
    { id: View.INGESTION, label: '数据采集', icon: Database },
    { id: View.PROCESSING, label: '智能体治理', icon: Cpu },
    { id: View.SEARCH, label: '政策检索', icon: Search },
    { id: View.API_DOCS, label: 'API 服务', icon: FileCode },
    { type: 'divider' },
    { id: View.CHAT, label: 'AI 助手', icon: MessageSquare },
    { id: View.IMAGE_GEN, label: '视觉工坊', icon: ImageIcon },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    md:relative md:translate-x-0 flex flex-col
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-slate-950">
        <Activity className="w-6 h-6 text-indigo-400 mr-2" />
        <span className="text-lg font-bold tracking-wide">政策智脑<span className="text-indigo-400">Core</span></span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item, idx) => {
          if (item.type === 'divider') {
            return <div key={idx} className="my-4 border-t border-slate-700 mx-3"></div>;
          }
          
          const Icon = item.icon as React.ElementType;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as View);
                setIsMobileOpen(false);
              }}
              className={`
                w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
            专家
          </div>
          <div>
            <p className="text-sm font-medium">专家用户</p>
            <p className="text-xs text-slate-500">工信部某司局</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export const Header: React.FC<{ onMenuClick: () => void, title: string }> = ({ onMenuClick, title }) => (
  <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
    <div className="flex items-center">
      <button onClick={onMenuClick} className="mr-4 md:hidden text-slate-500 hover:text-slate-700">
        <Menu className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
    </div>
    <div className="flex items-center space-x-4">
      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
        <User className="w-5 h-5" />
      </button>
    </div>
  </header>
);