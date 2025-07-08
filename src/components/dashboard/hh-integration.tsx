import React, { useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { useSearchStore } from '@/stores/searchStore';

export const HhIntegration: React.FC = () => {
  const { accessToken } = useAuthStore();

  const {
    data: isHhIntegrated,
    isLoading: isCheckingIntegration,
    refetch: checkHhIntegration,
  } = useQuery({
    queryKey: ['hhIntegrationStatus'],
    queryFn: async () => {
      try {
        return await api.post('/v1/hh_ru/is_token', {});
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    enabled: !!accessToken,
    retry: false,
  });

  const {
    resumes,
    isFetchingResumes: isLoadingResumes,
    fetchResumes,
  } = useSearchStore();

  useEffect(() => {
    if (isHhIntegrated) {
      fetchResumes();
    }
  }, [isHhIntegrated, fetchResumes]);

  const handleHhIntegration = async () => {
    try {
      const { data } = await api.get('/v1/hh_ru/get_auth_url');
      if (data) {
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(
          data,
          'hhAuth',
          `width=${width},height=${height},left=${left},top=${top}`,
        );
      }
    } catch (error) {
      console.error('Failed to get HH.ru auth URL', error);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'hh_auth_success') {
        checkHhIntegration();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [checkHhIntegration]);

  return (
    <div className="mb-6 space-y-6">
      {isCheckingIntegration && <Skeleton className="h-32 w-full" />}

      {!isCheckingIntegration && (
        <Card>
          <CardHeader>
            <CardTitle>Интеграция с HeadHunter</CardTitle>
            <CardDescription>
              {isHhIntegrated
                ? 'Ваш аккаунт HeadHunter успешно подключен. Вы можете сменить аккаунт в любой момент.'
                : 'Для полноценной работы сервиса необходимо подключить ваш аккаунт hh.ru.'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleHhIntegration}>
              {isHhIntegrated
                ? 'Сменить аккаунт HeadHunter'
                : 'Подключить hh.ru'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {isHhIntegrated && isLoadingResumes && (
        <Skeleton className="h-32 w-full" />
      )}

      {isHhIntegrated && !isLoadingResumes && !resumes?.length && (
        <Card>
          <CardHeader>
            <CardTitle>Нет активных резюме</CardTitle>
            <CardDescription>
              Мы не нашли у вас активных резюме на hh.ru. Пожалуйста, создайте
              или активируйте резюме для продолжения работы.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <a
              href="https://hh.ru/applicant/resumes"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Перейти к резюме на hh.ru</Button>
            </a>
          </CardFooter>
        </Card>
      )}

      {isHhIntegrated && !isLoadingResumes && !!resumes?.length && (
        <Card>
          <CardHeader>
            <CardTitle>Все готово к работе!</CardTitle>
            <CardDescription>
              Ваш аккаунт hh.ru успешно подключен, и у нас есть доступ к вашим
              резюме. Теперь вы можете начать поиск вакансий или настроить
              автоотклики.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};
