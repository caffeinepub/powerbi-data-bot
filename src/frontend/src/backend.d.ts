import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DataSource {
    id: string;
    url: string;
    name: string;
}
export interface AIQuery {
    id: string;
    result: string;
    queryText: string;
}
export interface BotConfig {
    id: string;
    queries: Array<AIQuery>;
    dataSources: Array<DataSource>;
}
export interface backendInterface {
    addDataSource(id: string, name: string, url: string): Promise<void>;
    createBotConfig(id: string, dataSourceIds: Array<string>, queries: Array<AIQuery>): Promise<void>;
    getAllBotConfigs(): Promise<Array<BotConfig>>;
    getAllDataSources(): Promise<Array<DataSource>>;
    getBotConfig(id: string): Promise<BotConfig>;
    getDataSource(id: string): Promise<DataSource>;
}
