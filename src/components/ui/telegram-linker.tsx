import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';
import { Input } from './input';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';

export const TelegramLinker = () => {
  const [linkingCode, setLinkingCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLinkingCode = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/v1/telegram/link');
      setLinkingCode(data);
      toast.success('Код для привязки успешно получен!');
    } catch (error) {
      console.error('Failed to get Telegram linking code', error);
      toast.error('Не удалось получить код для привязки. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (linkingCode) {
      navigator.clipboard.writeText(`/link ${linkingCode}`);
      toast.success('Команда для бота скопирована в буфер обмена!');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Привязка Telegram</CardTitle>
        <CardDescription>
          Привяжите свой Telegram аккаунт, чтобы получать уведомления о новых
          подходящих вакансиях и статусе автооткликов.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!linkingCode ? (
          <Button onClick={getLinkingCode} disabled={isLoading}>
            {isLoading ? 'Получение кода...' : 'Получить код для привязки'}
          </Button>
        ) : (
          <div className="space-y-4">
            <p>
              Ваш код для привязки готов. Отправьте следующую команду боту{' '}
              <a
                href="https://t.me/Denis_Super_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                @Denis_Super_bot
              </a>
              :
            </p>
            <div className="flex items-center space-x-2">
              <Input
                readOnly
                value={`/link ${linkingCode}`}
                className="font-mono"
              />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Этот код действителен в течение 5 минут.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
