import {type DOMElement} from './dom.js';

type Output = {
	/**
	Element width.
	*/
	width: number;

	/**
	Element height.
	*/
	height: number;
};

/**
Measure the dimensions of a particular `<Box>` element.
*/
const measureElement = (node: DOMElement): Output => {
	const layout = node.taffyNode?.tree.getLayout(node.taffyNode.id);
	return {
		width: layout?.width ?? 0,
		height: layout?.height ?? 0,
	};
};

export default measureElement;
