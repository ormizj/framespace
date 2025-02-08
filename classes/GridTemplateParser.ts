class GridTemplateParser {
	private readonly space = ' ';
	private readonly newLine = '\n';
	private readonly template: string;
	private templateLength: number;
	private templateError = false;
	private keysCoordinates = {};

	constructor(template: string) {
		this.template = template;
		this.initKeysCoordinates();
		this.initTemplateWidth();
		this.validate();
	}

	public getCoordinates = (key: string): unknown => {
		return this.keysCoordinates[key];
	};

	/* TESTED V */
	private initTemplateWidth = (): void => {
		let previousEmpty = true;
		let previousLength: number | undefined;
		let length = 0;

		let index = 0;
		while (this.template[index] !== undefined) {
			if (this.template[index] === this.space) {
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
	private getNextKey = (index: number): string => {
		let key = '';
		while (
			this.template[index] &&
			this.template[index] !== this.space &&
			this.template[index] !== this.newLine
		) {
			key += this.template[index];
			index++;
		}
		return key;
	};

	private initKeysCoordinates = (): void => {
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

	/* TESTED V */
	private validate = (): void => {
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
