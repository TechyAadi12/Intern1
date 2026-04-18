import { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { TopBar } from './components/TopBar';
import { QueueList } from './components/QueueList';
import { DetailDrawer } from './components/DetailDrawer';

export function QueueView() {
  const loadSignals = useAppStore(state => state.loadSignals);
  const selectedSignalId = useAppStore(state => state.selectedSignalId);

  useEffect(() => {
    loadSignals();
  }, [loadSignals]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans">
      <header className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Signal Board
          </h1>
          <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-0.5">Review Queue</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden sm:inline-block text-gray-500">
            Use <kbd className="px-1.5 py-0.5 border border-gray-200 dark:border-gray-800 rounded bg-gray-100 dark:bg-gray-900 mx-1">Cmd+K</kbd> to search
          </span>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-sm">
            T
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col relative overflow-hidden max-w-7xl mx-auto w-full bg-white dark:bg-[#0a0a0a] border-x border-gray-200 dark:border-gray-800 shadow-sm">
        <TopBar />
        <QueueList />
        {selectedSignalId && <DetailDrawer />}
      </main>
    </div>
  );
}
