import { useEffect } from 'react';

type KeyHandler = (e: KeyboardEvent) => void;

export function useKeyboardNavigation(handlers: Record<string, KeyHandler>, active: boolean = true) {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow default behavior for inputs/textareas
      const target = e.target as HTMLElement;
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
        target.isContentEditable
      ) {
        // Special case: Cmd+K should still work globally
        if (!(e.metaKey && e.key === 'k') && !(e.ctrlKey && e.key === 'k')) {
          return;
        }
      }

      // Check for exact matches
      const key = `${e.metaKey || e.ctrlKey ? 'Cmd+' : ''}${e.key}`;
      
      if (handlers[key]) {
        e.preventDefault();
        handlers[key](e);
      } else if (handlers[e.key]) {
        e.preventDefault();
        handlers[e.key](e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, active]);
}
