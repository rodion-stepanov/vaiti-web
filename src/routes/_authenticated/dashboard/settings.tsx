import { TelegramLinker } from '@/components/ui/telegram-linker';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard/settings')({
  component: Settings,
});

function Settings() {
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Настройки</h1>
      <TelegramLinker />
    </div>
  );
}
