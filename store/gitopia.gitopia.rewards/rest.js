"use strict";
/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = exports.HttpClient = exports.ContentType = exports.RewardstaskType = void 0;
var RewardstaskType;
(function (RewardstaskType) {
    RewardstaskType["UNKNOWN"] = "UNKNOWN";
    RewardstaskType["CREATE_USER"] = "CREATE_USER";
    RewardstaskType["CREATE_NON_EMPTY_REPO"] = "CREATE_NON_EMPTY_REPO";
    RewardstaskType["CREATE_ISSUE"] = "CREATE_ISSUE";
    RewardstaskType["CREATE_ISSUE_WITH_BOUNTY"] = "CREATE_ISSUE_WITH_BOUNTY";
    RewardstaskType["CREATE_ISSUE_WITH_BOUNTY_VERIFIED"] = "CREATE_ISSUE_WITH_BOUNTY_VERIFIED";
    RewardstaskType["PR_TO_REPO_MERGED"] = "PR_TO_REPO_MERGED";
    RewardstaskType["PR_TO_VERIFIED_REPO_MERGED"] = "PR_TO_VERIFIED_REPO_MERGED";
    RewardstaskType["PR_TO_VERIFIED_REPO_MERGED_WITH_BOUNTY"] = "PR_TO_VERIFIED_REPO_MERGED_WITH_BOUNTY";
    RewardstaskType["LORE_STAKED"] = "LORE_STAKED";
    RewardstaskType["VOTE_PROPOSAL"] = "VOTE_PROPOSAL";
})(RewardstaskType = exports.RewardstaskType || (exports.RewardstaskType = {}));
const axios_1 = __importDefault(require("axios"));
var ContentType;
(function (ContentType) {
    ContentType["Json"] = "application/json";
    ContentType["FormData"] = "multipart/form-data";
    ContentType["UrlEncoded"] = "application/x-www-form-urlencoded";
})(ContentType = exports.ContentType || (exports.ContentType = {}));
class HttpClient {
    constructor({ securityWorker, secure, format, ...axiosConfig } = {}) {
        this.securityData = null;
        this.setSecurityData = (data) => {
            this.securityData = data;
        };
        this.request = async ({ secure, path, type, query, format, body, ...params }) => {
            const secureParams = ((typeof secure === "boolean" ? secure : this.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
                {};
            const requestParams = this.mergeRequestParams(params, secureParams);
            const responseFormat = (format && this.format) || void 0;
            if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
                requestParams.headers.common = { Accept: "*/*" };
                requestParams.headers.post = {};
                requestParams.headers.put = {};
                body = this.createFormData(body);
            }
            return this.instance.request({
                ...requestParams,
                headers: {
                    ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
                    ...(requestParams.headers || {}),
                },
                params: query,
                responseType: responseFormat,
                data: body,
                url: path,
            });
        };
        this.instance = axios_1.default.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
    }
    mergeRequestParams(params1, params2) {
        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...(this.instance.defaults.headers || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }
    createFormData(input) {
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            formData.append(key, property instanceof Blob
                ? property
                : typeof property === "object" && property !== null
                    ? JSON.stringify(property)
                    : `${property}`);
            return formData;
        }, new FormData());
    }
}
exports.HttpClient = HttpClient;
/**
 * @title rewards/genesis.proto
 * @version version not set
 */
class Api extends HttpClient {
    constructor() {
        super(...arguments);
        /**
         * No description
         *
         * @tags Query
         * @name QueryRewardsAll
         * @summary Queries a list of Rewards items.
         * @request GET:/gitopia/gitopia/rewards/rewards
         */
        this.queryRewardsAll = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/rewards/rewards`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryReward
         * @summary Queries a Rewards by index.
         * @request GET:/gitopia/gitopia/rewards/rewards/{recipient}
         */
        this.queryReward = (recipient, params = {}) => this.request({
            path: `/gitopia/gitopia/rewards/rewards/${recipient}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryTasks
         * @summary Queries a list of tasks items.
         * @request GET:/gitopia/gitopia/rewards/tasks/{address}
         */
        this.queryTasks = (address, params = {}) => this.request({
            path: `/gitopia/gitopia/rewards/tasks/${address}`,
            method: "GET",
            format: "json",
            ...params,
        });
    }
}
exports.Api = Api;
