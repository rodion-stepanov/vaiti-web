import React from 'react';
import { Input } from './input';
import { Label } from './label';
import { Switch } from './switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Skeleton } from './skeleton';
import type { Resume } from '@/stores/searchStore';

// --- Keyword Filter ---
interface KeywordFilterProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const KeywordFilter = React.memo(({ value, onChange }: KeywordFilterProps) => (
  <div>
    <Label htmlFor="text">Ключевые слова</Label>
    <Input id="text" name="text" value={value} onChange={onChange} placeholder="Например, Python разработчик" />
  </div>
));

// --- Resume Select Filter ---
interface ResumeSelectFilterProps {
  isFetching: boolean;
  resumes: Resume[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
export const ResumeSelectFilter = React.memo(({ isFetching, resumes, selectedId, onSelect }: ResumeSelectFilterProps) => (
  <div>
    <Label>Резюме</Label>
    {isFetching ? (
      <Skeleton className="h-10 w-full" />
    ) : (
      <Select value={selectedId ?? ''} onValueChange={onSelect} disabled={resumes.length === 0}>
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
));

// --- Location Filter ---
interface LocationFilterProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const LocationFilter = React.memo(({ value, onChange }: LocationFilterProps) => (
  <div>
    <Label htmlFor="area">Локация</Label>
    <Input id="area" name="area" value={value} onChange={onChange} placeholder="Например, Москва" />
  </div>
));

// --- Experience Filter ---
interface ExperienceFilterProps {
  value: string;
  onSelect: (value: string) => void;
}
export const ExperienceFilter = React.memo(({ value, onSelect }: ExperienceFilterProps) => (
  <div>
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
));

// --- Salary Filter ---
interface SalaryFilterProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const SalaryFilter = React.memo(({ value, onChange }: SalaryFilterProps) => (
  <div>
    <Label htmlFor="salary">Зарплата</Label>
    <Input id="salary" name="salary" value={value} onChange={onChange} placeholder="От..." inputMode="numeric" pattern="[0-9]*" />
  </div>
));

// --- Salary Switch Filter ---
interface SalarySwitchFilterProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
export const SalarySwitchFilter = React.memo(({ checked, onCheckedChange }: SalarySwitchFilterProps) => (
  <div className="flex items-center justify-around pt-4">
    <Label htmlFor="only_with_salary" className="mb-0">Только с зарплатой</Label>
    <Switch id="only_with_salary" checked={checked} onCheckedChange={onCheckedChange} />
  </div>
));
