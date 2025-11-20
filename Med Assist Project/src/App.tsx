import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { SymptomChecker } from './components/SymptomChecker';
import { FirstAid } from './components/FirstAid';
import { ProfileManager } from './components/ProfileManager';
import { Login } from './components/Login';
//import { AppointmentScheduler } from './components/AppointmentScheduler';

export default function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentSection} />;
      case 'symptom-checker':
        return <SymptomChecker />;
      case 'first-aid':
        return <FirstAid />;
      
      case 'profile':
        return <ProfileManager />;
      default:
        return <Dashboard onNavigate={setCurrentSection} />;
    }
  };

  return (
    <Layout 
      currentSection={currentSection} 
      onNavigate={setCurrentSection}
    >
      {renderContent()}
    </Layout>
  );
}