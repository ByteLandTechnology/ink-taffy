/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {type Boxes, type BoxStyle} from 'cli-boxes';
import {type LiteralUnion} from 'type-fest';
import {type ForegroundColorName} from 'ansi-styles'; // Note: We import directly from `ansi-styles` to avoid a bug in TypeScript.
import {
	Display,
	FlexDirection,
	FlexWrap,
	AlignItems,
	AlignSelf,
	JustifyContent,
	Position,
	type LengthPercentage,
	type Style as TaffyStyle,
	type Dimension,
	AlignContent,
	Overflow,
	GridAutoFlow,
	type GridPlacement,
	type Line,
	type GridTemplateComponent,
	type TrackSizingFunction,
	type GridTemplateArea,
} from 'taffy-layout';
import {type TaffyNode} from './taffy-node.js';

export type Styles = {
	readonly textWrap?:
		| 'wrap'
		| 'end'
		| 'middle'
		| 'truncate-end'
		| 'truncate'
		| 'truncate-middle'
		| 'truncate-start';

	readonly position?: 'absolute' | 'relative';

	/**
	Size of the gap between an element's columns.
	*/
	readonly columnGap?: number;

	/**
	Size of the gap between an element's rows.
	*/
	readonly rowGap?: number;

	/**
	Size of the gap between an element's columns and rows. A shorthand for `columnGap` and `rowGap`.
	*/
	readonly gap?: number;

	/**
	Margin on all sides. Equivalent to setting `marginTop`, `marginBottom`, `marginLeft`, and `marginRight`.
	*/
	readonly margin?: number;

	/**
	Horizontal margin. Equivalent to setting `marginLeft` and `marginRight`.
	*/
	readonly marginX?: number;

	/**
	Vertical margin. Equivalent to setting `marginTop` and `marginBottom`.
	*/
	readonly marginY?: number;

	/**
	Top margin.
	*/
	readonly marginTop?: number;

	/**
	Bottom margin.
	*/
	readonly marginBottom?: number;

	/**
	Left margin.
	*/
	readonly marginLeft?: number;

	/**
	Right margin.
	*/
	readonly marginRight?: number;

	/**
	Padding on all sides. Equivalent to setting `paddingTop`, `paddingBottom`, `paddingLeft`, and `paddingRight`.
	*/
	readonly padding?: number;

	/**
	Horizontal padding. Equivalent to setting `paddingLeft` and `paddingRight`.
	*/
	readonly paddingX?: number;

	/**
	Vertical padding. Equivalent to setting `paddingTop` and `paddingBottom`.
	*/
	readonly paddingY?: number;

	/**
	Top padding.
	*/
	readonly paddingTop?: number;

	/**
	Bottom padding.
	*/
	readonly paddingBottom?: number;

	/**
	Left padding.
	*/
	readonly paddingLeft?: number;

	/**
	Right padding.
	*/
	readonly paddingRight?: number;

	/**
	This property defines the ability for a flex item to grow if necessary.
	See [flex-grow](https://css-tricks.com/almanac/properties/f/flex-grow/).
	*/
	readonly flexGrow?: number;

	/**
	It specifies the “flex shrink factor”, which determines how much the flex item will shrink relative to the rest of the flex items in the flex container when there isn’t enough space on the row.
	See [flex-shrink](https://css-tricks.com/almanac/properties/f/flex-shrink/).
	*/
	readonly flexShrink?: number;

	/**
	It establishes the main-axis, thus defining the direction flex items are placed in the flex container.
	See [flex-direction](https://css-tricks.com/almanac/properties/f/flex-direction/).
	*/
	readonly flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';

	/**
	It specifies the initial size of the flex item, before any available space is distributed according to the flex factors.
	See [flex-basis](https://css-tricks.com/almanac/properties/f/flex-basis/).
	*/
	readonly flexBasis?: number | string;

	/**
	It defines whether the flex items are forced in a single line or can be flowed into multiple lines. If set to multiple lines, it also defines the cross-axis which determines the direction new lines are stacked in.
	See [flex-wrap](https://css-tricks.com/almanac/properties/f/flex-wrap/).
	*/
	readonly flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';

	/**
	The align-items property defines the default behavior for how items are laid out along the cross axis (perpendicular to the main axis).
	See [align-items](https://css-tricks.com/almanac/properties/a/align-items/).
	*/
	readonly alignItems?:
		| 'flex-start'
		| 'center'
		| 'flex-end'
		| 'stretch'
		| 'start'
		| 'end';

	/**
	It makes possible to override the align-items value for specific flex items.
	See [align-self](https://css-tricks.com/almanac/properties/a/align-self/).
	*/
	readonly alignSelf?:
		| 'flex-start'
		| 'center'
		| 'flex-end'
		| 'auto'
		| 'start'
		| 'end';

	/**
	It defines the alignment along the main axis.
	See [justify-content](https://css-tricks.com/almanac/properties/j/justify-content/).
	*/
	readonly justifyContent?:
		| 'flex-start'
		| 'flex-end'
		| 'space-between'
		| 'space-around'
		| 'space-evenly'
		| 'center'
		| 'start'
		| 'end';

	/**
	The align-content property modifies the behavior of the flex-wrap property. It is similar to align-items, but it aligns flex lines.
	See [align-content](https://css-tricks.com/almanac/properties/a/align-content/).
	*/
	readonly alignContent?:
		| 'flex-start'
		| 'flex-end'
		| 'space-between'
		| 'space-around'
		| 'stretch'
		| 'center'
		| 'space-evenly'
		| 'start'
		| 'end';

	/**
	The justify-items property defines the default justify-self for all items of the box, giving them all a default way of justifying each box along the appropriate axis.
	See [justify-items](https://css-tricks.com/almanac/properties/j/justify-items/).
	*/
	readonly justifyItems?:
		| 'flex-start'
		| 'end'
		| 'flex-end'
		| 'center'
		| 'stretch';

	/**
	The justify-self property sets the way a box is justified inside its alignment container along the appropriate axis.
	See [justify-self](https://css-tricks.com/almanac/properties/j/justify-self/).
	*/
	readonly justifySelf?:
		| 'auto'
		| 'flex-start'
		| 'end'
		| 'flex-end'
		| 'center'
		| 'stretch';

	/**
	Width of the element in spaces. You can also set it as a percentage, which will calculate the width based on the width of the parent element.
	*/
	readonly width?: number | string;

	/**
	Height of the element in lines (rows). You can also set it as a percentage, which will calculate the height based on the height of the parent element.
	*/
	readonly height?: number | string;

	/**
	Sets a minimum width of the element.
	*/
	readonly minWidth?: number | string;

	/**
	Sets a minimum height of the element.
	*/
	readonly minHeight?: number | string;

	/**
	Set this property to `none` to hide the element.
	*/
	readonly display?: 'flex' | 'grid' | 'none';

	/**
	Add a border with a specified style. If `borderStyle` is `undefined` (the default), no border will be added.
	*/
	readonly borderStyle?: keyof Boxes | BoxStyle;

	/**
	Determines whether the top border is visible.
	
	@default true
	*/
	readonly borderTop?: boolean;

	/**
	Determines whether the bottom border is visible.
	
	@default true
	*/
	readonly borderBottom?: boolean;

	/**
	Determines whether the left border is visible.
	
	@default true
	*/
	readonly borderLeft?: boolean;

	/**
	Determines whether the right border is visible.
	
	@default true
	*/
	readonly borderRight?: boolean;

	/**
	Change border color. A shorthand for setting `borderTopColor`, `borderRightColor`, `borderBottomColor`, and `borderLeftColor`.
	*/
	readonly borderColor?: LiteralUnion<ForegroundColorName, string>;

	/**
	Change the top border color. Accepts the same values as `color` in `Text` component.
	*/
	readonly borderTopColor?: LiteralUnion<ForegroundColorName, string>;

	/**
	Change the bottom border color. Accepts the same values as `color` in `Text` component.
	*/
	readonly borderBottomColor?: LiteralUnion<ForegroundColorName, string>;

	/**
	Change the left border color. Accepts the same values as `color` in `Text` component.
	*/
	readonly borderLeftColor?: LiteralUnion<ForegroundColorName, string>;

	/**
	Change the right border color. Accepts the same values as `color` in `Text` component.
	*/
	readonly borderRightColor?: LiteralUnion<ForegroundColorName, string>;

	/**
	Dim the border color. A shorthand for setting `borderTopDimColor`, `borderBottomDimColor`, `borderLeftDimColor`, and `borderRightDimColor`.

	@default false
	*/
	readonly borderDimColor?: boolean;

	/**
	Dim the top border color.
	
	@default false
	*/
	readonly borderTopDimColor?: boolean;

	/**
	Dim the bottom border color.
	
	@default false
	*/
	readonly borderBottomDimColor?: boolean;

	/**
	Dim the left border color.
	
	@default false
	*/
	readonly borderLeftDimColor?: boolean;

	/**
	Dim the right border color.
	
	@default false
	*/
	readonly borderRightDimColor?: boolean;

	/**
	Behavior for an element's overflow in both directions.
	
	@default 'visible'
	*/
	readonly overflow?: 'visible' | 'hidden';

	/**
	Behavior for an element's overflow in the horizontal direction.

	@default 'visible'
	*/
	readonly overflowX?: 'visible' | 'hidden';

	/**
	Behavior for an element's overflow in the vertical direction.

	@default 'visible'
	*/
	readonly overflowY?: 'visible' | 'hidden';

	/**
	Background color for the element.
	
	Accepts the same values as `color` in the `<Text>` component.
	*/
	readonly backgroundColor?: LiteralUnion<ForegroundColorName, string>;

	/**
	 * CSS Grid Layout properties
	 */

	/**
	 * Defines the columns of the grid with a space-separated list of values.
	 * The values represent the track size, and the space between them represents the grid line.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns
	 */
	readonly gridTemplateColumns?: Array<GridTemplateComponent | number>;

	/**
	 * Defines the rows of the grid with a space-separated list of values.
	 * The values represent the track size, and the space between them represents the grid line.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows
	 */
	readonly gridTemplateRows?: Array<GridTemplateComponent | number>;

	/**
	 * Specifies the size of an implicitly-created grid column track.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-columns
	 */
	readonly gridAutoColumns?: Array<TrackSizingFunction | number>;

	/**
	 * Specifies the size of an implicitly-created grid row track.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-rows
	 */
	readonly gridAutoRows?: Array<TrackSizingFunction | number>;

	/**
	 * Controls how the auto-placement algorithm works, specifying exactly how auto-placed items get flowed into the grid.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow
	 */
	readonly gridAutoFlow?: 'row' | 'column' | 'row-dense' | 'column-dense';

	/**
	 * Specifies a grid item’s size and location within a grid row.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row
	 */
	readonly gridRow?: Line<GridPlacement>;

	/**
	 * Specifies a grid item’s size and location within a grid column.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column
	 */
	readonly gridColumn?: Line<GridPlacement>;

	/**
	 * Specifies named grid areas.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas
	 */
	readonly gridTemplateAreas?: GridTemplateArea[];
};

