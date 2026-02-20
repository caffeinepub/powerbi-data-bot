import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Database, ExternalLink } from 'lucide-react';
import type { DataSource } from '../backend';

interface DataSourceListProps {
  dataSources?: DataSource[];
  isLoading: boolean;
}

export default function DataSourceList({ dataSources, isLoading }: DataSourceListProps) {
  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle>Connected Data Sources</CardTitle>
        <CardDescription>
          {dataSources?.length || 0} data source(s) available for analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : dataSources && dataSources.length > 0 ? (
          <div className="space-y-3">
            {dataSources.map((source) => (
              <div
                key={source.id}
                className="flex items-start gap-3 p-4 rounded-lg border border-border/40 bg-card/50 hover:bg-accent/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-emerald/10 flex items-center justify-center flex-shrink-0">
                  <Database className="h-5 w-5 text-emerald" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm truncate">{source.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">ID: {source.id}</p>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald hover:underline flex items-center gap-1 mt-1"
                    >
                      View source
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No data sources uploaded yet.</p>
            <p className="text-xs mt-1">Upload your first data source to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
