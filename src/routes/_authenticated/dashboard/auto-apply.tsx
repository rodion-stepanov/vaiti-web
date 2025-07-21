import { createFileRoute } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

import { SearchFilters } from '@/components/ui/search-filters';
import { toast } from 'sonner';
import { useEffect, useOptimistic, startTransition } from 'react';
import { api } from '@/lib/api';
import { useSearchStore, type Scheduler } from '@/stores/searchStore';
import { CalendarClock } from 'lucide-react';

const AutoApplyComponent = () => {
  const store = useSearchStore();
  const [optimisticSchedulers, setOptimisticScheduler] = useOptimistic(
    store.schedulers,
    (state, updatedSchedulerId: number) =>
      state.map((s) =>
        s.id === updatedSchedulerId ? { ...s, enabled: !s.enabled } : s,
      ),
  );
  const {
    applyToVacancies,
    isApplying,
    applySuccessMessage,
    error,
    selectedResumeId,
    isLoadingSchedulers,
    fetchSchedulers,
    deleteScheduler,
    schedulerError,
    updateScheduler,
  } = useSearchStore();

  const handleToggleScheduler = async (scheduler: Scheduler) => {
    startTransition(() => setOptimisticScheduler(scheduler.id));
    try {
      const { data: newScheduler } = await api.post('/v1/scheduler/auto', {
        ...scheduler.params,
        enabled: !scheduler.enabled,
        enabledSchedule: !scheduler.enabled,
      });
      updateScheduler(newScheduler);
      toast.success(
        `Автоотклик ${scheduler.enabled ? 'деактивирован' : 'активирован'}`,
      );
    } catch (error) {
      console.error('Failed to toggle scheduler:', error);
      toast.error('Не удалось изменить статус автоотклика');
    }
  };

  const handleAutoApply = () => {
    if (!selectedResumeId) {
      toast.error('Пожалуйста, выберите резюме.');
      return;
    }
    applyToVacancies();
  };

  useEffect(() => {
    if (applySuccessMessage) {
      toast.success(applySuccessMessage);
    }
    if (error) {
      toast.error(error, {
        description:
          'Возможно, ваше резюме не соответствует требованиям вакансии, или на стороне hh.ru возникли проблемы.',
      });
    }
  }, [applySuccessMessage, error]);

  // Fetch user schedulers on component mount
  const handleCreateScheduler = async () => {
    const nameRequest = prompt(
      'Пожалуйста, введите имя для нового автоотклика:',
    );
    if (!nameRequest) {
      toast.info('Создание автоотклика отменено.');
      return;
    }

    if (!selectedResumeId) {
      toast.error('Пожалуйста, выберите резюме.');
      return;
    }

    const { filters } = useSearchStore.getState();
    const { keywordsToExclude, ...rest } = filters;

    const payload = {
      nameRequest: nameRequest,
      resume_id: selectedResumeId,
      enabledSchedule: true,
      ...rest,
      keywordsToExclude:
        keywordsToExclude
          ?.split(',')
          .map((k) => k.trim())
          .filter(Boolean) || [],
    };

    try {
      await api.post('/v1/scheduler/auto', payload);
      toast.success(`Автоотклик "${nameRequest}" успешно создан!`);
      fetchSchedulers();
    } catch (error) {
      console.error('Error creating scheduler:', error);
      toast.error('Не удалось создать автоотклик.');
    }
  };

  useEffect(() => {
    fetchSchedulers();
  }, [fetchSchedulers]);

  useEffect(() => {
    if (schedulerError) {
      toast.error(schedulerError);
    }
  }, [schedulerError]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Сервис автооткликов</CardTitle>
          <CardDescription>
            Настройте фильтры, выберите резюме, и мы будем автоматически
            откликаться на подходящие вакансии.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SearchFilters layout="horizontal" showSubmitButton={false} />
          <Button
            className="w-full md:w-auto"
            onClick={handleAutoApply}
            disabled={isApplying || !selectedResumeId}
          >
            {isApplying ? 'Откликаемся...' : 'Откликнуться'}
          </Button>
          <Button
            className="ml-12 w-full md:w-auto"
            onClick={handleCreateScheduler}
            disabled={isApplying || !selectedResumeId}
          >
            {isApplying ? 'Создание...' : 'Создать автоотклик'}
          </Button>
        </CardContent>
      </Card>
      {optimisticSchedulers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Созданные автоотклики</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingSchedulers ? (
              <p className="text-muted-foreground text-center">
                Загрузка расписаний...
              </p>
            ) : (
              optimisticSchedulers.map((scheduler) => (
                <Collapsible
                  key={scheduler.id}
                  className="mb-2 rounded-lg border"
                >
                  <CollapsibleTrigger className="hover:bg-accent/50 flex w-full items-center justify-between rounded-md p-4 transition-all">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="text-primary h-5 w-5" />
                      <span className="font-medium">
                        {scheduler.name || `Расписание #${scheduler.id}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          scheduler.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {scheduler.enabled ? 'Активно' : 'Неактивно'}
                      </span>
                      <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pt-0 pb-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-muted-foreground text-sm font-medium">
                            Создано
                          </p>
                          <p>
                            {new Date(scheduler.createdAt).toLocaleDateString(
                              'ru-RU',
                            )}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-muted-foreground text-sm font-medium">
                            Параметры поиска
                          </p>
                          <div className="mt-1 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                            {Object.entries(scheduler.params)
                              .filter(
                                ([, value]) =>
                                  value != null &&
                                  value !== '' &&
                                  value !== false,
                              )
                              .map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium">{key}: </span>
                                  {String(value)}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteScheduler(scheduler.id)}
                        >
                          Удалить
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary hover:text-primary"
                          onClick={() => handleToggleScheduler(scheduler)}
                        >
                          {scheduler.enabled
                            ? 'Деактивировать'
                            : 'Активировать'}
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/dashboard/auto-apply')({
  component: AutoApplyComponent,
});