const applyPositionStyles = (taffyStyle: TaffyStyle, style: Styles): void => {
	if ('position' in style) {
		taffyStyle.position =
			style.position === 'absolute' ? Position.Absolute : Position.Relative;
	}
};

const applyMarginStyles = (taffyStyle: TaffyStyle, style: Styles): void => {
	let marginLeft: number | undefined;
	let marginRight: number | undefined;
	let marginTop: number | undefined;
	let marginBottom: number | undefined;

	if ('margin' in style) {
		marginLeft = style.margin ?? 0;
		marginRight = marginLeft;
		marginTop = marginLeft;
		marginBottom = marginLeft;
	}

	if ('marginX' in style) {
		marginLeft = style.marginX ?? 0;
		marginRight = marginLeft;
	}

	if ('marginY' in style) {
		marginTop = style.marginY ?? 0;
		marginBottom = marginTop;
	}

	if ('marginLeft' in style) {
		marginLeft = style.marginLeft || 0;
	}

	if ('marginRight' in style) {
		marginRight = style.marginRight || 0;
	}

	if ('marginTop' in style) {
		marginTop = style.marginTop || 0;
	}

	if ('marginBottom' in style) {
		marginBottom = style.marginBottom || 0;
	}

	if (
		marginLeft !== undefined ||
		marginRight !== undefined ||
		marginTop !== undefined ||
		marginBottom !== undefined
	) {
		taffyStyle.margin = {
			left: marginLeft ?? taffyStyle.margin.left,
			right: marginRight ?? taffyStyle.margin.right,
			top: marginTop ?? taffyStyle.margin.top,
			bottom: marginBottom ?? taffyStyle.margin.bottom,
		};
	}
};

