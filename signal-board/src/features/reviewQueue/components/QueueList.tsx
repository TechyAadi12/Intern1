import { useAppStore } from '../../../store/useAppStore';
import { Badge } from '../../../components/ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import type { Status, Priority } from '../../../types';
import { cn } from '../../../lib/utils';
import { useKeyboardNavigation } from '../../../hooks/useKeyboardNavigation';
import { useState, useRef, useEffect } from 'react';
import { AlertCircle, FileX2 } from 'lucide-react';

const priorityColors: Record<Priority, BadgeProps['variant']> = {
  high: 'destructive',
  medium: 'warning',
  low: 'secondary',
};

const statusColors: Record<Status, BadgeProps['variant']> = {
  new: 'default',
  flagged: 'destructive',
  reviewed: 'success',
};

// Helper for search highlighting
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-inherit rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export function QueueList() {
  const { signals, isLoading, error, filters, sort, searchQuery, density, setSelectedSignalId, selectedSignalId } = useAppStore();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);

  // Derived state (filtering & sorting)
  const filteredSignals = signals.filter(signal => {
    if (filters.status !== 'all' && signal.status !== filters.status) return false;
    if (filters.priority !== 'all' && signal.priority !== filters.priority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        signal.title.toLowerCase().includes(q) ||
        signal.summary.toLowerCase().includes(q) ||
        signal.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  }).sort((a, b) => {
    let comparison = 0;
    if (sort.field === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sort.field === 'score') {
      comparison = a.score - b.score;
    } else if (sort.field === 'priority') {
      const pMap = { low: 1, medium: 2, high: 3 };
      comparison = pMap[a.priority] - pMap[b.priority];
    }
    return sort.direction === 'asc' ? comparison : -comparison;
  });

  // Keyboard navigation
  useKeyboardNavigation({
    ArrowDown: (e) => {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, filteredSignals.length - 1));
    },
    ArrowUp: (e) => {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, 0));
    },
    Enter: (e) => {
      if (focusedIndex >= 0 && focusedIndex < filteredSignals.length) {
        e.preventDefault();
        setSelectedSignalId(filteredSignals[focusedIndex].id);
      }
    }
  }, !selectedSignalId); // Only active when no modal open

  useEffect(() => {
    // Reset focus when list changes
    setFocusedIndex(-1);
  }, [searchQuery, filters, sort]);

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-red-500">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-semibold">{error}</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-2">There was a problem communicating with the server. Please try refreshing.</p>
      </div>
    );
  }

  if (filteredSignals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-full mb-4">
          <FileX2 className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No signals found</h3>
        <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto" ref={listRef} role="list" aria-label="Review Queue">
      <div className="min-w-[800px] w-full p-4 space-y-2">
        {/* Header (for comfortable mode or wide screens) */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur z-10 border-b border-gray-100 dark:border-gray-800">
          <div className="col-span-1">Status</div>
          <div className="col-span-5">Signal Title</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Age</div>
          <div className="col-span-2 text-right">Score</div>
        </div>

        {filteredSignals.map((signal, idx) => {
          const isFocused = idx === focusedIndex;
          const isCompact = density === 'compact';
          
          return (
            <button
              key={signal.id}
              onClick={() => setSelectedSignalId(signal.id)}
              className={cn(
                "w-full grid grid-cols-12 gap-4 items-center text-left rounded-lg transition-all focus:outline-none border border-transparent",
                isCompact ? "py-2 px-4 bg-white dark:bg-[#111] hover:bg-gray-50 dark:hover:bg-gray-900/50" : "py-4 px-4 bg-white dark:bg-[#111] shadow-sm hover:shadow dark:border-gray-800",
                isFocused && "ring-2 ring-blue-500 border-blue-500",
                selectedSignalId === signal.id && "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/50"
              )}
              role="listitem"
              aria-selected={isFocused}
            >
              <div className="col-span-1">
                <Badge variant={statusColors[signal.status]} className="capitalize">
                  {signal.status}
                </Badge>
              </div>
              
              <div className="col-span-5 flex flex-col justify-center overflow-hidden pr-4">
                <h4 className={cn("font-medium text-gray-900 dark:text-gray-100 truncate", !isCompact && "mb-1")}>
                  <HighlightText text={signal.title} highlight={searchQuery} />
                </h4>
                {!isCompact && (
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className="text-xs text-gray-500 truncate max-w-[200px]">
                      <HighlightText text={signal.source} highlight={searchQuery} />
                    </span>
                    <span className="text-gray-300 dark:text-gray-700">•</span>
                    {signal.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        <HighlightText text={tag} highlight={searchQuery} />
                      </span>
                    ))}
                    {signal.tags.length > 2 && <span className="text-[10px] text-gray-400">+{signal.tags.length - 2}</span>}
                  </div>
                )}
              </div>

              <div className="col-span-2">
                <Badge variant={priorityColors[signal.priority]} className="capitalize">
                  {signal.priority}
                </Badge>
              </div>

              <div className="col-span-2 text-sm text-gray-500 whitespace-nowrap">
                {formatDistanceToNow(new Date(signal.createdAt), { addSuffix: true })}
              </div>

              <div className="col-span-2 text-right">
                <div className={cn(
                  "inline-flex items-center justify-center font-mono rounded",
                  isCompact ? "text-sm" : "text-base py-1 px-2 bg-gray-50 dark:bg-gray-800",
                  signal.score > 80 ? "text-red-600 dark:text-red-400" : signal.score > 50 ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"
                )}>
                  {signal.score}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Just importing BadgeProps for type safety without declaring it outside
import type { BadgeProps } from '../../../components/ui/Badge';
