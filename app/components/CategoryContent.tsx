'use client';

import { useMemo, useState, useId } from 'react';
import styles from '../category-page.module.css';
import type { Tool } from '../../lib/categories';
import { ToolGrid } from './ToolGrid';

type CategoryContentProps = {
  tools: Tool[];
};

export function CategoryContent({ tools }: CategoryContentProps) {
  const [query, setQuery] = useState('');
  const inputId = useId();
  const normalizedQuery = query.trim().toLowerCase();

  const filteredTools = useMemo(() => {
    if (!normalizedQuery) {
      return tools;
    }

    return tools.filter((tool) => tool.name.toLowerCase().includes(normalizedQuery));
  }, [tools, normalizedQuery]);

  return (
    <div className={styles.categoryContent}>
      <form className={styles.searchForm} role="search" onSubmit={(event) => event.preventDefault()}>
        <label className={styles.searchLabel} htmlFor={inputId}>
          Search by name
        </label>
        <input
          id={inputId}
          type="search"
          className={styles.searchInput}
          placeholder="Start typing a tool name..."
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>

      {filteredTools.length > 0 ? (
        <ToolGrid tools={filteredTools} />
      ) : (
        <p className={styles.emptyState}>No tools found for "{query}".</p>
      )}
    </div>
  );
}

export default CategoryContent;
