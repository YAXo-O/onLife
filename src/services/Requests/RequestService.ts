import { Nullable } from '../../objects/utility/Nullable';
import { RequestError } from './RequestError';
import { PrivateKeys } from '../Privacy/PrivateKeys';
import { PrivateStorage } from '../Privacy/PrivateStorage';
import { CookieParser } from './CookieParser';

export enum RequestMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	PATCH = 'PATCH',
	DELETE = 'DELETE',
}

enum RequestHeader {
	ContentType = 'Content-Type',
	SessionToken = 'X-Access-Token',
}

enum RequestState {
	Idle = 0,
	Busy = 1,
}

enum BodyType {
	None = '',
	JSON = 'application/json',
	FormData = 'multipart/form-data',
}

export enum ResponseType {
	JSON = 0,
	None = 1,
}

type BodyRecord = Nullable<object | FormData>;

interface BodyDescriptor {
	record: BodyRecord;
	type: BodyType;
}

const config = {
	backend: {
		protocol: 'http',
		host: '192.168.162.219',
		port: '5000',
		// protocol: 'https',
		// host: 'api.onlife.pro',
		// port: '',
	},
};

export class RequestManager {
	protected readonly protocol: string = config.backend.protocol;
	protected readonly host: string = config.backend.host;
	protected readonly port: string = config.backend.port;
	protected readonly version: string = 'api/v1';
	protected readonly endpoint: string;

	protected readonly query: Record<string, string> = {};
	protected readonly headers: Partial<Record<RequestHeader, string>> = {};
	protected readonly body: BodyDescriptor = {
		record: null,
		type: BodyType.None,
	};

	private state: RequestState = RequestState.Idle;
	private responseType: ResponseType = ResponseType.JSON;

	protected get queryString(): string {
		return Object.keys(this.query)
			.map((key: string) => `${key}=${this.query[key]}`)
			.join('&');
	}

	protected get url(): string {
		const path = `${this.baseUrl}/${this.version}/${this.endpoint}`;
		const query = this.queryString;

		if (query.length === 0) return path;

		return `${path}?${query}`;
	}

	protected getBody(): FormData | string | undefined {
		if (this.body.type === BodyType.None) return undefined;
		if (this.body.type === BodyType.JSON) return JSON.stringify(this.body.record);
		if (this.body.type === BodyType.FormData) return this.body.record as FormData;

		return undefined;
	}

	constructor(endpoint: string) {
		this.endpoint = endpoint;
	}

	public withQuery(key: string, value: string | number): RequestManager {
		this.query[key] = value.toString();

		return this;
	}

	public parseQuery(object: Nullable<Record<string, string | number>>): RequestManager {
		if (object) {
			Object.entries(object)
				.filter(([_, value]) => value !== undefined && value !== null)
				.forEach(([key, value]) => this.withQuery(key, value));
		}

		return this;
	}

	public get baseUrl(): string {
		const base = `${this.protocol}://${this.host}`;
		if (!this.port) return base;

		return `${base}:${this.port}`;
	}

	public clearBody(): RequestManager {
		this.body.record = null;
		this.body.type = BodyType.None;
		delete this.headers[RequestHeader.ContentType];

		return this;
	}

	public withBody<TBody extends object>(body: TBody): RequestManager {
		this.body.record = body;
		this.body.type = BodyType.JSON;
		this.headers[RequestHeader.ContentType] = this.body.type;

		return this;
	}

	public withData(data: FormData): RequestManager {
		this.body.record = data;
		this.body.type = BodyType.FormData;
		delete this.headers[RequestHeader.ContentType];

		return this;
	}

	public withHeader(header: RequestHeader, value: string): RequestManager {
		this.headers[header] = value;

		return this;
	}

	public withResponse(type: ResponseType): RequestManager {
		this.responseType = type;

		return this;
	}

	public async request<TResult>(method: RequestMethod): Promise<TResult> {
		this.state = RequestState.Busy;

		try {
			const token = await this.setCredentials();

			const response = await fetch(this.url, {
				method,
				credentials: 'include',
				headers: this.headers,
				body: this.getBody(),
			});

			if (!response.ok) {
				const text = await response.text();

				throw new RequestError(response.status, text);
			}

			await this.updateCredentials(response, token);

			if (this.responseType === ResponseType.JSON) return await response.json();
		} finally {
			this.state = RequestState.Idle;
		}
	}

	public get<TResult>(): Promise<TResult> {
		return this.request<TResult>(RequestMethod.GET);
	}

	public post<TResult>(): Promise<TResult> {
		return this.request<TResult>(RequestMethod.POST);
	}

	public put<TResult>(): Promise<TResult> {
		return this.request<TResult>(RequestMethod.PUT);
	}

	public patch<TResult>(): Promise<TResult> {
		return this.request<TResult>(RequestMethod.PATCH);
	}

	public delete<TResult>(): Promise<TResult> {
		return this.request<TResult>(RequestMethod.DELETE);
	}

	private async setCredentials(): Promise<Nullable<string>> {
		const token = await PrivateStorage.get(PrivateKeys.Session);
		if (token != null) {
			this.withHeader(RequestHeader.SessionToken, token);
		}

		return token;
	}

	private async updateCredentials(response: Response, oldToken: Nullable<string>): Promise<void> {
		const cookie = response.headers.get('set-cookie');
		if (cookie) {
			const parser = new CookieParser(cookie ?? '');
			const newToken = parser.get('X-Access-Token');

			if (newToken !== oldToken) {
				if (newToken !== null) {
					await PrivateStorage.set(PrivateKeys.Session, newToken);
				} else {
					await PrivateStorage.clear(PrivateKeys.Session);
				}
			}
		}
	}
}
