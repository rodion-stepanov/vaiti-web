import React, { useEffect, useState, type JSX } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Switch } from './switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Skeleton } from './skeleton';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { Resume } from '@/stores/searchStore';
import { getAreas, type Area } from '@/lib/hhApi';

// --- Keyword Filter ---
interface InputFilterProps {
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}
export const KeywordFilter = React.memo(
  ({ value, onChange }: InputFilterProps) => (
    <div className="space-y-2">
      <Label htmlFor="text">Ключевые слова</Label>
      <Input
        id="text"
        name="text"
        value={value}
        onChange={onChange}
        placeholder="Например, Python разработчик"
      />
    </div>
  ),
);

// --- Resume Select Filter ---
interface ResumeSelectFilterProps {
  isFetching: boolean;
  resumes: Resume[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
export const ResumeSelectFilter = React.memo(
  ({ isFetching, resumes, selectedId, onSelect }: ResumeSelectFilterProps) => (
    <div className="space-y-2">
      <Label>Резюме</Label>
      {isFetching ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select
          value={selectedId ?? ''}
          onValueChange={onSelect}
          disabled={resumes.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите резюме" />
          </SelectTrigger>
          <SelectContent>
            {resumes.map((resume) => (
              <SelectItem key={resume.id} value={resume.id}>
                {resume.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  ),
);

// --- Location Filter ---
interface LocationFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const LocationFilter = React.memo(
  ({ value, onChange }: LocationFilterProps) => {
    const [areas, setAreas] = useState<Area[]>([]);
    const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());

    useEffect(() => {
      getAreas().then(setAreas);
    }, []);

    const toggleArea = (areaId: string) => {
      setExpandedAreas((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(areaId)) {
          newSet.delete(areaId);
        } else {
          newSet.add(areaId);
        }
        return newSet;
      });
    };

    const renderAreas = (areas: Area[], depth = 0): JSX.Element[] => {
      return areas.flatMap((area) => {
        const hasChildren = area.areas && area.areas.length > 0;
        const isExpanded = expandedAreas.has(area.id);

        const item = (
          <SelectItem
            key={area.id}
            value={area.id}
            style={{ paddingLeft: `${depth * 1.5}rem` }}
            className="flex items-center"
          >
            <div className="flex items-center">
              {hasChildren && (
                <button
                  className="mr-2 h-4 w-4 text-gray-500 hover:text-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleArea(area.id);
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              <span className={!hasChildren ? 'ml-6' : ''}>{area.name}</span>
            </div>
          </SelectItem>
        );

        const children =
          hasChildren && isExpanded ? renderAreas(area.areas, depth + 1) : [];

        return [item, ...children];
      });
    };

    return (
      <div className="space-y-2">
        <Label htmlFor="area">Локация</Label>
        <Select name="area" value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите регион" />
          </SelectTrigger>
          <SelectContent>{renderAreas(areas)}</SelectContent>
        </Select>
      </div>
    );
  },
);

// --- Experience Filter ---
interface ExperienceFilterProps {
  value: string;
  onSelect: (value: string) => void;
}
export const ExperienceFilter = React.memo(
  ({ value, onSelect }: ExperienceFilterProps) => (
    <div className="space-y-2">
      <Label>Опыт работы</Label>
      <Select value={value} onValueChange={onSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Опыт работы" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="noExperience">Нет опыта</SelectItem>
          <SelectItem value="between1And3">1–3 года</SelectItem>
          <SelectItem value="between3And6">3–6 лет</SelectItem>
          <SelectItem value="moreThan6">Более 6 лет</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
);

// --- Salary Filter ---
interface SalaryFilterProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const SearchFieldFilter = React.memo(
  ({ value, onSelect }: ExperienceFilterProps) => (
    <div className="space-y-2">
      <Label>Искать в</Label>
      <Select value={value} onValueChange={onSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Поле для поиска" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">в названии вакансии</SelectItem>
          <SelectItem value="company_name">в названии компании</SelectItem>
          <SelectItem value="description">в описании вакансии</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
);

export const OrderByFilter = React.memo(
  ({ value, onSelect }: ExperienceFilterProps) => (
    <div className="space-y-2">
      <Label>Сортировать по</Label>
      <Select value={value} onValueChange={onSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Сортировка" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="publication_time">по дате</SelectItem>
          <SelectItem value="salary_desc">по убыванию дохода</SelectItem>
          <SelectItem value="salary_asc">по возрастанию дохода</SelectItem>
          <SelectItem value="relevance">по соответствию</SelectItem>
          <SelectItem value="distance">по удалённости</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
);

export const SalaryFilter = React.memo(
  ({ value, onChange }: SalaryFilterProps) => (
    <div className="space-y-2">
      <Label htmlFor="salary">Зарплата</Label>
      <Input
        id="salary"
        name="salary"
        value={value}
        onChange={onChange}
        placeholder="От..."
        inputMode="numeric"
        pattern="[0-9]*"
      />
    </div>
  ),
);

// --- Cover Letter Filter ---
export const CoverLetterFilter = React.memo(
  ({ value, onChange }: InputFilterProps) => (
    <div className="space-y-2">
      <Label htmlFor="coverLetter">Сопроводительное письмо</Label>
      <Textarea
        id="coverLetter"
        name="coverLetter"
        placeholder="Введите сопроводительное письмо"
        value={value}
        onChange={onChange}
        className="h-32"
      />
    </div>
  ),
);

// --- Salary Switch Filter ---
interface SalarySwitchFilterProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
export const SalarySwitchFilter = React.memo(
  ({ checked, onCheckedChange }: SalarySwitchFilterProps) => (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="only_with_salary">Только с зарплатой</Label>
      <Switch
        id="only_with_salary"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  ),
);
