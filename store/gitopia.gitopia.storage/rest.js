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
/**
* BondStatus is the status of a storage provider.

 - BOND_STATUS_UNSPECIFIED: UNSPECIFIED defines an invalid provider status.
 - BOND_STATUS_UNBONDED: UNBONDED defines a provider that is not bonded.
 - BOND_STATUS_UNBONDING: UNBONDING defines a provider that is unbonding.
 - BOND_STATUS_BONDED: BONDED defines a provider that is bonded.
*/
export var StorageBondStatus;
(function (StorageBondStatus) {
    StorageBondStatus["BOND_STATUS_UNSPECIFIED"] = "BOND_STATUS_UNSPECIFIED";
    StorageBondStatus["BOND_STATUS_UNBONDED"] = "BOND_STATUS_UNBONDED";
    StorageBondStatus["BOND_STATUS_UNBONDING"] = "BOND_STATUS_UNBONDING";
    StorageBondStatus["BOND_STATUS_BONDED"] = "BOND_STATUS_BONDED";
})(StorageBondStatus || (StorageBondStatus = {}));
export var StorageChallengeStatus;
(function (StorageChallengeStatus) {
    StorageChallengeStatus["CHALLENGE_STATUS_UNSPECIFIED"] = "CHALLENGE_STATUS_UNSPECIFIED";
    StorageChallengeStatus["CHALLENGE_STATUS_PENDING"] = "CHALLENGE_STATUS_PENDING";
    StorageChallengeStatus["CHALLENGE_STATUS_COMPLETED"] = "CHALLENGE_STATUS_COMPLETED";
    StorageChallengeStatus["CHALLENGE_STATUS_FAILED"] = "CHALLENGE_STATUS_FAILED";
    StorageChallengeStatus["CHALLENGE_STATUS_TIMEOUT"] = "CHALLENGE_STATUS_TIMEOUT";
})(StorageChallengeStatus || (StorageChallengeStatus = {}));
export var StorageChallengeType;
(function (StorageChallengeType) {
    StorageChallengeType["CHALLENGE_TYPE_UNSPECIFIED"] = "CHALLENGE_TYPE_UNSPECIFIED";
    StorageChallengeType["CHALLENGE_TYPE_PACKFILE"] = "CHALLENGE_TYPE_PACKFILE";
    StorageChallengeType["CHALLENGE_TYPE_RELEASE_ASSET"] = "CHALLENGE_TYPE_RELEASE_ASSET";
    StorageChallengeType["CHALLENGE_TYPE_LFS_OBJECT"] = "CHALLENGE_TYPE_LFS_OBJECT";
})(StorageChallengeType || (StorageChallengeType = {}));
export var StorageProposalStatus;
(function (StorageProposalStatus) {
    StorageProposalStatus["PROPOSAL_STATUS_UNSPECIFIED"] = "PROPOSAL_STATUS_UNSPECIFIED";
    StorageProposalStatus["PROPOSAL_STATUS_PENDING"] = "PROPOSAL_STATUS_PENDING";
    StorageProposalStatus["PROPOSAL_STATUS_APPROVED"] = "PROPOSAL_STATUS_APPROVED";
    StorageProposalStatus["PROPOSAL_STATUS_REJECTED"] = "PROPOSAL_STATUS_REJECTED";
    StorageProposalStatus["PROPOSAL_STATUS_EXPIRED"] = "PROPOSAL_STATUS_EXPIRED";
})(StorageProposalStatus || (StorageProposalStatus = {}));
import axios from "axios";
export var ContentType;
(function (ContentType) {
    ContentType["Json"] = "application/json";
    ContentType["FormData"] = "multipart/form-data";
    ContentType["UrlEncoded"] = "application/x-www-form-urlencoded";
})(ContentType || (ContentType = {}));
export class HttpClient {
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
        this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
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
/**
 * @title gitopia/gitopia/storage/events.proto
 * @version version not set
 */
export class Api extends HttpClient {
    constructor() {
        super(...arguments);
        /**
         * No description
         *
         * @tags Query
         * @name QueryActiveProviders
         * @request GET:/gitopia/gitopia/storage/active-providers
         */
        this.queryActiveProviders = (params = {}) => this.request({
            path: `/gitopia/gitopia/storage/active-providers`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryChallenge
         * @summary Challenge queries a challenge by id
         * @request GET:/gitopia/gitopia/storage/challenge/{id}
         */
        this.queryChallenge = (id, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/challenge/${id}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryChallenges
         * @request GET:/gitopia/gitopia/storage/challenges
         */
        this.queryChallenges = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/challenges`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryCidReferenceCount
         * @request GET:/gitopia/gitopia/storage/cid-reference-count/{cid}
         */
        this.queryCidReferenceCount = (cid, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/cid-reference-count/${cid}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryCidReferenceCounts
         * @request GET:/gitopia/gitopia/storage/cid-reference-counts
         */
        this.queryCidReferenceCounts = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/cid-reference-counts`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryJailedProviders
         * @request GET:/gitopia/gitopia/storage/jailed-providers
         */
        this.queryJailedProviders = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/jailed-providers`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryLfsObjectUpdateProposal
         * @request GET:/gitopia/gitopia/storage/lfs-object-update-proposal/{repository_id}/{oid}/{user}
         */
        this.queryLFSObjectUpdateProposal = (repositoryId, oid, user, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/lfs-object-update-proposal/${repositoryId}/${oid}/${user}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryLfsObjectUpdateProposals
         * @request GET:/gitopia/gitopia/storage/lfs-object-update-proposals
         */
        this.queryLFSObjectUpdateProposals = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/lfs-object-update-proposals`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryLfsObjectUpdateProposalsByRepositoryId
         * @request GET:/gitopia/gitopia/storage/lfs-object-update-proposals/{repository_id}/{user}
         */
        this.queryLFSObjectUpdateProposalsByRepositoryId = (repositoryId, user, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/lfs-object-update-proposals/${repositoryId}/${user}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryLfsObject
         * @request GET:/gitopia/gitopia/storage/lfs-object/{id}
         */
        this.queryLFSObject = (id, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/lfs-object/${id}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryLfsObjects
         * @request GET:/gitopia/gitopia/storage/lfs-objects
         */
        this.queryLFSObjects = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/lfs-objects`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryLivenessViolations
         * @request GET:/gitopia/gitopia/storage/liveness-violations
         */
        this.queryLivenessViolations = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/liveness-violations`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryPackfileUpdateProposal
         * @request GET:/gitopia/gitopia/storage/packfile-update-proposal/{repository_id}/{user}
         */
        this.queryPackfileUpdateProposal = (repositoryId, user, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/packfile-update-proposal/${repositoryId}/${user}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryPackfileUpdateProposals
         * @request GET:/gitopia/gitopia/storage/packfile-update-proposals
         */
        this.queryPackfileUpdateProposals = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/packfile-update-proposals`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryPackfile
         * @summary Packfile queries a packfile by id
         * @request GET:/gitopia/gitopia/storage/packfile/{id}
         */
        this.queryPackfile = (id, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/packfile/${id}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryPackfiles
         * @summary Packfiles queries all packfiles
         * @request GET:/gitopia/gitopia/storage/packfiles
         */
        this.queryPackfiles = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/packfiles`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryParams
         * @summary Params queries the parameters of the module
         * @request GET:/gitopia/gitopia/storage/params
         */
        this.queryParams = (params = {}) => this.request({
            path: `/gitopia/gitopia/storage/params`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryProviderLiveness
         * @summary Liveness queries
         * @request GET:/gitopia/gitopia/storage/provider-liveness/{address}
         */
        this.queryProviderLiveness = (address, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/provider-liveness/${address}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryProviderRewardsAll
         * @request GET:/gitopia/gitopia/storage/provider-rewards
         */
        this.queryProviderRewardsAll = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/provider-rewards`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryProviderRewards
         * @request GET:/gitopia/gitopia/storage/provider-rewards/{address}
         */
        this.queryProviderRewards = (address, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/provider-rewards/${address}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryProviderStake
         * @request GET:/gitopia/gitopia/storage/provider-stake/{address}
         */
        this.queryProviderStake = (address, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/provider-stake/${address}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryProviderStakes
         * @request GET:/gitopia/gitopia/storage/provider-stakes
         */
        this.queryProviderStakes = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/provider-stakes`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryProvider
         * @summary Provider queries a storage provider by address
         * @request GET:/gitopia/gitopia/storage/provider/{address}
         */
        this.queryProvider = (address, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/provider/${address}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryProviders
         * @summary Providers queries all storage providers
         * @request GET:/gitopia/gitopia/storage/providers
         */
        this.queryProviders = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/providers`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryProvidersLiveness
         * @request GET:/gitopia/gitopia/storage/providers-liveness
         */
        this.queryProvidersLiveness = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/providers-liveness`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryReleaseAsset
         * @summary ReleaseAsset queries a release asset by id
         * @request GET:/gitopia/gitopia/storage/release-asset/{id}
         */
        this.queryReleaseAsset = (id, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/release-asset/${id}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryReleaseAssets
         * @summary ReleaseAssets queries all release assets
         * @request GET:/gitopia/gitopia/storage/release-assets
         */
        this.queryReleaseAssets = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/release-assets`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryReleaseAssetsUpdateProposal
         * @request GET:/gitopia/gitopia/storage/release-assets-update-proposal/{repository_id}/{tag}/{user}
         */
        this.queryReleaseAssetsUpdateProposal = (repositoryId, tag, user, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/release-assets-update-proposal/${repositoryId}/${tag}/${user}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryReleaseAssetsUpdateProposals
         * @request GET:/gitopia/gitopia/storage/release-assets-update-proposals
         */
        this.queryReleaseAssetsUpdateProposals = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/release-assets-update-proposals`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryRepositoryDeleteProposal
         * @request GET:/gitopia/gitopia/storage/repository-delete-proposal/{repository_id}/{user}
         */
        this.queryRepositoryDeleteProposal = (repositoryId, user, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/repository-delete-proposal/${repositoryId}/${user}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryRepositoryDeleteProposals
         * @request GET:/gitopia/gitopia/storage/repository-delete-proposals
         */
        this.queryRepositoryDeleteProposals = (query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/repository-delete-proposals`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryLfsObjectByRepositoryIdAndOid
         * @request GET:/gitopia/gitopia/storage/repository/{repository_id}/lfs-object/{oid}
         */
        this.queryLFSObjectByRepositoryIdAndOid = (repositoryId, oid, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/repository/${repositoryId}/lfs-object/${oid}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryLfsObjectsByRepositoryId
         * @request GET:/gitopia/gitopia/storage/repository/{repository_id}/lfs-objects
         */
        this.queryLFSObjectsByRepositoryId = (repositoryId, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/repository/${repositoryId}/lfs-objects`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryRepositoryPackfile
         * @summary RepositoryPackfile queries a packfile for a repository
         * @request GET:/gitopia/gitopia/storage/repository/{repository_id}/packfile
         */
        this.queryRepositoryPackfile = (repositoryId, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/repository/${repositoryId}/packfile`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryRepositoryReleaseAsset
         * @summary RepositoryReleaseAsset queries a release asset for a repository by repository id, tag and name
         * @request GET:/gitopia/gitopia/storage/repository/{repository_id}/release-asset/{tag}/{name}
         */
        this.queryRepositoryReleaseAsset = (repositoryId, tag, name, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/repository/${repositoryId}/release-asset/${tag}/${name}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryRepositoryReleaseAssetsByRepositoryId
         * @summary RepositoryReleaseAssetsByRepositoryId queries all release assets for a repository by repository id
         * @request GET:/gitopia/gitopia/storage/repository/{repository_id}/release-assets
         */
        this.queryRepositoryReleaseAssetsByRepositoryId = (repositoryId, query, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/repository/${repositoryId}/release-assets`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryRepositoryReleaseAssets
         * @summary RepositoryReleaseAssets queries all release assets for a repository by repository id and tag
         * @request GET:/gitopia/gitopia/storage/repository/{repository_id}/release-assets/{tag}
         */
        this.queryRepositoryReleaseAssets = (repositoryId, tag, params = {}) => this.request({
            path: `/gitopia/gitopia/storage/repository/${repositoryId}/release-assets/${tag}`,
            method: "GET",
            format: "json",
            ...params,
        });
        /**
         * No description
         *
         * @tags Query
         * @name QueryStorageStats
         * @request GET:/gitopia/gitopia/storage/stats
         */
        this.queryStorageStats = (params = {}) => this.request({
            path: `/gitopia/gitopia/storage/stats`,
            method: "GET",
            format: "json",
            ...params,
        });
    }
}
