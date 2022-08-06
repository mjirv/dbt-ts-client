"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
class DbtClient {
    constructor(props) {
        this.execDbt = (operation, args) => __awaiter(this, void 0, void 0, function* () {
            console.debug(`Beginning dbt ${operation}`);
            try {
                const { stdout, stderr } = yield DbtClient.exec("dbt", [
                    ...(this.profilesDir ? ["--profiles-dir", this.profilesDir] : []),
                    operation,
                    ...(this.target ? ["--target", this.target] : []),
                    ...(this.profile ? ["--profile", this.profile] : []),
                    ...args,
                ], {
                    cwd: this.dbtProjectPath,
                    encoding: "utf-8",
                });
                console.warn(stderr);
                return stdout;
            }
            catch (error) {
                console.error(`An error occurred while running dbt ${operation}`, error);
                throw new Error(error.stdout);
            }
        });
        this.docs = (params) => {
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
        this.ls = (params) => {
            return this.execDbt("ls", [
                ...((params === null || params === void 0 ? void 0 : params.resourceType) ? ["--resource-type", params.resourceType] : []),
                ...((params === null || params === void 0 ? void 0 : params.output) ? ["--output", params.output] : []),
                ...((params === null || params === void 0 ? void 0 : params.outputKeys)
                    ? ["--output-keys", `"${params.outputKeys}"`]
                    : []),
                ...((params === null || params === void 0 ? void 0 : params.select) ? ["--select", params.select] : []),
                ...((params === null || params === void 0 ? void 0 : params.exclude) ? ["--exclude", params.exclude] : []),
            ]);
        };
        this.runOperation = (params) => __awaiter(this, void 0, void 0, function* () {
            const { operation, args } = params;
            return this.execDbt("run-operation", [
                operation,
                ...(args ? ["--args", JSON.stringify(args)] : []),
            ]);
        });
        if (!props.dbtProjectPath)
            throw Error("no dbt project path given");
        this.dbtProjectPath = props.dbtProjectPath;
        this.profile = props.profile;
        this.target = props.target;
        this.profilesDir = props.profilesDir;
    }
}
exports.default = DbtClient;
DbtClient.exec = (0, util_1.promisify)(child_process_1.execFile);
