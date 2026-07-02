export type ParsedCsv = {
	header: string[];
	rows: string[][];
};

// Minimal RFC4180-ish CSV parser (commas, quotes, newlines).
export function parseCsv(
	input: string,
	options?: { maxRows?: number; maxCols?: number }
): ParsedCsv {
	const maxRows = options?.maxRows ?? 200;
	const maxCols = options?.maxCols ?? 50;

	const rows: string[][] = [];
	let row: string[] = [];
	let field = '';
	let i = 0;
	let inQuotes = false;

	function pushField() {
		if (row.length >= maxCols) return;
		row.push(field);
		field = '';
	}

	function pushRow() {
		// drop trailing completely-empty rows
		if (row.length === 1 && row[0] === '' && rows.length === 0) {
			// allow header to be empty
		}
		rows.push(row);
		row = [];
	}

	while (i < input.length) {
		const ch = input[i]!;

		if (inQuotes) {
			if (ch === '"') {
				const next = input[i + 1];
				if (next === '"') {
					field += '"';
					i += 2;
					continue;
				}
				inQuotes = false;
				i += 1;
				continue;
			}
			field += ch;
			i += 1;
			continue;
		}

		if (ch === '"') {
			inQuotes = true;
			i += 1;
			continue;
		}

		if (ch === ',') {
			pushField();
			i += 1;
			continue;
		}

		if (ch === '\n' || ch === '\r') {
			pushField();
			pushRow();
			if (rows.length >= maxRows + 1) break; // header + rows
			// consume \r\n together
			if (ch === '\r' && input[i + 1] === '\n') i += 2;
			else i += 1;
			continue;
		}

		field += ch;
		i += 1;
	}

	// last field/row
	pushField();
	if (row.length > 1 || row[0] !== '' || rows.length > 0) pushRow();

	const header = rows.shift() ?? [];
	return { header, rows };
}
