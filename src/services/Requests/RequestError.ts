export class RequestError extends Error {
	private readonly code: number;
	private readonly description: string;

	constructor(code: number, description: string) {
		super(`Не удалось выполнить запрос - ${description}`);

		this.code = code;
		this.description = description;
	}
}
