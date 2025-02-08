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
	private keysCoordinates: Record<string, keyCoordinates> = {};
	private templateError = false;

	constructor(template: string) {
		this.templateMatrix = this.initTemplateMatrix(template);
		this.initKeysCoordinates();
		this.validate();
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
					height++;
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

	private initKeysCoordinates = (): void => {
		return;
		let index = 0;
		const currentSymbol = this.getNextKey(index);

		do {
			switch (currentSymbol) {
				case this.parseSymbol: {
					console.log('parsing');
					break;
				}
				case this.newLine: {
					console.log('newline');
					break;
				}
				case ' ':
				default:
					break;
			}
			index++;
		} while (currentSymbol);
	};

	/* TESTED V */
	private validate = (): void => {
		/*
		 TODO check for errors: 
		 1. "templateMatrix" all nested arrays don't share the same length
		 2. ...
		*/

		// if template has errors, clean the data (don't use the template)
		if (this.templateError) this.keysCoordinates = {};
	};
}

console.log('str1');
const str1 = ` ea re e   1
              ea  re  e 1  `;
let parser = new GridTemplateParser(str1);

console.log('str2');
const str2 = ``;
parser = new GridTemplateParser(str2);

console.log('str3');
const str3 = `a b c d e`;
parser = new GridTemplateParser(str3);

console.log('str4');
const str4 = `        c             `;
parser = new GridTemplateParser(str4);
