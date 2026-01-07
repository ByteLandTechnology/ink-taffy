import {type AvailableSpace} from 'taffy-js';
import stringWidth from 'string-width';
import measureText from './measure-text.js';
import {type Styles} from './styles.js';
import wrapText from './wrap-text.js';
import squashTextNodes from './squash-text-nodes.js';
import {type OutputTransformer} from './render-node-to-output.js';
import {TaffyNode} from './taffy-node.js';

type InkNode = {
	parentNode: DOMElement | undefined;
	taffyNode?: TaffyNode;
	internal_static?: boolean;
	style: Styles;
};

export type TextName = '#text';
export type ElementNames =
	| 'ink-root'
	| 'ink-box'
	| 'ink-text'
	| 'ink-virtual-text';

export type NodeNames = ElementNames | TextName;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type DOMElement = {
	nodeName: ElementNames;
	attributes: Record<string, DOMNodeAttribute>;
	childNodes: DOMNode[];
	internal_transform?: OutputTransformer;

	internal_accessibility?: {
		role?:
			| 'button'
			| 'checkbox'
			| 'combobox'
			| 'list'
			| 'listbox'
			| 'listitem'
			| 'menu'
			| 'menuitem'
			| 'option'
			| 'progressbar'
			| 'radio'
			| 'radiogroup'
			| 'tab'
			| 'tablist'
			| 'table'
			| 'textbox'
			| 'timer'
			| 'toolbar';
		state?: {
			busy?: boolean;
			checked?: boolean;
			disabled?: boolean;
			expanded?: boolean;
			multiline?: boolean;
			multiselectable?: boolean;
			readonly?: boolean;
			required?: boolean;
			selected?: boolean;
		};
	};

	// Internal properties
	isStaticDirty?: boolean;
	staticNode?: DOMElement;
	onComputeLayout?: () => void;
	onRender?: () => void;
	onImmediateRender?: () => void;
} & InkNode;

export type TextNode = {
	nodeName: TextName;
	nodeValue: string;
} & InkNode;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type DOMNode<T = {nodeName: NodeNames}> = T extends {
	nodeName: infer U;
}
	? U extends '#text'
		? TextNode
		: DOMElement
	: never;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type DOMNodeAttribute = boolean | string | number;

export const createNode = (nodeName: ElementNames): DOMElement => {
	const node: DOMElement = {
		nodeName,
		style: {},
		attributes: {},
		childNodes: [],
		parentNode: undefined,
		taffyNode:
			nodeName === 'ink-virtual-text' ? undefined : new TaffyNode(nodeName),
		// eslint-disable-next-line @typescript-eslint/naming-convention
		internal_accessibility: {},
	};

	if (nodeName === 'ink-text' && node.taffyNode) {
		node.taffyNode.measureFunc = measureTextNode.bind(null, node);
	}

	return node;
};

export const appendChildNode = (
	node: DOMElement,
	childNode: DOMElement,
): void => {
	if (childNode.parentNode) {
		removeChildNode(childNode.parentNode, childNode);
	}

	childNode.parentNode = node;
	node.childNodes.push(childNode);

	if (childNode.taffyNode) {
		node.taffyNode?.tree.addChild(node.taffyNode.id, childNode.taffyNode.id);
	}

	if (node.nodeName === 'ink-text' || node.nodeName === 'ink-virtual-text') {
		markNodeAsDirty(node);
	}
};

