interface IDbtClient {
  ls: (params: {
    resourceType?:
      | "metric"
      | "analysis"
      | "seed"
      | "snapshot"
      | "source"
      | "test"
      | "model"
      | "exposure"
      | "default"
      | "all";
    output?: "json" | "name" | "path" | "selector";
    outputKeys?: string; // TODO: we could probably type this
    select?: string;
    exclude?: string;
  }) => Promise<string>;

  runOperation: (params: {
    operation: string;
    args?: Record<string, string>;
  }) => Promise<string>;
}
