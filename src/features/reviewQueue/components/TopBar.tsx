import { useAppStore } from '../../../store/useAppStore';
import type { SortField } from '../../../store/useAppStore';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Search, LayoutList, AlignJustify } from 'lucide-react';
import type { Status, Priority } from '../../../types';
import { useDebounce } from '../../../hooks/useDebounce';
import { useEffect, useState } from 'react';

export function TopBar() {
  const { 
    filters, setFilter, 
    sort, setSort, 
    searchQuery, setSearchQuery,
    density, setDensity 
  } = useAppStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  return (
    <div className="flex flex-col gap-4 p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search signals by title, summary or tags... (Cmd+K)" 
            className="pl-9"
            value={localSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalSearch(e.target.value)}
            id="search-input"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 mr-2 border-r pr-4 border-gray-200 dark:border-gray-800">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDensity('compact')}
              className={density === 'compact' ? 'bg-gray-100 dark:bg-gray-800' : ''}
              aria-label="Compact view"
              title="Compact view"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDensity('comfortable')}
              className={density === 'comfortable' ? 'bg-gray-100 dark:bg-gray-800' : ''}
              aria-label="Comfortable view"
              title="Comfortable view"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>

          <Select 
            value={filters.status} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter('status', e.target.value as Status | 'all')}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="flagged">Flagged</option>
          </Select>

          <Select 
            value={filters.priority} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter('priority', e.target.value as Priority | 'all')}
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>

          <Select 
            value={`${sort.field}-${sort.direction}`} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const [field, direction] = e.target.value.split('-');
              setSort(field as SortField, direction as 'asc' | 'desc');
            }}
            aria-label="Sort by"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="score-desc">Highest Score</option>
            <option value="score-asc">Lowest Score</option>
            <option value="priority-desc">Priority (High to Low)</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
