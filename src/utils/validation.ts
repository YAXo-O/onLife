import { FormikErrors } from 'formik';

import { Nullable } from '@app/objects/utility/Nullable';

export type Translator<FormValues> = Partial<Record<keyof FormValues, string>>;

export function errorsToString<FormValues>(
	errors: FormikErrors<FormValues>,
	translator: Translator<FormValues> = {},
	limit: number = 1
): Nullable<string> {
	const keys = Object.keys(errors).filter((key) => errors[key] !== undefined);
	if (keys.length === 0) return null;

	const count = Math.min(limit > 0 ? limit : keys.length, keys.length);
	const result: Array<string> = [];
	for (let i = 0; i < count; i++) {
		const key = keys[i];
		const msg = errors[key] ?? null;
		const translation = translator[key];
		const text = `${translation ?? key}: ${msg ?? ''}`;
		result.push(text);
	}

	return result.join('\n')
}

export function toString(error: string | Error): string {
	if (typeof error === 'string') {
		return error;
	} else if ((error as Error).message) {
		return error.message;
	}

	return 'Что-то пошло не так';
}
