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

	constructor(template: string) {
		this.templateMatrix = this.initTemplateMatrix(template);
		this.keysCoordinates = this.initKeysCoordinates(this.templateMatrix);

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

	private initKeysCoordinates = (
		templateMatrix: string[][]
	): Record<string, keyCoordinates> => {
		const keysCoordinates: Record<string, keyCoordinates> = {};

		for (let i = 0; i < templateMatrix.length; i++) {
			for (let j = 0; j < templateMatrix[i].length; j++) {}
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

console.log('str5');
const str5 = ` `;
parser = new GridTemplateParser(str5);
