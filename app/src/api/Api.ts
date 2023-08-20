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

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
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

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
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

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
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

      return data;
    });
  };
}

/**
 * @title db-rest
 * @version 6.0.1
 * @externalDocs https://github.com/derhuerst/db-rest/blob/6/docs/readme.md
 * @contact (https://github.com/derhuerst/db-rest/tree/6)
 *
 * A clean REST API wrapping around the Deutsche Bahn API.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  stops = {
    /**
     * @description Uses [`hafasClient.reachableFrom()`](https://github.com/public-transport/hafas-client/blob/6/docs/reachable-from.md) to **find stops/stations reachable within a certain time from an address**.
     *
     * @name ReachableFromList
     * @summary Finds stops/stations reachable within a certain time from an address.
     * @request GET:/stops/reachable-from
     */
    reachableFromList: (
      pretty?: boolean,
      query?: {
        /**
         * Date & time to compute the reachability for. – Default: *now*
         * @format date-time
         */
        when?: string;
        /**
         * Maximum number of transfers.
         * @default 5
         */
        maxTransfers?: number;
        /** Maximum travel duration, in minutes. – Default: *infinite* */
        maxDuration?: number;
        /**
         * Language of the results.
         * @default "en"
         */
        language?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        any,
        {
          reachable: object[];
          realtimeDataUpdatedAt?: number;
        }
      >({
        path: `/stops/reachable-from`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Uses [`hafasClient.stop()`](https://github.com/public-transport/hafas-client/blob/6/docs/stop.md) to **find a stop/station by ID**.
     *
     * @name StopsDetail
     * @summary Finds a stop/station by ID.
     * @request GET:/stops/{id}
     */
    stopsDetail: (
      id: string,
      pretty?: boolean,
      query?: {
        /**
         * Parse & expose lines at each stop/station?
         * @default false
         */
        linesOfStops?: boolean;
        /**
         * Language of the results.
         * @default "en"
         */
        language?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, object>({
        path: `/stops/${id}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Uses [`hafasClient.departures()`](https://github.com/public-transport/hafas-client/blob/6/docs/departures.md) to **query departures at a stop/station**.
     *
     * @name DeparturesDetail
     * @summary Fetches departures at a stop/station.
     * @request GET:/stops/{id}/departures
     */
    departuresDetail: (
      id: string,
      pretty?: boolean,
      query?: {
        /**
         * Date & time to get departures for. – Default: *now*
         * @format date-time
         */
        when?: string;
        /** Filter departures by direction. */
        direction?: string;
        /**
         * Show departures for how many minutes?
         * @default 10
         */
        duration?: number;
        /** Max. number of departures. – Default: *whatever HAFAS wants */
        results?: number;
        /**
         * Parse & return lines of each stop/station?
         * @default false
         */
        linesOfStops?: boolean;
        /**
         * Parse & return hints & warnings?
         * @default true
         */
        remarks?: boolean;
        /**
         * Language of the results.
         * @default "en"
         */
        language?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        any,
        {
          departures: object[];
          realtimeDataUpdatedAt?: number;
        }
      >({
        path: `/stops/${id}/departures`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Works like `/stops/{id}/departures`, except that it uses [`hafasClient.arrivals()`](https://github.com/public-transport/hafas-client/blob/6/docs/arrivals.md) to **query arrivals at a stop/station**.
     *
     * @name ArrivalsDetail
     * @summary Fetches arrivals at a stop/station.
     * @request GET:/stops/{id}/arrivals
     */
    arrivalsDetail: (
      id: string,
      pretty?: boolean,
      query?: {
        /**
         * Date & time to get departures for. – Default: *now*
         * @format date-time
         */
        when?: string;
        /** Filter departures by direction. */
        direction?: string;
        /**
         * Show departures for how many minutes?
         * @default 10
         */
        duration?: number;
        /** Max. number of departures. – Default: *whatever HAFAS wants* */
        results?: number;
        /**
         * Parse & return lines of each stop/station?
         * @default false
         */
        linesOfStops?: boolean;
        /**
         * Parse & return hints & warnings?
         * @default true
         */
        remarks?: boolean;
        /**
         * Language of the results.
         * @default "en"
         */
        language?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        any,
        {
          arrivals: object[];
          realtimeDataUpdatedAt?: number;
        }
      >({
        path: `/stops/${id}/arrivals`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  journeys = {
    /**
     * @description Uses [`hafasClient.journeys()`](https://github.com/public-transport/hafas-client/blob/6/docs/journeys.md) to **find journeys from A (`from`) to B (`to`)**.
     *
     * @name JourneysList
     * @summary Finds journeys from A to B.
     * @request GET:/journeys
     */
    journeysList: (
      pretty?: boolean,
      query?: {
        /**
         * Compute journeys departing at this date/time. Mutually exclusive with `arrival`. – Default: *now*
         * @format date-time
         */
        departure?: string;
        /**
         * Compute journeys arriving at this date/time. Mutually exclusive with `departure`. – Default: *now*
         * @format date-time
         */
        arrival?: string;
        /** Compute journeys "before" an `ealierRef`. */
        earlierThan?: string;
        /** Compute journeys "after" an `laterRef`. */
        laterThan?: string;
        /**
         * Max. number of journeys.
         * @default 3
         */
        results?: number;
        /**
         * Fetch & parse stopovers on the way?
         * @default false
         */
        stopovers?: boolean;
        /** Maximum number of transfers. – Default: *let HAFAS decide* */
        transfers?: number;
        /**
         * Minimum time in minutes for a single transfer.
         * @default 0
         */
        transferTime?: number;
        /** `partial` or `complete`. – Default: *not accessible* */
        accessibility?: string;
        /**
         * Compute only bike-friendly journeys?
         * @default false
         */
        bike?: boolean;
        /**
         * Consider walking to nearby stations at the beginning of a journey?
         * @default true
         */
        startWithWalking?: boolean;
        /**
         * `slow`, `normal` or `fast`.
         * @default "normal"
         */
        walkingSpeed?: "slow" | "normal" | "fast";
        /**
         * Return information about available tickets?
         * @default false
         */
        tickets?: boolean;
        /**
         * Fetch & parse a shape for each journey leg?
         * @default false
         */
        polylines?: boolean;
        /**
         * Parse & return sub-stops of stations?
         * @default true
         */
        subStops?: boolean;
        /**
         * Parse & return entrances of stops/stations?
         * @default true
         */
        entrances?: boolean;
        /**
         * Parse & return hints & warnings?
         * @default true
         */
        remarks?: boolean;
        /**
         * Parse & return dates each journey is valid on?
         * @default false
         */
        scheduledDays?: boolean;
        /**
         * Language of the results.
         * @default "en"
         */
        language?: string;
        /** Type of loyalty card in use. – Default: *none* */
        loyaltyCard?:
          | "bahncard-1st-25"
          | "bahncard-2nd-25"
          | "bahncard-1st-50"
          | "bahncard-2nd-50"
          | "vorteilscard"
          | "halbtaxabo-railplus"
          | "halbtaxabo"
          | "voordeelurenabo-railplus"
          | "voordeelurenabo"
          | "shcard"
          | "generalabonnement";
        /**
         * Search for first-class options?
         * @default "false"
         */
        firstClass?: boolean;
        /** Age of traveller – Default: *adult* */
        age?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        any,
        {
          journeys: object[];
          realtimeDataUpdatedAt?: number;
          earlierRef?: string;
          laterRef?: string;
        }
      >({
        path: `/journeys`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Uses [`hafasClient.refreshJourney()`](https://github.com/public-transport/hafas-client/blob/6/docs/refresh-journey.md) to **"refresh" a journey, using its `refreshToken`**. The journey will be the same (equal `from`, `to`, `via`, date/time & vehicles used), but you can get up-to-date realtime data, like delays & cancellations.
     *
     * @name JourneysDetail
     * @summary Fetches up-to-date realtime data for a journey computed before.
     * @request GET:/journeys/{ref}
     */
    journeysDetail: (
      ref: string,
      pretty?: boolean,
      query?: {
        /**
         * Fetch & parse stopovers on the way?
         * @default false
         */
        stopovers?: boolean;
        /**
         * Return information about available tickets?
         * @default false
         */
        tickets?: boolean;
        /**
         * Fetch & parse a shape for each journey leg?
         * @default false
         */
        polylines?: boolean;
        /**
         * Parse & return sub-stops of stations?
         * @default true
         */
        subStops?: boolean;
        /**
         * Parse & return entrances of stops/stations?
         * @default true
         */
        entrances?: boolean;
        /**
         * Parse & return hints & warnings?
         * @default true
         */
        remarks?: boolean;
        /**
         * Parse & return dates the journey is valid on?
         * @default false
         */
        scheduledDays?: boolean;
        /**
         * Language of the results.
         * @default "en"
         */
        language?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        any,
        {
          journey: object;
          realtimeDataUpdatedAt?: number;
        }
      >({
        path: `/journeys/${ref}`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  trips = {
    /**
     * @description Uses [`hafasClient.trip()`](https://github.com/public-transport/hafas-client/blob/6/docs/trip.md) to **fetch a trip by ID**.
     *
     * @name TripsDetail
     * @summary Fetches a trip by ID.
     * @request GET:/trips/{id}
     */
    tripsDetail: (
      id: string,
      pretty?: boolean,
      query?: {
        /**
         * Fetch & parse stopovers on the way?
         * @default true
         */
        stopovers?: boolean;
        /**
         * Parse & return hints & warnings?
         * @default true
         */
        remarks?: boolean;
        /**
         * Fetch & parse the geographic shape of the trip?
         * @default false
         */
        polyline?: boolean;
        /**
         * Language of the results.
         * @default "en"
         */
        language?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        any,
        {
          trip: object;
          realtimeDataUpdatedAt?: number;
        }
      >({
        path: `/trips/${id}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Uses [`hafasClient.tripsByName()`](https://github.com/public-transport/hafas-client/blob/6/docs/trips-by-name.md) to query trips.
     *
     * @name TripsList
     * @summary Fetches all trips within a specified time frame (default: *now*) that match certain criteria.
     * @request GET:/trips
     */
    tripsList: (
      pretty?: boolean,
      query?: {
        /**
         * line name or Fahrtnummer
         * @default "*"
         */
        query?: string;
        /**
         * Date & time to get trips for. – Default: *now*
         * @format date-time
         */
        when?: string;
        /**
         * Together with untilWhen, forms a time frame to get trips for. Mutually exclusive with `when`. – Default: *now*
         * @format date-time
         */
        fromWhen?: string;
        /**
         * Together with fromWhen, forms a time frame to get trips for. Mutually exclusive with `when`. – Default: *now*
         * @format date-time
         */
        untilWhen?: string;
        /**
         * Only return trips that run within the specified time frame.
         * @default true
         */
        onlyCurrentlyRunning?: boolean;
        /** Only return trips that stop at the specified stop within the specified time frame. */
        currentlyStoppingAt?: string;
        /** Only return trips with the specified line name. */
        lineName?: string;
        /** Only return trips operated by operators specified by their names, separated by commas. */
        operatorNames?: string;
        /**
         * Fetch & parse stopovers of each trip?
         * @default true
         */
        stopovers?: boolean;
        /**
         * Parse & return hints & warnings?
         * @default true
         */
        remarks?: boolean;
        /**
         * Parse & return sub-stops of stations?
         * @default true
         */
        subStops?: boolean;
        /**
         * Parse & return entrances of stops/stations?
         * @default true
         */
        entrances?: boolean;
        /**
         * Language of the results.
         * @default "en"
         */
        language?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        any,
        {
          trips: object[];
          realtimeDataUpdatedAt?: number;
        }
      >({
        path: `/trips`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  locations = {
    /**
     * @description Uses [`hafasClient.nearby()`](https://github.com/public-transport/hafas-client/blob/6/docs/nearby.md) to **find stops/stations & POIs close to the given geolocation**.
     *
     * @name NearbyList
     * @summary Finds stops/stations & POIs close to a geolocation.
     * @request GET:/locations/nearby
     */
    nearbyList: (
      pretty?: boolean,
      query?: {
        /**
         * maximum number of results
         * @default 8
         */
        results?: number;
        /** maximum walking distance in meters – Default: – */
        distance?: number;
        /**
         * Return stops/stations?
         * @default true
         */
        stops?: boolean;
        /**
         * Return points of interest?
         * @default false
         */
        poi?: boolean;
        /**
         * Parse & expose lines at each stop/station?
         * @default false
         */
        linesOfStops?: boolean;
        /**
         * Language of the results.
         * @default "en"
         */
        language?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, object[]>({
        path: `/locations/nearby`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Uses [`hafasClient.locations()`](https://github.com/public-transport/hafas-client/blob/6/docs/locations.md) to **find stops/stations, POIs and addresses matching `query`**.
     *
     * @name LocationsList
     * @summary Finds stops/stations, POIs and addresses matching a query.
     * @request GET:/locations
     */
    locationsList: (
      query: {
        /** The term to search for. */
        query: string;
        /**
         * Find more than exact matches?
         * @default true
         */
        fuzzy?: boolean;
        /**
         * How many stations shall be shown?
         * @default 10
         */
        results?: number;
        /**
         * Show stops/stations?
         * @default true
         */
        stops?: boolean;
        /**
         * Show addresses?
         * @default true
         */
        addresses?: boolean;
        /**
         * Show points of interest?
         * @default true
         */
        poi?: boolean;
        /**
         * Parse & return lines of each stop/station?
         * @default false
         */
        linesOfStops?: boolean;
        /**
         * Language of the results.
         * @default "en"
         */
        language?: string;
      },
      pretty?: boolean,
      params: RequestParams = {},
    ) =>
      this.request<any, object[]>({
        path: `/locations`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  radar = {
    /**
     * @description Uses [`hafasClient.radar()`](https://github.com/public-transport/hafas-client/blob/6/docs/radar.md) to **find all vehicles currently in an area**, as well as their movements.
     *
     * @name RadarList
     * @summary Finds all vehicles currently in an area.
     * @request GET:/radar
     */
    radarList: (
      pretty?: boolean,
      query?: {
        /**
         * Max. number of vehicles.
         * @default 256
         */
        results?: number;
        /**
         * Compute frames for the next `n` seconds.
         * @default 30
         */
        duration?: number;
        /**
         * Number of frames to compute.
         * @default 3
         */
        frames?: number;
        /**
         * Fetch & parse a geographic shape for the movement of each vehicle?
         * @default true
         */
        polylines?: boolean;
        /**
         * Language of the results.
         * @default "en"
         */
        language?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        any,
        {
          movements: object[];
          realtimeDataUpdatedAt?: number;
        }
      >({
        path: `/radar`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  stations = {
    /**
     * @description Returns a stop/station from [`db-stations@3`](https://github.com/derhuerst/db-stations/tree/3.0.1).
     *
     * @name StationsDetail
     * @summary Returns a stop/station from `db-stations`.
     * @request GET:/stations/{id}
     */
    stationsDetail: (id: string, params: RequestParams = {}) =>
      this.request<any, object>({
        path: `/stations/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description If the `query` parameter is used, it will use [`db-stations-autocomplete@2`](https://github.com/derhuerst/db-stations-autocomplete/tree/2.2.0) to autocomplete *Deutsche Bahn*-operated stops/stations by name. Otherwise, it will filter the stops/stations in [`db-stations@3`](https://github.com/derhuerst/db-stations/tree/3.0.1). Instead of receiving a JSON response, you can request [newline-delimited JSON](http://ndjson.org) by sending `Accept: application/x-ndjson`.
     *
     * @name StationsList
     * @summary Autocompletes stops/stations by name or filters stops/stations.
     * @request GET:/stations
     */
    stationsList: (
      query?: {
        /** Find stations by name using [`db-stations-autocomplete@2`](https://github.com/derhuerst/db-stations-autocomplete/tree/2.2.0). */
        query?: string;
        /**
         * *If `query` is used:* Return at most `n` stations.
         * @default 3
         */
        limit?: number;
        /**
         * *If `query` is used:* Find stations despite typos.
         * @default false
         */
        fuzzy?: boolean;
        /**
         * *If `query` is used:* Autocomplete stations.
         * @default true
         */
        completion?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, object>({
        path: `/stations`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
}
