import { execFile } from "child_process";
import { promisify } from "util";

export default class DbtClient implements IDbtClient {
  private dbtProjectPath: string;
  private profile?: string;
  private target?: string;
  private profilesDir?: string;
  constructor(props: {
    dbtProjectPath: string;
    profile?: string;
    target?: string;
    profilesDir?: string;
  }) {
    if (!props.dbtProjectPath) throw Error("no dbt project path given");
    this.dbtProjectPath = props.dbtProjectPath;
    this.profile = props.profile;
    this.target = props.target;
    this.profilesDir = props.profilesDir;
  }

  private static exec = promisify(execFile);

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

  docs = (
    params:
      | {
          operation: "generate";
          noCompile?: boolean;
        }
      | { operation: "serve"; port?: number }
  ) => {
    return this.execDbt("docs", [
      params.operation,
      ...(params.operation === "generate" && params.noCompile
        ? ["--no-compile", "true"]
        : []),
      ...(params.operation === "serve" && params.port
        ? ["--port", params.port.toString()]
        : []),
    ]);
  };

  ls = (params?: {
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
  }) => {
    return this.execDbt("ls", [
      ...(params?.resourceType ? ["--resource-type", params.resourceType] : []),
      ...(params?.output ? ["--output", params.output] : []),
      ...(params?.outputKeys
        ? ["--output-keys", `"${params.outputKeys}"`]
        : []),
      ...(params?.select ? ["--select", params.select] : []),
      ...(params?.exclude ? ["--exclude", params.exclude] : []),
    ]);
  };

  runOperation = async (params: {
    operation: string;
    args?: Record<string, string>;
  }): Promise<string> => {
    const { operation, args } = params;
    return this.execDbt("run-operation", [
      operation,
      ...(args ? ["--args", JSON.stringify(args)] : []),
    ]);
  };
}
