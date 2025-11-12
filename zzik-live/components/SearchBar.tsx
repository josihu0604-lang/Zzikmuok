'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, MapPin, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Search Bar Component - ZZIK LIVE
 * 
 * Advanced search with:
 * - Debounced input (300ms)
 * - Search suggestions
 * - Recent searches
 * - Filter chips
 * - Clear functionality
 */

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFilterChange?: (filters: SearchFilter[]) => void;
  suggestions?: string[];
  recentSearches?: string[];
  filters?: SearchFilter[];
  className?: string;
}

export interface SearchFilter {
  id: string;
  label: string;
  value: string;
  active: boolean;
}

export function SearchBar({
  placeholder = '미션, 장소, 카테고리 검색...',
  onSearch,
  onFilterChange,
  suggestions = [],
  recentSearches = [],
  filters = [],
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Call onSearch when debounced query changes
  useEffect(() => {
    if (debouncedQuery || query === '') {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    onSearch('');
  }, [onSearch]);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      setDebouncedQuery(suggestion);
      onSearch(suggestion);
      setShowSuggestions(false);
    },
    [onSearch]
  );

  const handleFilterToggle = useCallback(
    (filterId: string) => {
      const updated = localFilters.map((f) =>
        f.id === filterId ? { ...f, active: !f.active } : f
      );
      setLocalFilters(updated);
      onFilterChange?.(updated);
    },
    [localFilters, onFilterChange]
  );

  const activeSuggestions = query
    ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  const hasActiveSuggestions = activeSuggestions.length > 0 || recentSearches.length > 0;

  return (
    <div className={cn('relative', className)}>
      {/* Search Input */}
      <div
        className={cn(
          'relative flex items-center gap-3 px-4 py-3 rounded-2xl',
          'bg-white border-2 transition-all duration-200',
          isFocused
            ? 'border-primary-500 shadow-lg shadow-primary-100'
            : 'border-gray-200 shadow-sm'
        )}
      >
        <Search
          className={cn(
            'w-5 h-5 flex-shrink-0 transition-colors',
            isFocused ? 'text-primary-600' : 'text-gray-400'
          )}
        />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            // Delay to allow suggestion clicks
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
        />

        {query && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleClear}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </motion.button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && hasActiveSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
          >
            {/* Active Suggestions */}
            {activeSuggestions.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  추천 검색어
                </div>
                {activeSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="py-2 border-t border-gray-100">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  최근 검색
                </div>
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Chips */}
      {localFilters.length > 0 && (
        <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-hide">
          <div className="flex-shrink-0 flex items-center gap-1 text-gray-500">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">필터:</span>
          </div>
          {localFilters.map((filter) => (
            <motion.button
              key={filter.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilterToggle(filter.id)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium',
                'border-2 transition-all duration-200',
                filter.active
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'
              )}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Search with Location Filter
 */
interface SearchWithLocationProps extends SearchBarProps {
  location?: string;
  radius?: number;
  onLocationClick?: () => void;
}

export function SearchWithLocation({
  location = '강남구',
  radius = 5,
  onLocationClick,
  ...props
}: SearchWithLocationProps) {
  return (
    <div>
      <SearchBar {...props} />
      
      {location && (
        <button
          onClick={onLocationClick}
          className="mt-3 px-4 py-2 bg-primary-50 rounded-xl flex items-center gap-2 text-sm text-primary-700 hover:bg-primary-100 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          <span>
            {location} 반경 {radius}km
          </span>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
