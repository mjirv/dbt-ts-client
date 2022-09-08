import { execFile } from "child_process";
import { promisify } from "util";
import {
  DbtBuildParams,
  DbtCompileParams,
  DbtDepsParams,
  DbtDocsParams,
  DbtLsParams,
  DbtRunOperationParams,
  DbtRunParams,
  DbtSeedParams,
  DbtSnapshotParams,
  DbtTestParams,
  IDbtClient,
} from "./types";
import { toKebabCase } from "./utils/stringFormatting";

export default class DbtClient implements IDbtClient {
  private dbtProjectPath: string;
  private profile?: string;
  private target?: string;
  private profilesDir?: string;
  private quiet?: boolean;
  constructor(props: {
    dbtProjectPath: string;
    profile?: string;
    target?: string;
    profilesDir?: string;
    quiet?: boolean;
  }) {
    if (!props.dbtProjectPath) throw Error("no dbt project path given");
    this.dbtProjectPath = props.dbtProjectPath;
    this.profile = props.profile;
    this.target = props.target;
    this.profilesDir = props.profilesDir;
    this.quiet = props.quiet;
  }

  private static exec = promisify(execFile);

  private static mapParams = (params: Record<string, any> | undefined) =>
    params
      ? Object.entries(params).flatMap(([key, value]) => [
          `--${toKebabCase(key)}`,
          ...(typeof value === "boolean" ? [] : [value]),
        ])
      : [];

  private execDbt = async (
    operation:
      | "docs"
      | "source"
      | "init"
      | "clean"
      | "debug"
      | "deps"
      | "list"
      | "ls"
      | "build"
      | "snapshot"
      | "run"
      | "compile"
      | "parse"
      | "test"
      | "seed"
      | "run-operation",
    args: string[]
  ): Promise<string> => {
    console.debug(`Beginning dbt ${operation}`);
    try {
      const { stdout, stderr } = await DbtClient.exec(
        "dbt",
        [
          ...(this.profilesDir ? ["--profiles-dir", this.profilesDir] : []),
          ...(this.quiet ? ["--quiet"] : []),
          operation,
          ...(this.target ? ["--target", this.target] : []),
          ...(this.profile ? ["--profile", this.profile] : []),
          ...args,
        ],
        {
          cwd: this.dbtProjectPath,
          encoding: "utf-8",
        }
      );
      console.warn(stderr);
      return stdout;
    } catch (error) {
      console.error(`An error occurred while running dbt ${operation}`, error);
      throw new Error((error as { stdout: string }).stdout);
    }
  };

  docs = (params: DbtDocsParams) =>
    this.execDbt("docs", [
      params.operation,
      ...(params.operation === "generate" && params.noCompile
        ? ["--no-compile", "true"]
        : []),
      ...(params.operation === "serve" && params.port
        ? ["--port", params.port.toString()]
        : []),
    ]);

  ls = (params?: DbtLsParams) =>
    this.execDbt("ls", DbtClient.mapParams(params));

  runOperation = (params: DbtRunOperationParams): Promise<string> => {
    const { operation, args } = params;
    return this.execDbt("run-operation", [
      operation,
      ...(args ? ["--args", JSON.stringify(args)] : []),
    ]);
  };

  deps = (params?: DbtDepsParams) =>
    this.execDbt("deps", DbtClient.mapParams(params))

  run = (params?: DbtRunParams) =>
    this.execDbt("run", DbtClient.mapParams(params));

  test = (params?: DbtTestParams) =>
    this.execDbt("test", DbtClient.mapParams(params));

  build = (params?: DbtBuildParams) =>
    this.execDbt("build", DbtClient.mapParams(params));

  compile = (params?: DbtCompileParams) =>
    this.execDbt("compile", DbtClient.mapParams(params));

  snapshot = (params?: DbtSnapshotParams) =>
    this.execDbt("snapshot", DbtClient.mapParams(params));

  seed = (params?: DbtSeedParams) =>
    this.execDbt("seed", DbtClient.mapParams(params));
}

export * from "./types";
