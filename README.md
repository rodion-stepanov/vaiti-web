# VAITI Web

Это веб-приложение, агрегатор вакансий с возможностью автоматического отклика.

## Стек технологий

*   **Фреймворк:** React
*   **Язык:** TypeScript
*   **Сборщик:** Vite
*   **Роутинг:** TanStack Router
*   **Стилизация:** Tailwind CSS
*   **Стейт-менеджер:** Zustand

## Локальный запуск

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/rodion-stepanov/vaiti-web.git
    cd vaiti-web
    ```

2.  **Установите зависимости:**
    ```bash
    npm install
    ```

3.  **Запустите сервер для разработки:**
    ```bash
    npm run dev
    ```
    Приложение будет доступно по адресу `http://localhost:5173`.

## Скрипты

*   `npm run dev`: запуск сервера для разработки.
*   `npm run build`: сборка проекта для продакшена.
*   `npm run lint`: проверка кода с помощью ESLint.
*   `npm run preview`: предпросмотр продакшен-сборки.
*   `npm run deploy`: развертывание на GitHub Pages.

## Развертывание

Проект автоматически развертывается на [GitHub Pages](https://rodion-stepanov.github.io/vaiti-web/) при каждом пуше в ветку `main`.