const applyPaddingStyles = (taffyStyle: TaffyStyle, style: Styles): void => {
	let paddingLeft: number | undefined;
	let paddingRight: number | undefined;
	let paddingTop: number | undefined;
	let paddingBottom: number | undefined;

	if ('padding' in style) {
		paddingLeft = style.padding ?? 0;
		paddingRight = paddingLeft;
		paddingTop = paddingLeft;
		paddingBottom = paddingLeft;
	}

	if ('paddingX' in style) {
		paddingLeft = style.paddingX ?? 0;
		paddingRight = paddingLeft;
	}

	if ('paddingY' in style) {
		paddingTop = style.paddingY ?? 0;
		paddingBottom = paddingTop;
	}

	if ('paddingLeft' in style) {
		paddingLeft = style.paddingLeft || 0;
	}

	if ('paddingRight' in style) {
		paddingRight = style.paddingRight || 0;
	}

	if ('paddingTop' in style) {
		paddingTop = style.paddingTop || 0;
	}

	if ('paddingBottom' in style) {
		paddingBottom = style.paddingBottom || 0;
	}

	if (
		paddingLeft !== undefined ||
		paddingRight !== undefined ||
		paddingTop !== undefined ||
		paddingBottom !== undefined
	) {
		taffyStyle.padding = {
			left: paddingLeft ?? taffyStyle.padding.left,
			right: paddingRight ?? taffyStyle.padding.right,
			top: paddingTop ?? taffyStyle.padding.top,
			bottom: paddingBottom ?? taffyStyle.padding.bottom,
		};
	}
};

