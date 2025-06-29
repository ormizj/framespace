export interface keyCoordinates {
	x: number;
	y: number;
	width: number;
	height: number;
}

export default class GridTemplateParser {
	private static readonly space = ' ';
	private static readonly newLine = '\n';
	private static readonly emptyKey = '.';
	private readonly templateMatrix: string[][];
	private readonly keysCoordinates: Record<string, keyCoordinates> = {};
	private readonly isDebugMode: boolean;
	/* "keysCoordinates" -> x & y - starting positions */
	private readonly baseX;
	private readonly baseY;

	/**
	 * Creates a coordinate map from a template string
	 * @param template		Multi-line string where each line is a row of space-separated cells
	 *                		Non "." characters are keys; their positions become coordinates offset by `base`
	 *                		Example:
	 *                		"
	 *                		a a . \n
	 *                 		a a . \n
	 *                 		b b c
	 *                 		"
	 * @param base 				Number added to the column (x) and row (y) indices of each cell
	 *             				Default: 0 (e.g., a cell at column 2, row 3 becomes (2 + base, 3 + base))
	 * @param isDebugMode	When true, logs validation errors (e.g., inconsistent row lengths)
	 */
	constructor(
		template: string,
		{ baseX = 0, baseY = 0, isDebug: isDebugMode = false } = {}
	) {
		this.isDebugMode = isDebugMode;
		this.baseX = baseX;
		this.baseY = baseY;
		this.templateMatrix = this.initTemplateMatrix(template);
		this.keysCoordinates = this.initKeysCoordinates(this.templateMatrix);

		// if template has errors, clean the data (don't use the template)
		if (!this.isValid()) this.keysCoordinates = {};
	}

	public getCoordinates = (key: string): keyCoordinates | undefined => {
		return this.keysCoordinates[key];
	};

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

	private initKeysCoordinates = (
		templateMatrix: string[][]
	): Record<string, keyCoordinates> => {
		// variables
		const keysCoordinates: Record<string, keyCoordinates> = {};
		const ignoredIndexes: Record<`${string},${string}`, true> = {};
		// helper methods
		const isIndexValid = (key: string, i: number, j: number): boolean => {
			return templateMatrix[i]?.[j] === key;
		};
		const setKeyCoordinates = (key: string, i: number, j: number): boolean => {
			const initialI = i;
			const initialJ = j;
			const iterateI = () => {
				while (true) {
					if (isIndexValid(key, i, j)) {
						ignoredIndexes[`${i},${j}`] = true;
						i++;
					} else {
						i--;
						break;
					}
				}
			};

			iterateI();
			const maxI = i;
			while (true) {
				i = initialI;
				j++;
				if (!isIndexValid(key, i, j)) {
					j--;
					break;
				}
				iterateI();
				if (i !== maxI) {
					this.debug(`Template key "${key}" is not a rectangle`);
					return false;
				}
			}

			keysCoordinates[key] = {
				x: initialJ + this.baseX,
				y: initialI + this.baseY,
				width: j - initialJ + 1,
				height: maxI - i + 1,
			};
			return true;
		};
		// main
		for (let i = 0; i < templateMatrix.length; i++) {
			for (let j = 0; j < templateMatrix[i].length; j++) {
				if (
					ignoredIndexes[`${i},${j}`] ||
					templateMatrix[i][j] === GridTemplateParser.emptyKey
				) {
					continue;
				}
				const key = templateMatrix[i][j];
				if (keysCoordinates[key]) {
					this.debug(`Template key "${key}" has duplicates`);
					return {};
				}

				const isValid = setKeyCoordinates(key, i, j);
				if (!isValid) return {};
			}
		}
		return keysCoordinates;
	};

	private isValid = (): boolean => {
		for (let i = 0; i < this.templateMatrix.length - 1; i++) {
			if (this.templateMatrix[i].length === this.templateMatrix[i + 1].length)
				continue;
			this.debug(
				`Template is not a rectangle (use "${GridTemplateParser.emptyKey}" key to indicate empty space)`
			);
			return false;
		}
		return true;
	};

	private debug = (message: string): void => {
		if (this.isDebugMode) console.warn(message);
	};
}
