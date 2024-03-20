import MarkdownIt from "markdown-it";
import deflist from "markdown-it-deflist";
import attrs from "markdown-it-attrs";
import { splitPaths } from "./util_string";

export type MarkdownText = string;

//#region MarkdownIt
export const DefaultMd = (() =>
{
	return (new MarkdownIt("default", {
		html: true,
		xhtmlOut: false,
		breaks: true,
		linkify: true,
		typographer: true,
	})
		.use(deflist as MarkdownIt.PluginSimple)
		.use(attrs)
	);
})();
//#endregion

//#region System Access API
export const markdownLoadOptions: OpenFilePickerOptions = {
	types: [
		{
			description: "Markdown",
			accept: {
				"mardown/*": [".md"],
			},
		},
	],
	excludeAcceptAllOption: false,
	multiple: false,
}

export const markdownSaveOptions: SaveFilePickerOptions = {
	types: [
		{
			description: "Markdown",
			accept: {
				"mardown/*": [".md"],
			},
		},
	],
	excludeAcceptAllOption: false,
}
//#endregion

// #region Parse MD with Break
const Separator = "/";
const NewLine = "\n";

export interface MdPath
{
	[key: string]: MdPath | string[]
}

// md break := "<!--- [path/to/file] -->"
export function markdownBreak(...path: string[])
{
	return `<!--- [${path.join(Separator)}] -->`;
}

export function parseMarkdownWithBreak(...mdLines: string[]): MdPath
{
	const mdPath: MdPath = {};
	let arr: string[] = [];
	for (const line of mdLines)
	{
		const match = line.match(/^<!---.*\[(.*)\].*-->/);
		if (match)
		{
			const paths = splitPaths(match[1]);
			const len1 = paths.length - 1;

			let current: MdPath = mdPath;
			for (let i = 0; i < len1; i++)
			{
				const p = paths[i];
				if (!(p in current))
					current[p] = {};
				current = current[p] as MdPath;
			}
			arr = []
			current[paths[len1]] = arr;
		}
		else
			arr.push(line);
	}
	return mdPath;
}

export function joinMarkdownPath(mdPath: MdPath): string
{
	let output = "";
	const path: string[] = [];
	Recursive(mdPath)

	return output.trim();

	function Recursive(mdPath: MdPath)
	{
		for (const [key, value] of Object.entries(mdPath))
		{
			if (Array.isArray(value))
			{
				output += markdownBreak(...path, key) + NewLine + value.join(NewLine) + NewLine;
			}
			else
			{
				path.push(key);
				Recursive(value);
				path.pop();
			}
		}
	}
}
//#endregion

// #region Markdown Style

export type CssDeclaration = Record<string, string>; //Partial<CSSStyleDeclaration>;

export interface MarkdownStyle
{
	[selector: string] : CssDeclaration | undefined;
	/** headers 1*/
	h1?: CssDeclaration;
	/** headers 2*/
	h2?: CssDeclaration;
	/** headers 3*/
	h3?: CssDeclaration;
	/** headers 4*/
	h4?: CssDeclaration;
	/** headers 5*/
	h5?: CssDeclaration;
	/** headers 6*/
	h6?: CssDeclaration;
	/** paragraph */
	p?: CssDeclaration;
	/** text style - bold */
	strong?: CssDeclaration;
	/** text style - italic */
	em?: CssDeclaration;
	/** link and/or anchor */
	a?: CssDeclaration;
	/** images */
	img?: CssDeclaration;
	/** list: unordered */
	ul?: CssDeclaration;
	/** list: ordered */
	ol?: CssDeclaration;
	/** list: item */
	li?: CssDeclaration;
	/** blockquote */
	blockquote?: CssDeclaration;
	/** code block ``` */
	code?: CssDeclaration;
	/** code field ` */
	pre?: CssDeclaration;
	/** horizontal rule */
	hr?: CssDeclaration;
	/** table */
	table?: CssDeclaration;
	/** table: head */
	thead?: CssDeclaration;
	/** table: header */
	th?: CssDeclaration;
	/** table: body */
	tbody?: CssDeclaration;
	/** table: row */
	tr?: CssDeclaration;
	/** table: data cell */
	td?: CssDeclaration;

	/** strikethrough - extended markdown */
	del?: CssDeclaration;
	/** superscript - extended markdown */
	sup?: CssDeclaration;
	/** subscript - extended markdown */
	sub?: CssDeclaration;
	/** description list - extended markdown */
	dl?: CssDeclaration;
	/** description list: terms - extended markdown */
	dt?: CssDeclaration;
	/** description list: details - extended markdown */
	dd?: CssDeclaration;
	/** task list - extended markdown */
	"input[type=checkbox]"?: CssDeclaration;
}

export function JsonToCss(jsonCSS: Record<string, CssDeclaration>)
{
	const arr: string[] = [];
	for (const [selector, declaration] of Object.entries(jsonCSS))
	{
		// if(!declaration)
		// 	continue;
		const entries = Object.entries(declaration).map(([property, value]) => `${property}: "${value}";`);
		arr.push(`${selector} { ${entries.join(" ")} }`)
	}
	return arr.join("\n")
}

//#endregion