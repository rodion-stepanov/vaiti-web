import React, { useCallback } from 'react';
import { useSearchStore } from '@/stores/searchStore';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import {
  KeywordFilter,
  ResumeSelectFilter,
  LocationFilter,
  ExperienceFilter,
  SalaryFilter,
  SalarySwitchFilter,
  CoverLetterFilter,
  OrderByFilter,
  SearchFieldFilter,
} from './filter-components';

interface SearchFiltersProps {
  showSubmitButton?: boolean;
  layout?: 'vertical' | 'horizontal';
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  showSubmitButton = true,
  layout = 'vertical',
}) => {
  const {
    filters,
    setFilters,
    fetchVacancies,
    isLoading,
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    isFetchingResumes,
  } = useSearchStore();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name === 'salary') {
        const numericValue = value.replace(/[^0-9]/g, '');
        setFilters({ [name]: numericValue });
      } else if (name === 'coverLetter') {
        setFilters({ [name]: value.trim() });
      } else {
        setFilters({ [name]: value });
      }
    },
    [setFilters],
  );

  const handleSelectChange = useCallback(
    (name: keyof typeof filters) => (value: string) => {
      setFilters({ [name]: value });
    },
    [setFilters],
  );

  const handleCheckboxChange = useCallback(
    (checked: boolean) => {
      setFilters({ only_with_salary: checked });
    },
    [setFilters],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVacancies();
  };

  const formContent = (
    <div
      className={
        layout === 'horizontal'
          ? 'mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          : 'space-y-4'
      }
    >
      <KeywordFilter value={filters.text || ''} onChange={handleInputChange} />
      <ResumeSelectFilter
        isFetching={isFetchingResumes}
        resumes={resumes}
        selectedId={selectedResumeId}
        onSelect={setSelectedResumeId}
      />
      <LocationFilter value={filters.area || ''} onChange={handleSelectChange('area')} />
      <ExperienceFilter
        value={filters.experience || 'noExperience'}
        onSelect={handleSelectChange('experience')}
      />
      <SalaryFilter value={filters.salary || ''} onChange={handleInputChange} />
      <OrderByFilter
        value={filters.order_by || 'publication_time'}
        onSelect={handleSelectChange('order_by')}
      />
      <SearchFieldFilter
        value={filters.search_field || 'name'}
        onSelect={handleSelectChange('search_field')}
      />
      <SalarySwitchFilter
        checked={!!filters.only_with_salary}
        onCheckedChange={handleCheckboxChange}
      />
      <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CoverLetterFilter
          value={filters.coverLetter || ''}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );

  if (layout === 'horizontal') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {formContent}
        {showSubmitButton && (
          <Button
            type="submit"
            disabled={isLoading || !selectedResumeId}
            className="w-full"
          >
            {isLoading ? 'Идет поиск...' : 'Найти вакансии'}
          </Button>
        )}
      </form>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Фильтры поиска</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formContent}
          {showSubmitButton && (
            <Button
              type="submit"
              disabled={isLoading || !selectedResumeId}
              className="w-full"
            >
              {isLoading ? 'Идет поиск...' : 'Найти вакансии'}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
