
// https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-373782604
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type MouseAndTouch = XOR<MouseEvent, Touch>;


export interface RGB<T> {
	red: T,
	green: T,
	blue: T,
}
export interface RGBA<T> extends RGB<T> {
	opacity: T,
}

export interface StringPath {
	fullPath: string,
	splitPath: string[],
}

export interface RecursiveObj<T>
{
	[key: string]: RecursiveObj<T> | T,
}
