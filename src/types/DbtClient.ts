export interface DbtRunParams {
  select?: string;
  exclude?: string;
  selector?: string;
  defer?: boolean;
  noDefer?: boolean;
  state?: string;
  fullRefresh?: boolean;
  threads?: number;
  noVersionCheck?: boolean;
  failFast?: boolean;
  vars?: string;
}

export interface DbtTestParams {
  select?: string;
  exclude?: string;
  selector?: string;
  defer?: boolean;
  noDefer?: boolean;
  state?: string;
  threads?: number;
  noVersionCheck?: boolean;
  failFast?: boolean;
  vars?: string;
  storeFailures?: boolean;
  indirectSelection?: "eager" | "cautious";
}

export interface DbtBuildParams {
  select?: string;
  exclude?: string;
  selector?: string;
  defer?: boolean;
  noDefer?: boolean;
  state?: string;
  fullRefresh?: boolean;
  threads?: number;
  noVersionCheck?: boolean;
  failFast?: boolean;
  vars?: string;
  storeFailures?: boolean;
  indirectSelection?: "eager" | "cautious";
  resourceType: "snapshot" | "seed" | "test" | "model" | "all";
}

export interface DbtSnapshotParams {
  select?: string;
  exclude?: string;
  selector?: string;
  defer?: boolean;
  noDefer?: boolean;
  state?: string;
  fullRefresh?: boolean;
  threads?: number;
  noVersionCheck?: boolean;
  vars?: string;
}

export interface DbtSeedParams {
  select?: string;
  exclude?: string;
  selector?: string;
  state?: string;
  fullRefresh?: boolean;
  threads?: number;
  noVersionCheck?: boolean;
  vars?: string;
  show?: boolean;
}

export interface DbtCompileParams {
  select?: string;
  exclude?: string;
  selector?: string;
  state?: string;
  fullRefresh?: boolean;
  threads?: number;
  noVersionCheck?: boolean;
  vars?: string;
  parseOnly?: boolean;
}

export type DbtDocsParams =
  | {
      operation: "generate";
      noCompile?: boolean;
    }
  | { operation: "serve"; port?: number };

export interface DbtLsParams {
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
}

export interface DbtRunOperationParams {
  operation: string;
  args?: Record<string, string>;
}

export interface IDbtClient {
  run: (params?: DbtRunParams) => Promise<string>;
  test: (params?: DbtTestParams) => Promise<string>;
  build: (params?: DbtBuildParams) => Promise<string>;
  snapshot: (params?: DbtSnapshotParams) => Promise<string>;
  seed: (params?: DbtSeedParams) => Promise<string>;
  compile: (params?: DbtCompileParams) => Promise<string>;
  runOperation: (params: DbtRunOperationParams) => Promise<string>;
  docs: (params: DbtDocsParams) => Promise<string>;
  ls: (params?: DbtLsParams) => Promise<string>;
}
