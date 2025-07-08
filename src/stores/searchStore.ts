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
  coverLetter: string;
  keywordsToExclude: string[];
}

interface SearchState {
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
}

const testCoverLetter =
  'Здравствуйте,\n\nПрошу рассмотреть мою кандидатуру на позицию тестировщика-автоматизатора. У меня есть опыт в автоматизации тестирования и стремление развиваться в этой сфере.\n\nВ своей работе я использовал различные инструменты и подходы для создания автотестов, участвовал в написании и поддержке тестовых фреймворков, а также в интеграции тестов в процессы CI/CD. Хорошо знаком с принципами тестирования, умею анализировать требования и находить потенциальные проблемы еще на этапе проектирования.\n\nЯ ценю командную работу, но также могу эффективно действовать самостоятельно. Открыт к новым знаниям, быстро осваиваю новые технологии и стремлюсь к тому, чтобы обеспечивать высокое качество продукта.\n\nБлагодарю за рассмотрение моей кандидатуры. Буду рад возможности пройти собеседование и обсудить, как могу быть полезен вашей команде.';

export const useSearchStore = create<SearchState>((set, get) => ({
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
      console.log('resumes:', resumes);
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
        order_by: 'publication_time',
        search_field: 'name',
        isSimilarSearch: true,
        coverLetter: testCoverLetter,
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
}));
