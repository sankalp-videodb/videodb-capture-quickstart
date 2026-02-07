import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { MainContent } from './components/layout/MainContent';
import { AuthModal } from './components/auth/AuthModal';
import { SessionControls } from './components/recording/SessionControls';
import { TranscriptionPanel } from './components/transcription/TranscriptionPanel';
import { HistoryView } from './components/history/HistoryView';
import { useConfigStore } from './stores/config.store';
import { usePermissions } from './hooks/usePermissions';
import { useGlobalRecorderEvents } from './hooks/useGlobalRecorderEvents';
import { useCopilot } from './hooks/useCopilot';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Button } from './components/ui/button';
import { AlertCircle, Shield, ChevronRight, ChevronLeft } from 'lucide-react';
import {
  MetricsPanel,
  CueCardOverlay,
  PlaybookPanel,
  NudgeToast,
  SentimentIndicator,
  CallSummaryView,
} from './components/copilot';
import { useCopilotStore } from './stores/copilot.store';
import { CueCardEditor } from './components/settings/CueCardEditor';
import { PlaybookEditor } from './components/settings/PlaybookEditor';
import { PromptsEditor } from './components/settings/PromptsEditor';

type Tab = 'recording' | 'history' | 'settings';

function PermissionsView() {
  const { status, requestMicPermission, requestScreenPermission, openSettings } = usePermissions();

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Permissions Required</CardTitle>
          </div>
          <CardDescription>
            Meeting Copilot needs access to record your screen and microphone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium text-sm">Microphone</p>
              <p className="text-xs text-muted-foreground">Required for voice recording</p>
            </div>
            {status.microphone ? (
              <span className="text-xs text-green-600 font-medium">Granted</span>
            ) : (
              <Button size="sm" onClick={requestMicPermission}>
                Grant
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium text-sm">Screen Recording</p>
              <p className="text-xs text-muted-foreground">Required for screen capture</p>
            </div>
            {status.screen ? (
              <span className="text-xs text-green-600 font-medium">Granted</span>
            ) : (
              <Button size="sm" onClick={() => openSettings('screen')}>
                Open Settings
              </Button>
            )}
          </div>

          {!status.screen && (
            <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
              <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Screen Recording permission must be granted in System Preferences. Click "Open
                Settings" and enable Meeting Copilot in the list.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RecordingView() {
  const [showCopilotSidebar, setShowCopilotSidebar] = useState(true);
  const { isCallActive, callSummary, isInitialized } = useCopilotStore();

  // Initialize copilot hook to set up event listeners
  useCopilot();

  // Show call summary view if call ended and summary available
  if (callSummary && !isCallActive) {
    return (
      <div className="h-full overflow-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Call Complete</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => useCopilotStore.getState().reset()}
            >
              Start New Call
            </Button>
          </div>
          <CallSummaryView />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Top Section: Controls + Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <SessionControls />
          </div>
          <div className="space-y-4">
            <MetricsPanel compact />
            <SentimentIndicator compact />
          </div>
        </div>

        {/* Middle Section: Transcription + Cue Cards */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[400px]">
          <div className="lg:col-span-2 h-full">
            <TranscriptionPanel />
          </div>
          <div className="h-full overflow-auto">
            <CueCardOverlay />
          </div>
        </div>
      </div>

      {/* Copilot Sidebar (collapsible) */}
      <div className={`transition-all duration-300 ${showCopilotSidebar ? 'w-80' : 'w-10'}`}>
        <div className="h-full flex">
          {/* Toggle Button */}
          <button
            className="flex-shrink-0 w-10 h-full bg-muted/30 hover:bg-muted/50 flex items-center justify-center border-l"
            onClick={() => setShowCopilotSidebar(!showCopilotSidebar)}
            title={showCopilotSidebar ? 'Hide Copilot Panel' : 'Show Copilot Panel'}
          >
            {showCopilotSidebar ? (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {/* Sidebar Content */}
          {showCopilotSidebar && (
            <div className="flex-1 overflow-auto space-y-4 p-4 border-l">
              {!isInitialized && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Copilot initializing...
                  </p>
                </div>
              )}
              <PlaybookPanel />
              <SentimentIndicator />
              <MetricsPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  const [activeSettingsTab, setActiveSettingsTab] = useState<'account' | 'cueCards' | 'playbooks' | 'prompts'>('account');
  const configStore = useConfigStore();

  const settingsTabs = [
    { id: 'account' as const, label: 'Account' },
    { id: 'cueCards' as const, label: 'Cue Cards' },
    { id: 'playbooks' as const, label: 'Playbooks' },
    { id: 'prompts' as const, label: 'AI Settings' },
  ];

  return (
    <div className="space-y-4 h-full overflow-auto">
      {/* Settings Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {settingsTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeSettingsTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveSettingsTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl">
        {activeSettingsTab === 'account' && (
          <div className="max-w-md space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{configStore.userName || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">API Key</p>
            <p className="font-mono text-xs">
              {configStore.apiKey ? `${configStore.apiKey.slice(0, 8)}...` : 'Not set'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Meeting Copilot is a desktop app for recording meetings with real-time transcription
            and AI-powered insights.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Electron, React, and VideoDB.
          </p>
        </CardContent>
      </Card>
          </div>
        )}

        {activeSettingsTab === 'cueCards' && <CueCardEditor />}
        {activeSettingsTab === 'playbooks' && <PlaybookEditor />}
        {activeSettingsTab === 'prompts' && <PromptsEditor />}
      </div>
    </div>
  );
}

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('recording');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const configStore = useConfigStore();
  const { allGranted, loading: permissionsLoading } = usePermissions();

  // Global listener for recorder events - persists during navigation
  useGlobalRecorderEvents();

  const isAuthenticated = configStore.isAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  const getTitle = () => {
    switch (activeTab) {
      case 'recording':
        return 'Recording';
      case 'history':
        return 'History';
      case 'settings':
        return 'Settings';
    }
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Please sign in to continue</p>
        </div>
      );
    }

    if (permissionsLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      );
    }

    if (!allGranted && activeTab === 'recording') {
      return <PermissionsView />;
    }

    switch (activeTab) {
      case 'recording':
        return <RecordingView />;
      case 'history':
        return <HistoryView />;
      case 'settings':
        return <SettingsView />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {isAuthenticated && <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />}
      <MainContent title={getTitle()}>{renderContent()}</MainContent>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />

      {/* Global Copilot Components */}
      {isAuthenticated && <NudgeToast position="bottom" />}
    </div>
  );
}
