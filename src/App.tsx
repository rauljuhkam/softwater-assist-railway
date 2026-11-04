'use client';
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatArea } from './components/ChatArea';
import { Composer } from './components/Composer';
import { DropletTip } from './components/DropletTip';
import { FooterDisclaimer } from './components/FooterDisclaimer';
import { SettingsModal } from './components/SettingsModal';
import { PromptModal } from './components/PromptModal';
import { useChatStorage } from './hooks/useChatStorage';

export const App: React.FC = () => {
  const {
    sessions, error, loading, reload,
    activeSessionId,
    activeSession,
    prompts,
    settings,
    tipsMuted,
    selectedModel,
    selectedPersona,
    isCurrentSessionTyping,
    createNewSession,
    selectSession,
    deleteSession,
    clearCurrentSession,
    sendMessage,
    setSettings,
    setSelectedModel,
    setSelectedPersona,
    toggleTipsMuted,
    addPrompt,
    editPrompt,
    deletePrompt
  } = useChatStorage();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPromptsOpen, setIsPromptsOpen] = useState(false);

  const activeMessages = activeSession ? activeSession.messages : [];
  const currentTitle = activeSession ? activeSession.title : 'New conversation';

  const handleSelectStarter = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="h-dvh w-full flex overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Sidebar (Desktop 260px + Mobile Drawer) */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={selectSession}
        onNewChat={() => createNewSession()}
        onDeleteSession={deleteSession}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Chat Viewport */}
      <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-white">
        {/* Header Bar */}
        <Header
          currentTitle={currentTitle}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          selectedPersona={selectedPersona}
          onSelectPersona={setSelectedPersona}
          prompts={prompts}
          onOpenManagePrompts={() => setIsPromptsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          tipsMuted={tipsMuted}
          onToggleTipsMuted={toggleTipsMuted}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <div className="px-4 py-1 text-[11px] text-slate-500 border-b border-slate-100">Shared educational demo · Conversations are visible to everyone using this app. Do not enter personal information.</div>
        {loading && <p role="status" className="px-4 py-2 text-sm text-slate-500">Loading conversations…</p>}
        {error && <div role="alert" className="px-4 py-3 text-sm text-red-800 bg-red-50 flex justify-between gap-3"><span>{error}</span><button onClick={() => void reload()} className="underline font-semibold">Retry</button></div>}
        {/* Chat Scroll Area */}
        <ChatArea
          messages={activeMessages}
          isTyping={isCurrentSessionTyping}
          onSelectStarter={handleSelectStarter}
        />

        {/* Droplet Dog Tip (Reserved Layout Space: never covers messages or links) */}
        <DropletTip
          tipsMuted={tipsMuted}
          onToggleTipsMuted={toggleTipsMuted}
        />

        {/* Message Input Composer */}
        <Composer
          onSendMessage={sendMessage}
          onClearChat={clearCurrentSession}
          isTyping={isCurrentSessionTyping}
          hasMessages={activeMessages.length > 0}
        />

        {/* EPA / Penn State Educational Disclaimer Footer */}
        <FooterDisclaimer />
      </main>

      {/* Advanced Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      {/* Manage Prompts Modal */}
      <PromptModal
        isOpen={isPromptsOpen}
        onClose={() => setIsPromptsOpen(false)}
        prompts={prompts}
        onAddPrompt={addPrompt}
        onEditPrompt={editPrompt}
        onDeletePrompt={deletePrompt}
      />
    </div>
  );
};

export default App;
