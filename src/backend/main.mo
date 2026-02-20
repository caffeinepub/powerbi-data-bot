import MixinStorage "blob-storage/Mixin";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  public type DataSource = {
    id : Text;
    name : Text;
    url : Text;
  };

  public type AIQuery = {
    id : Text;
    queryText : Text;
    result : Text;
  };

  public type BotConfig = {
    id : Text;
    dataSources : [DataSource];
    queries : [AIQuery];
  };

  let configMap = Map.empty<Text, BotConfig>();
  let dataSourceMap = Map.empty<Text, DataSource>();

  public shared ({ caller }) func addDataSource(id : Text, name : Text, url : Text) : async () {
    let dataSource : DataSource = {
      id;
      name;
      url;
    };
    dataSourceMap.add(id, dataSource);
  };

  public query ({ caller }) func getDataSource(id : Text) : async DataSource {
    switch (dataSourceMap.get(id)) {
      case (null) { Runtime.trap("Data source with id " # id # " not found") };
      case (?dataSource) { dataSource };
    };
  };

  public query ({ caller }) func getAllDataSources() : async [DataSource] {
    dataSourceMap.values().toArray();
  };

  public shared ({ caller }) func createBotConfig(id : Text, dataSourceIds : [Text], queries : [AIQuery]) : async () {
    let dataSources = dataSourceIds.map(
      func(dataSourceId) {
        switch (dataSourceMap.get(dataSourceId)) {
          case (null) { Runtime.trap("Data source with id " # dataSourceId # " not found") };
          case (?dataSource) { dataSource };
        };
      }
    );

    let config : BotConfig = {
      id;
      dataSources;
      queries;
    };
    configMap.add(id, config);
  };

  public query ({ caller }) func getBotConfig(id : Text) : async BotConfig {
    switch (configMap.get(id)) {
      case (null) { Runtime.trap("Bot config with id " # id # " not found") };
      case (?config) { config };
    };
  };

  public query ({ caller }) func getAllBotConfigs() : async [BotConfig] {
    configMap.values().toArray();
  };
};
