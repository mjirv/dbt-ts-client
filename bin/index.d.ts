import { DbtBuildParams, DbtCompileParams, DbtDocsParams, DbtLsParams, DbtRunOperationParams, DbtRunParams, DbtSeedParams, DbtSnapshotParams, DbtTestParams, IDbtClient } from "./types";
export default class DbtClient implements IDbtClient {
    private dbtProjectPath;
    private profile?;
    private target?;
    private profilesDir?;
    constructor(props: {
        dbtProjectPath: string;
        profile?: string;
        target?: string;
        profilesDir?: string;
    });
    private static exec;
    private static mapParams;
    private execDbt;
    docs: (params: DbtDocsParams) => Promise<string>;
    ls: (params?: DbtLsParams) => Promise<string>;
    runOperation: (params: DbtRunOperationParams) => Promise<string>;
    run: (params?: DbtRunParams) => Promise<string>;
    test: (params?: DbtTestParams) => Promise<string>;
    build: (params?: DbtBuildParams) => Promise<string>;
    compile: (params?: DbtCompileParams) => Promise<string>;
    snapshot: (params?: DbtSnapshotParams) => Promise<string>;
    seed: (params?: DbtSeedParams) => Promise<string>;
}
export * from "./types";
//# sourceMappingURL=index.d.ts.map