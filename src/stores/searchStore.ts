import { create } from 'zustand';
import { isApiError } from '@/lib/typeguards';
import { api } from '../lib/api';

// Based on the provided API documentation
export interface Vacancy {
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

export interface Resume {
  id: string;
  title: string;
}

interface Filters {
  resumeId: string;
  text: string;
  experience: 'noExperience' | 'between1And3' | 'between3And6' | 'moreThan6';
  area: string;
  only_with_salary: boolean;
  salary: string;
  employment: string;
  schedule: string;
  coverLetter?: string;
  order_by?: string;
  search_field?: string;
  keywordsToExclude: string[];
}

export type Scheduler = {
  id: number;
  name: string;
  enabled: boolean;
  createdAt: string;
  params: {
    text?: string;
    area?: string;
    experience?: string;
    employment?: string;
    schedule?: string;
    industry?: string;
    salary?: number;
    only_with_salary?: boolean;
    order_by?: string;
  };
};

interface SearchState {
  schedulers: Scheduler[];
  isLoadingSchedulers: boolean;
  schedulerError: string | null;
  vacancies: Vacancy[];
  filteredCount: number | null;
  resumes: Resume[];
  selectedResumeId: string | null;
  filters: Partial<
    Omit<Filters, 'keywordsToExclude'> & { keywordsToExclude: string }
  >;
  isLoading: boolean;
  isFetchingResumes: boolean;
  isFiltering: boolean;
  isApplying: boolean;
  error: string | null;
  applySuccessMessage: string | null;
  setFilters: (newFilters: Partial<SearchState['filters']>) => void;
  setSelectedResumeId: (id: string | null) => void;
  fetchResumes: () => Promise<void>;
  fetchVacancies: () => Promise<void>;
  fetchFilteredVacancies: () => Promise<void>;
  applyToVacancies: () => Promise<void>;
  fetchSchedulers: () => Promise<void>;
  getScheduler: (id: number) => Promise<Scheduler | undefined>;
  deleteScheduler: (id: number) => Promise<void>;
  toggleScheduler: (schedulerId: number) => void;
}

const testCoverLetter =
  'Здравствуйте,\n\nПрошу рассмотреть мою кандидатуру на позицию тестировщика-автоматизатора. У меня есть опыт в автоматизации тестирования и стремление развиваться в этой сфере.\n\nВ своей работе я использовал различные инструменты и подходы для создания автотестов, участвовал в написании и поддержке тестовых фреймворков, а также в интеграции тестов в процессы CI/CD. Хорошо знаком с принципами тестирования, умею анализировать требования и находить потенциальные проблемы еще на этапе проектирования.\n\nЯ ценю командную работу, но также могу эффективно действовать самостоятельно. Открыт к новым знаниям, быстро осваиваю новые технологии и стремлюсь к тому, чтобы обеспечивать высокое качество продукта.\n\nБлагодарю за рассмотрение моей кандидатуры. Буду рад возможности пройти собеседование и обсудить, как могу быть полезен вашей команде.';

export const useSearchStore = create<SearchState>((set, get) => ({
  schedulers: [],
  isLoadingSchedulers: false,
  schedulerError: null,
  vacancies: [],
  filteredCount: null,
  resumes: [],
  selectedResumeId: null,
  filters: {
    text: '',
    only_with_salary: false,
    experience: 'noExperience',
    area: '',
    coverLetter: '',
    order_by: 'publication_time',
    search_field: 'name',
    keywordsToExclude: '',
  },
  isLoading: false,
  isFetchingResumes: false,
  isFiltering: false,
  isApplying: false,
  error: null,
  applySuccessMessage: null,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      // Reset messages on filter change
      applySuccessMessage: null,
      error: null,
      filteredCount: null,
    }));
  },

  setSelectedResumeId: (id) => {
    set({
      selectedResumeId: id,
      applySuccessMessage: null,
      error: null,
      filteredCount: null,
    });
  },

  fetchResumes: async () => {
    set({ isFetchingResumes: true });
    try {
      const response = await api.get('/v1/hh_ru/resume');
      const resumes = response.data || [];
      set({ resumes, isFetchingResumes: false });
      if (resumes.length > 0 && !get().selectedResumeId) {
        set({ selectedResumeId: resumes[0].id });
      }
    } catch (e) {
      console.error('Failed to fetch resumes', e);
      set({ isFetchingResumes: false });
    }
  },

  fetchVacancies: async () => {
    const { filters, selectedResumeId } = get();
    if (!selectedResumeId) {
      set({ error: 'Пожалуйста, выберите резюме для поиска.' });
      return;
    }

    set({ isLoading: true, error: null, applySuccessMessage: null });
    try {
      const { keywordsToExclude, ...rest } = filters;
      const payload = {
        ...rest,
        keywordsToExclude:
          keywordsToExclude
            ?.split(',')
            .map((k) => k.trim())
            .filter(Boolean) || [],
        resumeId: selectedResumeId,
        count: 50,
      };
      const response = await api.post('/v1/hh/vacancies/all', payload);
      set({ vacancies: response.data || [], isLoading: false });
    } catch (e) {
      const errorMessage = isApiError(e)
        ? e.response.data.message
        : 'Не удалось загрузить вакансии.';
      set({ error: errorMessage, isLoading: false, vacancies: [] });
    }
  },

  fetchFilteredVacancies: async () => {
    const { filters, selectedResumeId } = get();
    if (!selectedResumeId) {
      set({ error: 'Пожалуйста, выберите резюме.' });
      return;
    }
    set({ isFiltering: true, error: null, applySuccessMessage: null });
    try {
      const { keywordsToExclude, ...rest } = filters;
      const payload = {
        ...rest,
        keywordsToExclude:
          keywordsToExclude
            ?.split(',')
            .map((k) => k.trim())
            .filter(Boolean) || [],
        resumeId: selectedResumeId,
      };
      const response = await api.post('/v1/hh/vacancies/all_filter', payload);
      set({ filteredCount: response.data, isFiltering: false });
    } catch (e) {
      const errorMessage = isApiError(e)
        ? e.response.data.message
        : 'Не удалось отфильтровать вакансии.';
      set({ error: errorMessage, isFiltering: false });
    }
  },

  applyToVacancies: async () => {
    const { filters, selectedResumeId } = get();
    if (!selectedResumeId) {
      set({ error: 'Пожалуйста, выберите резюме.' });
      return;
    }
    set({ isApplying: true, error: null, applySuccessMessage: null });
    try {
      const { keywordsToExclude, ...rest } = filters;
      const payload = {
        ...rest,
        count: 100,
        nameRequest: '',
        isSimilarSearch: true,
        keywordsToExclude:
          keywordsToExclude
            ?.split(',')
            .map((k) => k.trim())
            .filter(Boolean) || [],
        resumeId: selectedResumeId,
      };

      await api.post('/v1/hh/vacancies/apply-to-vacancies', payload);
      set({
        applySuccessMessage: 'Отклики успешно отправлены!',
        isApplying: false,
        filteredCount: 0,
      });
    } catch (e) {
      const errorMessage = isApiError(e)
        ? e.response.data.message
        : 'Произошла ошибка при отправке откликов.';
      set({ error: errorMessage, isApplying: false });
    }
  },

  fetchSchedulers: async () => {
    set({ isLoadingSchedulers: true, schedulerError: null });
    try {
      const response = await api.get<Scheduler[]>('/v1/scheduler/all');
      set({ schedulers: response.data, isLoadingSchedulers: false });
    } catch (e) {
      const errorMessage = isApiError(e)
        ? e.response.data.message
        : 'Произошла ошибка при загрузке расписаний.';
      set({ schedulerError: errorMessage, isLoadingSchedulers: false });
    }
  },

  getScheduler: async (id: number) => {
    set({ isLoadingSchedulers: true, schedulerError: null });
    try {
      const response = await api.get<Scheduler>(`/v1/scheduler/${id}`);
      set({ isLoadingSchedulers: false });
      return response.data;
    } catch (e) {
      const errorMessage = isApiError(e)
        ? e.response.data.message
        : 'Произошла ошибка при загрузке расписания.';
      set({ schedulerError: errorMessage, isLoadingSchedulers: false });
      return undefined;
    }
  },

  toggleScheduler: (schedulerId: number) => {
    set((state) => ({
      schedulers: state.schedulers.map((s) =>
        s.id === schedulerId ? { ...s, enabled: !s.enabled } : s,
      ),
    }));
  },

  deleteScheduler: async (id: number) => {
    set({ isLoadingSchedulers: true, schedulerError: null });
    try {
      await api.delete(`/v1/scheduler/${id}`);
      set((state) => ({
        schedulers: state.schedulers.filter((s) => s.id !== id),
        isLoadingSchedulers: false,
      }));
    } catch (e) {
      const errorMessage = isApiError(e)
        ? e.response.data.message
        : 'Произошла ошибка при удалении расписания.';
      set({ schedulerError: errorMessage, isLoadingSchedulers: false });
    }
  },
}));
