class GridTemplateParser {
	private readonly newLine = `
`;
	private readonly template: string;
	private templateLength: number;
	private templateError = false;
	private keysCoordinates = {};

	constructor(template: string) {
		this.template = template;
		this.initKeysCoordinates();
		this.initTemplateWidth();
	}

	/* TESTED V */
	private initTemplateWidth = () => {
		let previousEmpty = true;
		let previousLength: number | undefined;
		let length = 0;

		let index = 0;
		while (this.template[index] !== undefined) {
			if (this.template[index] === ' ') {
				previousEmpty = true;
			} else if (previousEmpty) {
				previousEmpty = false;
				length++;
			}
			index++;

			/* new line */
			if (
				this.template[index] === this.newLine ||
				this.template[index] === undefined
			) {
				if (previousLength && previousLength !== length) {
					this.templateError = true;
					break;
				}
				previousLength = length;
				length = 0;
				previousEmpty = true;
				index++;
			}
		}

		this.templateLength = previousLength || 0;
	};

	/** TESTED V
	 *  index must be starting position of the key!
	 */
	private getNextKey = (index: number) => {
		let key = '';
		while (
			this.template[index] &&
			this.template[index] !== ' ' &&
			this.template[index] !== this.newLine
		) {
			key += this.template[index];
			index++;
		}
		return key;
	};

	private initKeysCoordinates = () => {
		console.log(this.getNextKey(3));
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
}

console.log('str1');
const str1 = ` ea re e   1
              ea  re  e 1  `;
let parser = new GridTemplateParser(str1);

console.log('str2');
const str2 = ``;
parser = new GridTemplateParser(str2);