const applyFlexStyles = (taffyStyle: TaffyStyle, style: Styles): void => {
	if ('flexGrow' in style) {
		taffyStyle.flexGrow = style.flexGrow ?? 0;
	}

	if ('flexShrink' in style) {
		taffyStyle.flexShrink =
			typeof style.flexShrink === 'number' ? style.flexShrink : 1;
	}

	if ('flexWrap' in style) {
		switch (style.flexWrap) {
			case 'nowrap': {
				taffyStyle.flexWrap = FlexWrap.NoWrap;
				break;
			}

			case 'wrap': {
				taffyStyle.flexWrap = FlexWrap.Wrap;
				break;
			}

			case 'wrap-reverse': {
				taffyStyle.flexWrap = FlexWrap.WrapReverse;
				break;
			}

			default: {
				taffyStyle.flexWrap = FlexWrap.NoWrap;
				break;
			}
		}
	}

	if ('flexDirection' in style) {
		switch (style.flexDirection) {
			case 'row': {
				taffyStyle.flexDirection = FlexDirection.Row;
				break;
			}

			case 'row-reverse': {
				taffyStyle.flexDirection = FlexDirection.RowReverse;
				break;
			}

			case 'column': {
				taffyStyle.flexDirection = FlexDirection.Column;
				break;
			}

			case 'column-reverse': {
				taffyStyle.flexDirection = FlexDirection.ColumnReverse;
				break;
			}

			default: {
				taffyStyle.flexDirection = FlexDirection.Row;
				break;
			}
		}
	}

	if ('flexBasis' in style) {
		if (typeof style.flexBasis === 'number') {
			taffyStyle.flexBasis = style.flexBasis;
		} else if (
			typeof style.flexBasis === 'string' &&
			style.flexBasis.endsWith('%')
		) {
			taffyStyle.flexBasis = style.flexBasis as `${number}%`;
		} else {
			taffyStyle.flexBasis = 'auto';
		}
	}

	if ('alignItems' in style) {
		switch (style.alignItems) {
			case 'stretch': {
				taffyStyle.alignItems = AlignItems.Stretch;
				break;
			}

			case 'flex-start': {
				taffyStyle.alignItems = AlignItems.FlexStart;
				break;
			}

			case 'center': {
				taffyStyle.alignItems = AlignItems.Center;
				break;
			}

			case 'flex-end': {
				taffyStyle.alignItems = AlignItems.FlexEnd;
				break;
			}

			case 'start': {
				taffyStyle.alignItems = AlignItems.Start;
				break;
			}

			case 'end': {
				taffyStyle.alignItems = AlignItems.End;
				break;
			}

			default: {
				taffyStyle.alignItems = undefined;
				break;
			}
		}
	}

	if ('alignSelf' in style) {
		switch (style.alignSelf) {
			case 'flex-start': {
				taffyStyle.alignSelf = AlignSelf.FlexStart;
				break;
			}

			case 'center': {
				taffyStyle.alignSelf = AlignSelf.Center;
				break;
			}

			case 'flex-end': {
				taffyStyle.alignSelf = AlignSelf.FlexEnd;
				break;
			}

			case 'auto': {
				taffyStyle.alignSelf = AlignSelf.Auto;
				break;
			}

			case 'start': {
				taffyStyle.alignSelf = AlignSelf.Start;
				break;
			}

			case 'end': {
				taffyStyle.alignSelf = AlignSelf.End;
				break;
			}

			default: {
				taffyStyle.alignSelf = undefined;
				break;
			}
		}
	}

	if ('justifyContent' in style) {
		switch (style.justifyContent) {
			case 'flex-start': {
				taffyStyle.justifyContent = JustifyContent.FlexStart;
				break;
			}

			case 'center': {
				taffyStyle.justifyContent = JustifyContent.Center;
				break;
			}

			case 'flex-end': {
				taffyStyle.justifyContent = JustifyContent.FlexEnd;
				break;
			}

			case 'space-between': {
				taffyStyle.justifyContent = JustifyContent.SpaceBetween;
				break;
			}

			case 'space-around': {
				taffyStyle.justifyContent = JustifyContent.SpaceAround;
				break;
			}

			case 'space-evenly': {
				taffyStyle.justifyContent = JustifyContent.SpaceEvenly;
				break;
			}

			case 'start': {
				taffyStyle.justifyContent = JustifyContent.Start;
				break;
			}

			case 'end': {
				taffyStyle.justifyContent = JustifyContent.End;
				break;
			}

			default: {
				taffyStyle.justifyContent = undefined;
				break;
			}
		}
	}

	if ('alignContent' in style) {
		switch (style.alignContent) {
			case 'flex-start': {
				taffyStyle.alignContent = AlignContent.FlexStart;
				break;
			}

			case 'flex-end': {
				taffyStyle.alignContent = AlignContent.FlexEnd;
				break;
			}

			case 'space-between': {
				taffyStyle.alignContent = AlignContent.SpaceBetween;
				break;
			}

			case 'space-around': {
				taffyStyle.alignContent = AlignContent.SpaceAround;
				break;
			}

			case 'stretch': {
				taffyStyle.alignContent = AlignContent.Stretch;
				break;
			}

			case 'center': {
				taffyStyle.alignContent = AlignContent.Center;
				break;
			}

			case 'space-evenly': {
				taffyStyle.alignContent = AlignContent.SpaceEvenly;
				break;
			}

			case 'start': {
				taffyStyle.alignContent = AlignContent.Start;
				break;
			}

			case 'end': {
				taffyStyle.alignContent = AlignContent.End;
				break;
			}

			default: {
				taffyStyle.alignContent = undefined;
				break;
			}
		}
	}

	if (taffyStyle.alignContent === undefined) {
		taffyStyle.alignContent = AlignContent.FlexStart;
	}
};

