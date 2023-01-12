import { RequestManager } from '@app/services/Requests/RequestService';

export interface AuthCodeData {
	challenge: string;
}

export interface AuthTokenData {
	token: string;
}

interface PhoneData {
	phone: string;
}

interface ConfirmPhoneData {
	code: string;
	challenge: string;
}

export function getCode(phone: string): Promise<AuthCodeData> {
	return new RequestManager('login-phone')
		.withBody<PhoneData>({ phone })
		.post<AuthCodeData>();
}

export function confirmPhone(code: string, challenge: string): Promise<AuthTokenData> {
	return new RequestManager('confirm-phone')
		.withBody<ConfirmPhoneData>({ code, challenge })
		.post<AuthTokenData>();
}
