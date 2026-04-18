import { useAppStore } from '../../../store/useAppStore';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { X, Clock, User, Tag, Activity, Archive, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useKeyboardNavigation } from '../../../hooks/useKeyboardNavigation';

export function DetailDrawer() {
  const { signals, selectedSignalId, setSelectedSignalId, updateSignal, localNotes, addNote } = useAppStore();
  const [noteState, setNoteState] = useState('');
  
  const signal = signals.find(s => s.id === selectedSignalId);

  // Sync internal note state with global per-signal localNotes
  useEffect(() => {
    if (signal) {
      setNoteState(localNotes[signal.id] || '');
    }
  }, [signal, localNotes]);

  useKeyboardNavigation({
    Escape: () => setSelectedSignalId(null),
  }, !!selectedSignalId);

  if (!signal) return null;

  const handleStatusChange = (status: 'reviewed' | 'flagged') => {
    updateSignal(signal.id, { status });
  };

  const handleSaveNote = () => {
    addNote(signal.id, noteState);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setSelectedSignalId(null)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-[#0a0a0a] shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-label="Signal Details"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Signal Details</h2>
          <Button variant="ghost" size="icon" onClick={() => setSelectedSignalId(null)} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Header */}
          <div>
            <div className="flex gap-2 mb-3">
              <Badge variant={signal.status === 'new' ? 'default' : signal.status === 'reviewed' ? 'success' : 'destructive'} className="capitalize">
                {signal.status}
              </Badge>
              <Badge variant={signal.priority === 'high' ? 'destructive' : signal.priority === 'medium' ? 'warning' : 'secondary'} className="capitalize">
                {signal.priority} Priority
              </Badge>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{signal.title}</h1>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
            <div className="flex gap-2 items-start text-gray-500">
              <Clock className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Created</p>
                <p>{new Date(signal.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-2 items-start text-gray-500">
              <Activity className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Source</p>
                <p>{signal.source}</p>
              </div>
            </div>
            <div className="flex gap-2 items-start text-gray-500">
              <User className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Owner</p>
                <p>{signal.owner || 'Unassigned'}</p>
              </div>
            </div>
            <div className="flex gap-2 items-start text-gray-500">
              <div className="mt-0.5 font-bold font-mono text-center w-4 shrinkage border border-current rounded hidden sm:block h-4 leading-none shrink-0" style={{ fontSize: '10px' }}>Σ</div>
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Score</p>
                <p className={signal.score > 80 ? 'text-red-500 font-medium' : ''}>{signal.score} / 100</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" /> Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(signal.tags)).map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Summary & Analysis</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm leading-relaxed text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800">
              {signal.summary}
            </div>
          </div>

          {/* Personal Note (Local State Persistence) */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex justify-between items-end">
              <span>Personal Notes (Local)</span>
              {noteState !== localNotes[signal.id] && (
                <span className="text-xs text-blue-500">Unsaved changes</span>
              )}
            </h3>
            <textarea
              className="w-full min-h-[100px] p-3 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
              placeholder="Add your investigation notes here. These are saved locally to your browser."
              value={noteState}
              onChange={(e) => setNoteState(e.target.value)}
              onBlur={handleSaveNote}
            />
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex flex-wrap gap-3">
          <Button 
            className="flex-1" 
            variant="default"
            disabled={signal.status === 'reviewed'} 
            onClick={() => handleStatusChange('reviewed')}
          >
            <Archive className="h-4 w-4 mr-2" />
            Mark as Reviewed
          </Button>
          <Button 
            className="flex-1" 
            variant="destructive"
            disabled={signal.status === 'flagged'}
            onClick={() => handleStatusChange('flagged')}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Escalate
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => {
            alert('Signal snoozed for 24 hours. (Demo action)');
          }}>
            <Clock className="h-4 w-4 mr-2" />
            Snooze
          </Button>
        </div>
      </div>
    </>
  );
}
