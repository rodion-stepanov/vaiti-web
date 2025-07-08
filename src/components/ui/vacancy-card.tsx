import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import { Button } from './button';

interface Vacancy {
  id: string;
  name: string;
  employer: {
    name: string;
    logo_urls?: { [key: string]: string };
  };
  salary_range?: {
    from?: number;
    to?: number;
    currency?: string;
  };
  area: {
    name: string;
  };
  snippet: {
    requirement: string;
    responsibility: string;
  };
  alternate_url: string;
}

interface VacancyCardProps {
  vacancy: Vacancy;
}

const formatSalary = (salary?: Vacancy['salary_range']) => {
  if (!salary) return 'З/п не указана';
  const { from, to, currency } = salary;
  if (from && to) return `${from} - ${to} ${currency}`;
  if (from) return `от ${from} ${currency}`;
  if (to) return `до ${to} ${currency}`;
  return 'З/п не указана';
};

export const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy }) => {
  return (
    <Card className="mb-4 w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <a
              href={vacancy.alternate_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CardTitle className="text-lg hover:underline">
                {vacancy.name}
              </CardTitle>
            </a>
            <p className="text-muted-foreground mt-1 text-sm">
              {vacancy.employer.name}
            </p>
          </div>
          {vacancy.employer.logo_urls?.['90'] && (
            <img
              src={vacancy.employer.logo_urls['90']}
              alt={`${vacancy.employer.name} logo`}
              className="ml-4 w-12 rounded-md"
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-base font-semibold">
          {formatSalary(vacancy.salary_range)}
        </p>
        <p className="text-muted-foreground mb-4 text-sm">
          {vacancy.area.name}
        </p>
        <div className="space-y-2 text-sm">
          <p>
            <strong className="font-medium">Требования:</strong>{' '}
            {vacancy.snippet.requirement}
          </p>
          <p>
            <strong className="font-medium">Обязанности:</strong>{' '}
            {vacancy.snippet.responsibility}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>Откликнуться</Button>
      </CardFooter>
    </Card>
  );
};
