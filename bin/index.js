"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
const stringFormatting_1 = require("./utils/stringFormatting");
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
        this.docs = (params) => this.execDbt("docs", [
            params.operation,
            ...(params.operation === "generate" && params.noCompile
                ? ["--no-compile", "true"]
                : []),
            ...(params.operation === "serve" && params.port
                ? ["--port", params.port.toString()]
                : []),
        ]);
        this.ls = (params) => this.execDbt("ls", DbtClient.mapParams(params));
        this.runOperation = (params) => {
            const { operation, args } = params;
            return this.execDbt("run-operation", [
                operation,
                ...(args ? ["--args", JSON.stringify(args)] : []),
            ]);
        };
        this.run = (params) => this.execDbt("run", DbtClient.mapParams(params));
        this.test = (params) => this.execDbt("test", DbtClient.mapParams(params));
        this.build = (params) => this.execDbt("build", DbtClient.mapParams(params));
        this.compile = (params) => this.execDbt("compile", DbtClient.mapParams(params));
        this.snapshot = (params) => this.execDbt("snapshot", DbtClient.mapParams(params));
        this.seed = (params) => this.execDbt("seed", DbtClient.mapParams(params));
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
DbtClient.mapParams = (params) => params
    ? Object.entries(params).flatMap(([key, value]) => [
        `--${(0, stringFormatting_1.toKebabCase)(key)}`,
        ...(typeof value === "boolean" ? [] : [value]),
    ])
    : [];
__exportStar(require("./types"), exports);
