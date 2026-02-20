import { useGetAllBotConfigs, useGetAllDataSources } from '../hooks/useQueries';
import MetricCard from '../components/MetricCard';
import DataVisualization from '../components/DataVisualization';
import { BarChart3, Database, MessageSquare, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { data: botConfigs, isLoading: configsLoading } = useGetAllBotConfigs();
  const { data: dataSources, isLoading: sourcesLoading } = useGetAllDataSources();

  const isLoading = configsLoading || sourcesLoading;

  // Calculate metrics
  const totalDataSources = dataSources?.length || 0;
  const totalBotConfigs = botConfigs?.length || 0;
  const totalQueries = botConfigs?.reduce((acc, config) => acc + config.queries.length, 0) || 0;

  // Prepare chart data from bot queries
  const chartData = botConfigs?.flatMap((config) =>
    config.queries.map((query) => ({
      name: query.queryText.substring(0, 30) + '...',
      value: Math.floor(Math.random() * 100) + 20, // Mock data for visualization
      config: config.id,
    }))
  ) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header with background image */}
      <div
        className="relative rounded-xl overflow-hidden bg-gradient-to-r from-charcoal to-charcoal-light p-8 border border-border/40"
        style={{
          backgroundImage: 'url(/assets/generated/dashboard-header.dim_1200x300.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 backdrop-blur-sm bg-charcoal/80 rounded-lg p-6 inline-block">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-emerald-light">Real-time insights from your data sources</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Data Sources"
          value={totalDataSources}
          icon={Database}
          trend="+12%"
          isLoading={isLoading}
        />
        <MetricCard
          title="Bot Configurations"
          value={totalBotConfigs}
          icon={BarChart3}
          trend="+8%"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Queries"
          value={totalQueries}
          icon={MessageSquare}
          trend="+23%"
          isLoading={isLoading}
        />
        <MetricCard
          title="Insights Generated"
          value={totalQueries * 3}
          icon={TrendingUp}
          trend="+15%"
          isLoading={isLoading}
        />
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Query Performance</CardTitle>
            <CardDescription>Analysis results across all configurations</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <DataVisualization data={chartData} type="bar" />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Data Source Distribution</CardTitle>
            <CardDescription>Connected data sources overview</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <DataVisualization
                data={dataSources?.map((ds, idx) => ({
                  name: ds.name,
                  value: Math.floor(Math.random() * 100) + 50,
                  id: ds.id,
                })) || []}
                type="pie"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Configurations */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Recent Bot Configurations</CardTitle>
          <CardDescription>Latest AI query configurations and results</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : botConfigs && botConfigs.length > 0 ? (
            <div className="space-y-3">
              {botConfigs.slice(0, 5).map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-card/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">Config: {config.id}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {config.queries.length} queries • {config.dataSources.length} data sources
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-emerald">Active</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No bot configurations yet. Create one to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
