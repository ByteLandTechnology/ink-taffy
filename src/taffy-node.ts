import {
	loadTaffy,
	AlignItems,
	type AvailableSpace,
	Display,
	FlexDirection,
	Style,
	TaffyTree,
} from 'taffy-js';
import {type ElementNames} from './dom.js';

// Initialize Taffy and create a global tree instance
await loadTaffy();

/**
 * Global Taffy tree instance used for all layout calculations.
 * Taffy is a high-performance, cross-platform UI layout library.
 */
const taffyTree = new TaffyTree();

/**
 * Represents a node in the Taffy layout tree.
 * This class wraps a Taffy node ID and manages its lifecycle.
 */
export class TaffyNode {
	/**
	 * The Taffy tree instance this node belongs to.
	 */
	tree: TaffyTree;

	/**
	 * Unique identifier for the node within the Taffy tree.
	 */
	id: bigint;

	/**
	 * Callback function to measure the content of the node.
	 * Used for text nodes or other content with intrinsic size.
	 */
	measureFunc?: (width: AvailableSpace) => {width: number; height: number};

	constructor(nodeName?: ElementNames) {
		this.tree = taffyTree;
		const style = new Style();
		style.display = Display.Flex;
		style.flexDirection =
			nodeName === 'ink-root' ? FlexDirection.Column : FlexDirection.Row;
		style.alignItems = AlignItems.Stretch;
		this.id = this.tree.newLeafWithContext(style, this);
	}

	/**
	 * Removes the node and all its descendants from the Taffy tree.
	 * This is necessary to prevent memory leaks as Taffy nodes are not garbage collected automatically.
	 */
	free() {
		for (const childId of this.tree.children(this.id)) {
			this.freeRecursive(childId);
		}

		this.tree.remove(this.id);
	}

	private freeRecursive(id: bigint) {
		for (const childId of this.tree.children(id)) {
			this.freeRecursive(childId);
		}

		this.tree.remove(id);
	}
}
