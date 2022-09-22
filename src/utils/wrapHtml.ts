export function wrapHtml(raw: string): string {
	const style = '<style>body{ margin: 0; padding: 0; }</style>';

	return `<html><head>${style}</head><body><div class="content">${raw}</div></body></html>`;
}
