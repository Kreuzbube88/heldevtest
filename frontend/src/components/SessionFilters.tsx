import { Filter, SortAsc, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onSearchChange: (search: string) => void;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
}

export function SessionFilters({ onSearchChange, onFilterChange, onSortChange }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('updated');

  return (
    <div style={{
      display: 'flex',
      gap: 'var(--space-md)',
      marginBottom: 'var(--space-xl)',
      flexWrap: 'wrap'
    }}>
      <div style={{ flex: '1 1 300px', position: 'relative' }}>
        <Search
          size={20}
          style={{
            position: 'absolute',
            left: 'var(--space-md)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-tertiary)'
          }}
        />
        <input
          type="text"
          placeholder={t('ui:dashboard.searchPlaceholder')}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearchChange(e.target.value);
          }}
          style={{
            paddingLeft: 'calc(var(--space-md) * 3)',
            width: '100%'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
        <Filter size={20} color="var(--color-text-tertiary)" />
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            onFilterChange(e.target.value);
          }}
          style={{ minWidth: '150px' }}
        >
          <option value="all">{t('ui:dashboard.filterAll')}</option>
          <option value="completed">{t('ui:dashboard.filterCompleted')}</option>
          <option value="in_progress">{t('ui:dashboard.filterInProgress')}</option>
          <option value="failed">{t('ui:dashboard.filterFailed')}</option>
          <option value="not_started">{t('ui:dashboard.filterNotStarted')}</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
        <SortAsc size={20} color="var(--color-text-tertiary)" />
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            onSortChange(e.target.value);
          }}
          style={{ minWidth: '150px' }}
        >
          <option value="updated">{t('ui:dashboard.sortUpdated')}</option>
          <option value="created">{t('ui:dashboard.sortCreated')}</option>
          <option value="name">{t('ui:dashboard.sortName')}</option>
          <option value="progress">{t('ui:dashboard.sortProgress')}</option>
        </select>
      </div>
    </div>
  );
}
