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
export var ContentType;
(function (ContentType) {
  ContentType["Json"] = "application/json";
  ContentType["FormData"] = "multipart/form-data";
  ContentType["UrlEncoded"] = "application/x-www-form-urlencoded";
})(ContentType || (ContentType = {}));
export class HttpClient {
  constructor(apiConfig = {}) {
    this.baseUrl = "";
    this.securityData = null;
    this.securityWorker = null;
    this.abortControllers = new Map();
    this.baseApiParams = {
      credentials: "same-origin",
      headers: {},
      redirect: "follow",
      referrerPolicy: "no-referrer",
    };
    this.setSecurityData = (data) => {
      this.securityData = data;
    };
    this.contentFormatters = {
      [ContentType.Json]: (input) =>
        input !== null &&
        (typeof input === "object" || typeof input === "string")
          ? JSON.stringify(input)
          : input,
      [ContentType.FormData]: (input) =>
        Object.keys(input || {}).reduce((data, key) => {
          data.append(key, input[key]);
          return data;
        }, new FormData()),
      [ContentType.UrlEncoded]: (input) => this.toQueryString(input),
    };
    this.createAbortSignal = (cancelToken) => {
      if (this.abortControllers.has(cancelToken)) {
        const abortController = this.abortControllers.get(cancelToken);
        if (abortController) {
          return abortController.signal;
        }
        return void 0;
      }
      const abortController = new AbortController();
      this.abortControllers.set(cancelToken, abortController);
      return abortController.signal;
    };
    this.abortRequest = (cancelToken) => {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        abortController.abort();
        this.abortControllers.delete(cancelToken);
      }
    };
    this.request = ({
      body,
      secure,
      path,
      type,
      query,
      format = "json",
      baseUrl,
      cancelToken,
      ...params
    }) => {
      const secureParams =
        (secure &&
          this.securityWorker &&
          this.securityWorker(this.securityData)) ||
        {};
      const requestParams = this.mergeRequestParams(params, secureParams);
      const queryString = query && this.toQueryString(query);
      const payloadFormatter = this.contentFormatters[type || ContentType.Json];
      return fetch(
        `${baseUrl || this.baseUrl || ""}${path}${
          queryString ? `?${queryString}` : ""
        }`,
        {
          ...requestParams,
          headers: {
            ...(type && type !== ContentType.FormData
              ? { "Content-Type": type }
              : {}),
            ...(requestParams.headers || {}),
          },
          signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
          body:
            typeof body === "undefined" || body === null
              ? null
              : payloadFormatter(body),
        }
      ).then(async (response) => {
        const r = response;
        r.data = null;
        r.error = null;
        const data = await response[format]()
          .then((data) => {
            if (r.ok) {
              r.data = data;
            } else {
              r.error = data;
            }
            return r;
          })
          .catch((e) => {
            r.error = e;
            return r;
          });
        if (cancelToken) {
          this.abortControllers.delete(cancelToken);
        }
        if (!response.ok) throw data;
        return data;
      });
    };
    Object.assign(this, apiConfig);
  }
  addQueryParam(query, key) {
    const value = query[key];
    return (
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(
        Array.isArray(value)
          ? value.join(",")
          : typeof value === "number"
          ? value
          : `${value}`
      )
    );
  }
  toQueryString(rawQuery) {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key]
    );
    return keys
      .map((key) =>
        typeof query[key] === "object" && !Array.isArray(query[key])
          ? this.toQueryString(query[key])
          : this.addQueryParam(query, key)
      )
      .join("&");
  }
  addQueryParams(rawQuery) {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }
  mergeRequestParams(params1, params2) {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }
}
/**
 * @title cosmos/bank/v1beta1/authz.proto
 * @version version not set
 */
export class Api extends HttpClient {
  constructor() {
    super(...arguments);
    /**
     * No description
     *
     * @tags Query
     * @name QueryAllBalances
     * @summary AllBalances queries the balance of all coins for a single account.
     * @request GET:/cosmos/bank/v1beta1/balances/{address}
     */
    this.queryAllBalances = (address, query, params = {}) =>
      this.request({
        path: `/cosmos/bank/v1beta1/balances/${address}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      });
    /**
     * No description
     *
     * @tags Query
     * @name QueryBalance
     * @summary Balance queries the balance of a single coin for a single account.
     * @request GET:/cosmos/bank/v1beta1/balances/{address}/{denom}
     */
    this.queryBalance = (address, denom, params = {}) =>
      this.request({
        path: `/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`,
        method: "GET",
        format: "json",
        ...params,
      });
    /**
     * No description
     *
     * @tags Query
     * @name QueryDenomsMetadata
     * @summary DenomsMetadata queries the client metadata for all registered coin denominations.
     * @request GET:/cosmos/bank/v1beta1/denoms_metadata
     */
    this.queryDenomsMetadata = (query, params = {}) =>
      this.request({
        path: `/cosmos/bank/v1beta1/denoms_metadata`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      });
    /**
     * No description
     *
     * @tags Query
     * @name QueryDenomMetadata
     * @summary DenomsMetadata queries the client metadata of a given coin denomination.
     * @request GET:/cosmos/bank/v1beta1/denoms_metadata/{denom}
     */
    this.queryDenomMetadata = (denom, params = {}) =>
      this.request({
        path: `/cosmos/bank/v1beta1/denoms_metadata/${denom}`,
        method: "GET",
        format: "json",
        ...params,
      });
    /**
     * No description
     *
     * @tags Query
     * @name QueryParams
     * @summary Params queries the parameters of x/bank module.
     * @request GET:/cosmos/bank/v1beta1/params
     */
    this.queryParams = (params = {}) =>
      this.request({
        path: `/cosmos/bank/v1beta1/params`,
        method: "GET",
        format: "json",
        ...params,
      });
    /**
     * No description
     *
     * @tags Query
     * @name QueryTotalSupply
     * @summary TotalSupply queries the total supply of all coins.
     * @request GET:/cosmos/bank/v1beta1/supply
     */
    this.queryTotalSupply = (query, params = {}) =>
      this.request({
        path: `/cosmos/bank/v1beta1/supply`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      });
    /**
     * No description
     *
     * @tags Query
     * @name QuerySupplyOf
     * @summary SupplyOf queries the supply of a single coin.
     * @request GET:/cosmos/bank/v1beta1/supply/{denom}
     */
    this.querySupplyOf = (denom, params = {}) =>
      this.request({
        path: `/cosmos/bank/v1beta1/supply/${denom}`,
        method: "GET",
        format: "json",
        ...params,
      });
  }
}
