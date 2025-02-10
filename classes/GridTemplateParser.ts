interface keyCoordinates {
	x: number;
	y: number;
	width: number;
	height: number;
}

class GridTemplateParser {
	private static readonly space = ' ';
	private static readonly newLine = '\n';
	private readonly templateMatrix: string[][];
	private readonly keysCoordinates: Record<string, keyCoordinates> = {};
	/* "keysCoordinates" -> x & y - starting positions */
	private readonly base;

	constructor(template: string, { base = 0 } = {}) {
		this.base = base;
		this.templateMatrix = this.initTemplateMatrix(template);
		this.keysCoordinates = this.initKeysCoordinates(this.templateMatrix);
		console.log(this.keysCoordinates);

		// if template has errors, clean the data (don't use the template)
		if (!this.isValid()) this.keysCoordinates = {};
	}

	/* TESTED V */
	public getCoordinates = (key: string): keyCoordinates => {
		return this.keysCoordinates[key];
	};

	/* TESTED V */
	private initTemplateMatrix = (template: string): string[][] => {
		const matrix: string[][] = [];
		let height = 0;
		let index = 0;
		let currentKey = '';

		const addCurrentKey = () => {
			if (currentKey) {
				if (!matrix[height]) matrix[height] = [currentKey];
				else matrix[height].push(currentKey);
			}
			currentKey = '';
		};

		while (template[index] !== undefined) {
			const char = template[index];
			switch (char) {
				case GridTemplateParser.space:
					addCurrentKey();
					break;
				case GridTemplateParser.newLine:
					addCurrentKey();
					if (matrix[height]) height++;
					break;
				default:
					currentKey += char;
					break;
			}
			index++;
		}
		// add remaining key after processing all characters
		addCurrentKey();

		return matrix;
	};

	/** WIP
	 */
	private initKeysCoordinates = (
		templateMatrix: string[][]
	): Record<string, keyCoordinates> => {
		// variables
		const ignoredKey = '.';
		const keysCoordinates: Record<string, keyCoordinates> = {};
		const ignoredIndexes: Record<`${string},${string}`, true> = {};

		// helper methods
		const markIndexes = (i: number, j: number): void => {
			ignoredIndexes[`${i},${j}`] = true;
		};
		const isIndexValid = (key: string, i: number, j: number): boolean =>
			templateMatrix[i]?.[j] === key;

		const setKeyCoordinates = (key: string, i: number, j: number): boolean => {
			const initialI = i;
			const initialJ = j;
			while (true) {
				if (isIndexValid(key, i, j)) {
					markIndexes(i, j);
					i++;
				} else {
					i--;
					break;
				}
			}
			const maxI = i;

			while (true) {
				i = initialI;
				j++;
				if (!isIndexValid(key, i, j)) {
					j--;
					break;
				}

				while (true) {
					if (isIndexValid(key, i, j)) {
						markIndexes(i, j);
						i++;
					} else break;
				}
				// key template is not square
				if (i !== maxI) return false;
			}

			keysCoordinates[key] = {
				x: initialJ + this.base,
				y: initialI + this.base,
				width: j - initialJ + 1,
				height: maxI - i + 1,
			};
			return true;
		};

		// main
		for (let i = 0; i < templateMatrix.length; i++) {
			for (let j = 0; j < templateMatrix[i].length; j++) {
				if (ignoredIndexes[`${i},${j}`] || templateMatrix[i][j] === ignoredKey)
					continue;
				const key = templateMatrix[i][j];
				// if key already exists, can't parse coordinates
				if (keysCoordinates[key]) return {};

				const isValid = setKeyCoordinates(key, i, j);
				if (!isValid) return {};
			}
		}

		return keysCoordinates;
	};

	/* TESTED V */
	private isValid = (): boolean => {
		/*
		 TODO check for errors:
		 1. "templateMatrix" all nested arrays don't share the same length
		 2. ...
		*/
		return false;
	};
}

let parser;

// console.log('str1');
// const str1 = ` ea re e   1

//               ea  re  e 1  `;
// parser = new GridTemplateParser(str1, { base: 1 });

// console.log('str2');
// const str2 = ``;
// parser = new GridTemplateParser(str2, { base: 1 });

// console.log('str3');
// const str3 = `a b c d e`;
// parser = new GridTemplateParser(str3, { base: 1 });

// console.log('str4');
// const str4 = `        c             `;
// parser = new GridTemplateParser(str4, { base: 1 });

// console.log('str5');
// const str5 = ` `;
// parser = new GridTemplateParser(str5, { base: 1 });

// console.log('str6');
// const str6 = `a b c
// d e f`;
// parser = new GridTemplateParser(str6, { base: 1 });

// console.log('str7');
// const str7 = `a a a b a`;
// parser = new GridTemplateParser(str7, { base: 1 });

console.log('str8');
const str8 = `a a a
. b b`;
parser = new GridTemplateParser(str8, { base: 1 });