const applyDimensionStyles = (taffyStyle: TaffyStyle, style: Styles): void => {
	let newWidth: Dimension | undefined;

	if ('width' in style) {
		if (typeof style.width === 'number') {
			newWidth = style.width;
		} else if (typeof style.width === 'string' && style.width.endsWith('%')) {
			newWidth = style.width as `${number}%`;
		} else {
			newWidth = 'auto';
		}
	}

	let newHeight: Dimension | undefined;
	if ('height' in style) {
		if (typeof style.height === 'number') {
			newHeight = style.height;
		} else if (typeof style.height === 'string' && style.height.endsWith('%')) {
			newHeight = style.height as `${number}%`;
		} else {
			newHeight = 'auto';
		}
	}

	if (newWidth !== undefined || newHeight !== undefined) {
		taffyStyle.size = {
			width: newWidth ?? taffyStyle.size.width,
			height: newHeight ?? taffyStyle.size.height,
		};
	}

	let newMinWidth: Dimension | undefined;
	if ('minWidth' in style) {
		if (typeof style.minWidth === 'number') {
			newMinWidth = style.minWidth;
		} else if (
			typeof style.minWidth === 'string' &&
			style.minWidth.endsWith('%')
		) {
			newMinWidth = style.minWidth as `${number}%`;
		} else {
			newMinWidth = 'auto';
		}
	}

	let newMinHeight: Dimension | undefined;
	if ('minHeight' in style) {
		if (typeof style.minHeight === 'number') {
			newMinHeight = style.minHeight;
		} else if (
			typeof style.minHeight === 'string' &&
			style.minHeight.endsWith('%')
		) {
			newMinHeight = style.minHeight as `${number}%`;
		} else {
			newMinHeight = 'auto';
		}
	}

	if (newMinWidth !== undefined || newMinHeight !== undefined) {
		taffyStyle.minSize = {
			width: newMinWidth ?? taffyStyle.minSize.width,
			height: newMinHeight ?? taffyStyle.minSize.height,
		};
	}
};