export const insertBeforeNode = (
	node: DOMElement,
	newChildNode: DOMNode,
	beforeChildNode: DOMNode,
): void => {
	if (newChildNode.parentNode) {
		removeChildNode(newChildNode.parentNode, newChildNode);
	}

	newChildNode.parentNode = node;

	const index = node.childNodes.indexOf(beforeChildNode);
	if (index >= 0) {
		node.childNodes.splice(index, 0, newChildNode);
		if (newChildNode.taffyNode) {
			node.taffyNode?.tree.insertChildAtIndex(
				node.taffyNode.id,
				index,
				newChildNode.taffyNode.id,
			);
		}

		return;
	}

	node.childNodes.push(newChildNode);

	if (newChildNode.taffyNode) {
		node.taffyNode?.tree.addChild(node.taffyNode.id, newChildNode.taffyNode.id);
	}

	if (node.nodeName === 'ink-text' || node.nodeName === 'ink-virtual-text') {
		markNodeAsDirty(node);
	}
};

export const removeChildNode = (
	node: DOMElement,
	removeNode: DOMNode,
): void => {
	if (removeNode.taffyNode) {
		removeNode.parentNode?.taffyNode?.tree.removeChild(
			removeNode.parentNode.taffyNode.id,
			removeNode.taffyNode.id,
		);
	}

	removeNode.parentNode = undefined;

	const index = node.childNodes.indexOf(removeNode);
	if (index >= 0) {
		node.childNodes.splice(index, 1);
	}

	if (node.nodeName === 'ink-text' || node.nodeName === 'ink-virtual-text') {
		markNodeAsDirty(node);
	}
};

export const setAttribute = (
	node: DOMElement,
	key: string,
	value: DOMNodeAttribute,
): void => {
	if (key === 'internal_accessibility') {
		node.internal_accessibility = value as DOMElement['internal_accessibility'];
		return;
	}

	node.attributes[key] = value;
};

export const setStyle = (node: DOMNode, style: Styles): void => {
	node.style = style;
};

export const createTextNode = (text: string): TextNode => {
	const node: TextNode = {
		nodeName: '#text',
		nodeValue: text,
		taffyNode: undefined,
		parentNode: undefined,
		style: {},
	};

	setTextNodeValue(node, text);

	return node;
};

const measureTextNode = function (
	node: DOMNode,
	width: AvailableSpace,
): {width: number; height: number} {
	const text =
		node.nodeName === '#text' ? node.nodeValue : squashTextNodes(node);

	// For minContent mode, compute the minimum possible width for the text.
	// This is the width of the widest character (e.g., emojis are typically 2 columns, ASCII chars are 1).
	if (width === 'minContent') {
		const chars = [...text];
		const maxCharWidth = Math.max(...chars.map(c => stringWidth(c)), 1);
		const textWrap = node.style?.textWrap ?? 'wrap';
		const wrappedText = wrapText(text, maxCharWidth, textWrap);
		return measureText(wrappedText);
	}

	const dimensions = measureText(text);

	// For maxContent mode, return the natural text dimensions without wrapping
	if (width === 'maxContent') {
		return dimensions;
	}

	// For definite mode with width constraint:
	// Text fits into container, no need to wrap
	if (dimensions.width <= width) {
		return dimensions;
	}

	// This is happening when <Box> is shrinking child nodes and layout engine asks
	// if we can fit this text node in a <1px space, so we just tell it "no"
	if (dimensions.width >= 1 && width > 0 && width < 1) {
		return dimensions;
	}

	const textWrap = node.style?.textWrap ?? 'wrap';
	const wrappedText = wrapText(text, width, textWrap);

	return measureText(wrappedText);
};

const findClosestTaffyNode = (node?: DOMNode): TaffyNode | undefined => {
	if (!node?.parentNode) {
		return undefined;
	}

	return node.taffyNode ?? findClosestTaffyNode(node.parentNode);
};

const markNodeAsDirty = (node?: DOMNode): void => {
	// Mark closest Taffy node as dirty to measure text dimensions again
	const taffyNode = findClosestTaffyNode(node);
	taffyNode?.tree.markDirty(taffyNode.id);
};

export const setTextNodeValue = (node: TextNode, text: string): void => {
	if (typeof text !== 'string') {
		text = String(text);
	}

	node.nodeValue = text;
	markNodeAsDirty(node);
};
