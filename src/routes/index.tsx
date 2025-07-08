import { createFileRoute, Link } from '@tanstack/react-router';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import logo from '@/assets/logo.png';
import { Rocket, Search, Zap } from 'lucide-react';

const LandingComponent: React.FC = () => {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="grow">
        <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center">
          <img
            src={logo}
            alt="Вайти Лого"
            className="mb-8 h-32 w-32 rounded-4xl"
          />
          <h1 className="text-foreground mb-6 text-5xl font-extrabold tracking-tight md:text-6xl">
            Автоматизируйте поиск работы на hh.ru
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            Наш сервис позволяет настроить автоматические отклики на вакансии,
            использовать умные фильтры и находить лучшие предложения, экономя
            ваше время.
          </p>
          <Button asChild size="lg">
            <Link to="/auth">Зарегистрироваться</Link>
          </Button>
        </section>

        <section className="bg-secondary/50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Ключевые возможности
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <Zap className="text-primary mb-4 h-12 w-12" />
                  <CardTitle>Авто-отклики</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    Настройте один раз и получайте приглашения. Наш бот будет
                    сам откликаться на подходящие вакансии.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <Search className="text-primary mb-4 h-12 w-12" />
                  <CardTitle>Умный поиск</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    Используйте гибкие фильтры по специализации, локации и
                    опыту, чтобы находить только то, что вам нужно.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <Rocket className="text-primary mb-4 h-12 w-12" />
                  <CardTitle>Интеграция с HH.ru</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    Полная и безопасная интеграция с вашим профилем HeadHunter
                    для управления резюме и откликами.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Готовы найти работу мечты?
          </h2>
          <p className="text-muted-foreground mb-8">
            Присоединяйтесь к сотням пользователей, которые уже ускорили свой
            поиск.
          </p>
          <Button asChild size="lg">
            <Link to="/auth">Зарегистрироваться</Link>
          </Button>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="text-muted-foreground container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Вайти. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: LandingComponent,
});
