import { Nullable } from '../../objects/utility/Nullable';

export class CookieParser {
	private value: Record<string, string> = {};

	constructor(raw: string) {
		this.parse(raw);
	}

	private parse(raw: string): void {
		raw.split(';')
			.map((pair: string) => pair.trim().split('='))
			.forEach(([key, value]) => this.value[key] = value);
	}

	public has(key: string): boolean {
		return this.value[key] !== undefined;
	}

	public get(key: string): Nullable<string> {
		if (this.has(key)) return this.value[key];

		return null;
	}

	public set(key: string, value: string): void {
		this.value[key] = value;
	}

	public clear(key: string): void {
		delete this.value[key];
	}
}
