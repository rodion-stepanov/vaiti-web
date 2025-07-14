import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import { useSearchStore, type Vacancy } from '@/stores/searchStore';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchFilters } from '@/components/ui/search-filters';
// import { AutoApplyCard } from '@/components/ui/auto-apply-card';
import { VacancyCard } from '@/components/ui/vacancy-card';
import { useAuthStore } from '@/stores/authStore';

const AggregatorComponent: React.FC = () => {
  const { vacancies, isLoading, error, fetchResumes } = useSearchStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      fetchResumes();
    }
  }, [accessToken, fetchResumes]);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="flex flex-col gap-8 md:col-span-1">
        <SearchFilters />
        {/* <AutoApplyCard /> */}
      </div>
      <div className="space-y-4 md:col-span-2">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : vacancies.length > 0 ? (
          vacancies.map((vacancy: Vacancy) => (
            <VacancyCard key={vacancy.id} vacancy={vacancy} />
          ))
        ) : (
          <p className="text-muted-foreground p-4 text-center">
            Вакансии не найдены. Попробуйте изменить фильтры.
          </p>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/dashboard/aggregator')({
  component: AggregatorComponent,
});
