import {
  createFileRoute,
  Link,
  Outlet,
  useMatches,
} from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HhIntegration } from '@/components/dashboard/hh-integration';

const isAggregatorEnabled = false;

const DashboardComponent = () => {
  const matches = useMatches();
  const activeMatch = matches[matches.length - 1];

  const getActiveTab = () => {
    if (!activeMatch) return 'auto-apply';
    if (activeMatch.routeId === '/_authenticated/dashboard/aggregator')
      return 'aggregator';
    if (activeMatch.routeId === '/_authenticated/dashboard/auto-apply')
      return 'auto-apply';
    return 'auto-apply';
  };

  return (
    <div className="container mx-auto p-4 pt-12 md:pt-24">
      <HhIntegration />

      <Tabs defaultValue={getActiveTab()} className="w-full">
        <TabsList className="mx-auto grid w-full max-w-lg grid-cols-2">
          <TabsTrigger value="auto-apply" asChild>
            <Link to="/dashboard/auto-apply">Автоотклик</Link>
          </TabsTrigger>

          <TabsTrigger value="aggregator" asChild>
            <Link to="/dashboard/aggregator">
              {isAggregatorEnabled ? 'Агрегатор' : 'В разработке'}
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardComponent,
});
