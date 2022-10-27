import { Nullable } from '@app/objects/utility/Nullable';

interface WithName {
	firstName: string;
	lastName: string;
}

interface WithBirthdate {
	birthDate: number;
}

export function formatName(item: Nullable<WithName>): string {
	if (!item) return '-';

	return `${item.lastName} ${item.firstName}`;
}

export function formatAge(item: Nullable<WithBirthdate>): string {
	if (!item) return '-';

	return ((new Date()).getUTCFullYear() - (new Date(item.birthDate)).getUTCFullYear()).toFixed(0);
}
