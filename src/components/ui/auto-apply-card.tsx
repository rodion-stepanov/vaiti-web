import React from 'react';
import { useSearchStore } from '../../stores/searchStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
import { Label } from './label';
import { Textarea } from './textarea';
import { Input } from './input';
import { Button } from './button';

export const AutoApplyCard: React.FC = () => {
  const {
    filters,
    setFilters,
    filteredCount,
    isFiltering,
    isApplying,
    error,
    applySuccessMessage,
    fetchFilteredVacancies,
    applyToVacancies,
  } = useSearchStore();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFilters({ [name]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Автоотклик</CardTitle>
        <CardDescription>
          Настройте и запустите автоматическую отправку откликов на подходящие
          вакансии.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="coverLetter">Сопроводительное письмо</Label>
          <Textarea
            id="coverLetter"
            name="coverLetter"
            value={filters.coverLetter || ''}
            onChange={handleInputChange}
            placeholder="Напишите здесь ваше сопроводительное письмо..."
            rows={5}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="keywordsToExclude">
            Исключить вакансии со словами
          </Label>
          <Input
            id="keywordsToExclude"
            name="keywordsToExclude"
            value={filters.keywordsToExclude || ''}
            onChange={handleInputChange}
            placeholder="Например: стажер, ассистент, курьер"
          />
          <p className="text-muted-foreground text-xs">
            Перечислите слова через запятую.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch space-y-4">
        {applySuccessMessage && (
          <p className="text-center text-sm font-semibold text-green-600">
            {applySuccessMessage}
          </p>
        )}
        {error && (
          <p className="text-destructive text-center text-sm font-semibold">
            {error}
          </p>
        )}

        <Button
          onClick={fetchFilteredVacancies}
          disabled={isFiltering || isApplying}
        >
          {isFiltering
            ? 'Проверяем...'
            : 'Проверить кол-во подходящих вакансий'}
        </Button>

        {filteredCount !== null && !applySuccessMessage && (
          <div className="text-center text-sm">
            <p className="mb-2">
              Найдено <span className="font-bold">{filteredCount}</span> новых
              вакансий для отклика.
            </p>
            {filteredCount > 0 && (
              <Button
                onClick={applyToVacancies}
                disabled={isApplying || filteredCount === 0}
                className="w-full"
              >
                {isApplying
                  ? 'Отправляем...'
                  : `Откликнуться на ${filteredCount} вакансий`}
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
