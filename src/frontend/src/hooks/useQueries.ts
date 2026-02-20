import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DataSource, BotConfig } from '../backend';

// Query: Get all data sources
export function useGetAllDataSources() {
  const { actor, isFetching } = useActor();

  return useQuery<DataSource[]>({
    queryKey: ['dataSources'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDataSources();
    },
    enabled: !!actor && !isFetching,
  });
}

// Query: Get single data source
export function useGetDataSource(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<DataSource>({
    queryKey: ['dataSource', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getDataSource(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

// Query: Get all bot configs
export function useGetAllBotConfigs() {
  const { actor, isFetching } = useActor();

  return useQuery<BotConfig[]>({
    queryKey: ['botConfigs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBotConfigs();
    },
    enabled: !!actor && !isFetching,
  });
}

// Query: Get single bot config
export function useGetBotConfig(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<BotConfig>({
    queryKey: ['botConfig', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getBotConfig(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

// Mutation: Add data source
export function useAddDataSource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; name: string; url: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addDataSource(params.id, params.name, params.url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataSources'] });
    },
  });
}

// Mutation: Create bot config
export function useCreateBotConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      dataSourceIds: string[];
      queries: Array<{ id: string; queryText: string; result: string }>;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createBotConfig(params.id, params.dataSourceIds, params.queries);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botConfigs'] });
    },
  });
}
