
import { VoidComponent, createSignal, onMount } from "solid-js";
import { createCodeMirror } from "solid-codemirror";
import { Transaction } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

export interface CodeEditorProps
{
	test?: null,
}

const CodeEditor: VoidComponent<CodeEditorProps> = (props) =>
{
	const { editorView, ref: editorRef } = createCodeMirror({
		/** The initial value of the editor */
		value: "",
		/** Fired whenever the editor code value changes.*/
		onValueChange: (value) => console.log("value changed", value),
		/** Fired whenever a change occurs to the document, every time the view updates. */
		onModelViewUpdate: (modelView) => console.log("modelView updated", modelView),
		/** Fired whenever a transaction has been dispatched to the view.
		 * Used to add external behavior to the transaction [dispatch function](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) for this editor view, which is the way updates get routed to the view */
		onTransactionDispatched: (tr: Transaction, view: EditorView) => console.log("Transaction", tr, view)
	});
	console.log(editorView);

	return <div ref={editorRef} />;
};

export default CodeEditor;