const applyDisplayStyles = (taffyStyle: TaffyStyle, style: Styles): void => {
	if ('display' in style) {
		switch (style.display) {
			case 'flex': {
				taffyStyle.display = Display.Flex;
				break;
			}

			case 'grid': {
				taffyStyle.display = Display.Grid;
				break;
			}

			case 'none': {
				taffyStyle.display = Display.None;
				break;
			}

			default: {
				taffyStyle.display = Display.Flex;
				break;
			}
		}
	}
};

const applyBorderStyles = (taffyStyle: TaffyStyle, style: Styles): void => {
	if ('borderStyle' in style) {
		const borderWidth = style.borderStyle ? 1 : 0;
		const border = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
		};

		if (style.borderTop !== false) {
			border.top = borderWidth;
		}

		if (style.borderBottom !== false) {
			border.bottom = borderWidth;
		}

		if (style.borderLeft !== false) {
			border.left = borderWidth;
		}

		if (style.borderRight !== false) {
			border.right = borderWidth;
		}

		taffyStyle.border = border;
	}
};

const applyGapStyles = (taffyStyle: TaffyStyle, style: Styles): void => {
	let gapWidth: LengthPercentage | undefined;
	let gapHeight: LengthPercentage | undefined;
	if ('gap' in style) {
		const val = style.gap ?? 0;
		gapWidth = val;
		gapHeight = val;
	}

	if ('columnGap' in style) {
		gapWidth = style.columnGap ?? 0;
	}

	if ('rowGap' in style) {
		gapHeight = style.rowGap ?? 0;
	}

	if (gapWidth !== undefined || gapHeight !== undefined) {
		taffyStyle.gap = {
			width: gapWidth ?? taffyStyle.gap.width,
			height: gapHeight ?? taffyStyle.gap.height,
		};
	}
};

const applyOverflowStyles = (taffyStyle: TaffyStyle, style: Styles): void => {
	let overflowX: Overflow | undefined;
	let overflowY: Overflow | undefined;

	if ('overflow' in style) {
		switch (style.overflow) {
			case 'hidden': {
				overflowX = Overflow.Hidden;
				overflowY = Overflow.Hidden;
				break;
			}

			case 'visible': {
				overflowX = Overflow.Visible;
				overflowY = Overflow.Visible;
				break;
			}

			default: {
				overflowX = Overflow.Visible;
				overflowY = Overflow.Visible;
				break;
			}
		}
	}

	if ('overflowX' in style) {
		switch (style.overflowX) {
			case 'hidden': {
				overflowX = Overflow.Hidden;
				break;
			}

			case 'visible': {
				overflowX = Overflow.Visible;
				break;
			}

			default: {
				overflowX = Overflow.Visible;
				break;
			}
		}
	}

	if ('overflowY' in style) {
		switch (style.overflowY) {
			case 'hidden': {
				overflowY = Overflow.Hidden;
				break;
			}

			case 'visible': {
				overflowY = Overflow.Visible;
				break;
			}

			default: {
				overflowY = Overflow.Visible;
				break;
			}
		}
	}

	if (overflowX !== undefined || overflowY !== undefined) {
		taffyStyle.overflow = {
			x: overflowX ?? taffyStyle.overflow.x,
			y: overflowY ?? taffyStyle.overflow.y,
		};
	}
};

const mapGridTrack = (
	track: GridTemplateComponent | number,
): GridTemplateComponent => {
	if (typeof track === 'number') {
		return {min: track, max: track};
	}

	return track;
};

