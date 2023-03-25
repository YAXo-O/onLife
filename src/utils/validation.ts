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

interface ExternalError {
	message: string;
	errors: Record<string, Array<string>>;
}

function isExternalError(error: ExternalError | unknown): error is ExternalError {
	return Boolean((error as ExternalError).message) && typeof (error as ExternalError).errors === 'object';
}

function toMessage(error: ExternalError): string {
	const result: Array<string> = [error.message];
	Object.entries(error).forEach(([key, value]) => {
		result.push(`${key}: ${(value as Array<string>).join(', ')}`);
	})

	return result.join('\n\r');
}

export function toString(error: string | Error | ExternalError): string {
	if (typeof error === 'string') {
		return error;
	} else if (isExternalError(error)) {
		return toMessage(error)
	} else if ((error as Error).message) {
		return error.message;
	}

	return 'Что-то пошло не так';
}
