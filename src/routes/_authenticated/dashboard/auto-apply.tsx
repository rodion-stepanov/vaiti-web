import { createFileRoute } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchFilters } from '@/components/ui/search-filters';
import { useSearchStore } from '@/stores/searchStore';
import { useEffect } from 'react';
import { toast } from 'sonner';

const AutoApplyComponent = () => {
  const {
    applyToVacancies,
    isApplying,
    applySuccessMessage,
    error,
    selectedResumeId,
  } = useSearchStore();

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

  return (
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
          {isApplying ? 'Запускаем...' : 'Запустить автоотклик'}
        </Button>
      </CardContent>
    </Card>
  );
};

export const Route = createFileRoute('/_authenticated/dashboard/auto-apply')({
  component: AutoApplyComponent,
});