const mapTrackSizing = (
	track: TrackSizingFunction | number,
): TrackSizingFunction => {
	if (typeof track === 'number') {
		return {min: track, max: track};
	}

	return track;
};

const applyGridStyles = (taffyStyle: TaffyStyle, style: Styles): void => {
	if ('gridTemplateColumns' in style && style.gridTemplateColumns) {
		taffyStyle.gridTemplateColumns = style.gridTemplateColumns.map(track =>
			mapGridTrack(track),
		);
	}

	if ('gridTemplateRows' in style && style.gridTemplateRows) {
		taffyStyle.gridTemplateRows = style.gridTemplateRows.map(track =>
			mapGridTrack(track),
		);
	}

	if ('gridAutoColumns' in style && style.gridAutoColumns) {
		taffyStyle.gridAutoColumns = style.gridAutoColumns.map(track =>
			mapTrackSizing(track),
		);
	}

	if ('gridAutoRows' in style && style.gridAutoRows) {
		taffyStyle.gridAutoRows = style.gridAutoRows.map(track =>
			mapTrackSizing(track),
		);
	}

	if ('gridAutoFlow' in style) {
		switch (style.gridAutoFlow) {
			case 'row': {
				taffyStyle.gridAutoFlow = GridAutoFlow.Row;
				break;
			}

			case 'column': {
				taffyStyle.gridAutoFlow = GridAutoFlow.Column;
				break;
			}

			case 'row-dense': {
				taffyStyle.gridAutoFlow = GridAutoFlow.RowDense;
				break;
			}

			case 'column-dense': {
				taffyStyle.gridAutoFlow = GridAutoFlow.ColumnDense;
				break;
			}

			default: {
				taffyStyle.gridAutoFlow = GridAutoFlow.Row;
				break;
			}
		}
	}

	if ('gridRow' in style && style.gridRow) {
		taffyStyle.gridRow = style.gridRow;
	}

	if ('gridColumn' in style && style.gridColumn) {
		taffyStyle.gridColumn = style.gridColumn;
	}

	if ('gridTemplateAreas' in style && style.gridTemplateAreas) {
		taffyStyle.gridTemplateAreas = style.gridTemplateAreas;
	}

	if ('justifyItems' in style) {
		switch (style.justifyItems) {
			case 'flex-start': {
				taffyStyle.justifyItems = AlignItems.FlexStart;
				break;
			}

			case 'flex-end': {
				taffyStyle.justifyItems = AlignItems.FlexEnd;
				break;
			}

			case 'center': {
				taffyStyle.justifyItems = AlignItems.Center;
				break;
			}

			case 'stretch': {
				taffyStyle.justifyItems = AlignItems.Stretch;
				break;
			}

			case 'end': {
				taffyStyle.justifyItems = AlignItems.End;
				break;
			}

			default: {
				taffyStyle.justifyItems = undefined;
				break;
			}
		}
	}

	if ('justifySelf' in style) {
		switch (style.justifySelf) {
			case 'flex-start': {
				taffyStyle.justifySelf = AlignSelf.FlexStart;
				break;
			}

			case 'flex-end': {
				taffyStyle.justifySelf = AlignSelf.FlexEnd;
				break;
			}

			case 'center': {
				taffyStyle.justifySelf = AlignSelf.Center;
				break;
			}

			case 'stretch': {
				taffyStyle.justifySelf = AlignSelf.Stretch;
				break;
			}

			case 'end': {
				taffyStyle.justifySelf = AlignSelf.End;
				break;
			}

			case 'auto': {
				taffyStyle.justifySelf = AlignSelf.Auto;
				break;
			}

			default: {
				taffyStyle.justifySelf = undefined;
				break;
			}
		}
	}
};

const styles = (node: TaffyNode, style: Styles = {}): void => {
	const taffyStyle = node.tree.getStyle(node.id);
	applyPositionStyles(taffyStyle, style);
	applyMarginStyles(taffyStyle, style);
	applyPaddingStyles(taffyStyle, style);
	applyFlexStyles(taffyStyle, style);
	applyDimensionStyles(taffyStyle, style);
	applyDisplayStyles(taffyStyle, style);
	applyBorderStyles(taffyStyle, style);
	applyGapStyles(taffyStyle, style);
	applyOverflowStyles(taffyStyle, style);
	applyGridStyles(taffyStyle, style);
	node.tree.setStyle(node.id, taffyStyle);
};

export default styles;
