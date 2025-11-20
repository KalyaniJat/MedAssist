import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  MessageCircle,
  Heart,
  User,
  Home,
  Menu,
  X,
  Settings,
  Bell,
  Search,
  HelpCircle,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onNavigate: (section: string) => void;
}

export function Layout({ children, currentSection, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" />, description: 'Health overview' },
    { id: 'symptom-checker', label: 'Symptom Checker', icon: <MessageCircle className="w-5 h-5" />, description: 'AI health assistant', badge: 'AI' },
    { id: 'first-aid', label: 'First Aid', icon: <Heart className="w-5 h-5" />, description: 'Emergency procedures' },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, description: 'Personal info' },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    // h-screen + overflow-hidden = page itself doesn't scroll; only the main pane will.
    <div className="h-screen overflow-hidden bg-background flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar (stable) */}
      <aside
        className={`
          flex-none w-72 bg-sidebar text-sidebar-foreground border-r border-sidebar-border
          /* Mobile: slide-in drawer */
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          /* Desktop: stick to viewport and never scroll */
          lg:static lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
          overflow-hidden flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="image">
                {/* FIX: class -> className (React) */}
                <img
                  alt="logo"
                  style={{ width: 128 }}
                  src="WhatsApp_Image_2025-08-25_at_18.19.50_1e31160c-removebg-preview.png"
                />
              </div>
              <div>
                <h1 className="text-lg font-semibold">MedAssist</h1>
                <p className="text-xs text-sidebar-foreground/70">Health Dashboard</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSidebar}
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Navigation (no scroll inside sidebar) */}
        <nav className="p-4 space-y-2">
          <div className="text-xs uppercase tracking-wider text-sidebar-foreground/50 font-medium mb-3 px-2">
            Navigation
          </div>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                closeSidebar();
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all
                ${currentSection === item.id
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'}
              `}
            >
              <div className={`${currentSection === item.id ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground/70'}`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className={`
                        text-xs h-5 px-1.5
                        ${currentSection === item.id
                          ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground'
                          : 'bg-sidebar-primary text-sidebar-primary-foreground'}
                      `}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className={`text-xs truncate ${currentSection === item.id ? 'text-sidebar-primary-foreground/70' : 'text-sidebar-foreground/50'}`}>
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </nav>

        {/* Footer (pinned to bottom of sidebar) */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" size="sm">
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" size="sm">
              <HelpCircle className="w-4 h-4 mr-3" />
              Help & Support
            </Button>
          </div>
          <div className="mt-4 p-3 bg-sidebar-accent rounded-lg">
            <div className="flex items-center gap-2 text-xs text-sidebar-foreground/70">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              All systems operational
            </div>
          </div>
        </div>
      </aside>

      {/* Main Column (the only scrollable area) */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>

              <div className="hidden md:flex items-center gap-2 bg-input-background rounded-lg px-3 py-2 w-80">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search health records, appointments..."
                  className="bg-transparent border-none outline-none flex-1 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs" />
              </Button>
              <div className="flex items-center gap-3 pl-3 border-l border-border">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">Patient ID: MD001</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content (scrolls) */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
