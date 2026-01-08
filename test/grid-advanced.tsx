import React from 'react';
import test from 'ava';
import {Box, Text} from '../src/index.js';
import {renderToString} from './helpers/render-to-string.js';

test('grid fr units', t => {
	const output = renderToString(
		<Box
			display="grid"
			gridTemplateColumns={[
				{min: 0, max: '1fr'},
				{min: 0, max: '2fr'},
			]}
			width={30}
		>
			<Text>A</Text>
			<Text>B</Text>
		</Box>,
	);

	// A gets 10 chars, B gets 20 chars
	// 'A' + 9 spaces = 10
	// 'B' + 19 spaces = 20
	// But text doesn't fill width unless we stretch it?
	// The CELL width is 10 and 20.
	// Default justifyItems is 'start'?
	// If text is short, it won't fill.
	// But standard renderToString output layout depends on how we inspect it.
	// If we just check text content, it might be 'A         B                   ' or similar?
	// Actually ink renderToString trims end?
	// Let's rely on spacing.
	// 30 width. A is at 0. B is at 10.
	// A is 1 char. B is 1 char.
	// A... (9 spaces) ... B ... (19 spaces)
	// Output likely: "A         B" (trimmed?)

	// Let's assume trimming happens.
	// Distance between A and B should be 9 spaces.
	// A occupies index 0. B occupies index 10.
	// 10 - 1 = 9 spaces.

	// Let's check length of line?
	// We can check specific string.
	// "A" at 0. " " at 1..9. "B" at 10.

	t.is(output, 'A         B');
});

test('grid min/max content', t => {
	const output = renderToString(
		<Box
			display="grid"
			gridTemplateColumns={[
				{min: 'max-content', max: 'max-content'},
				{min: 'max-content', max: 'max-content'},
			]}
			gap={1}
		>
			<Text>Hi</Text>
			<Text>World</Text>
		</Box>,
	);

	// Hi is 2. World is 5. Gap 1.
	// Hi World
	t.is(output, 'Hi World');
});

test('grid justify items center', t => {
	const output = renderToString(
		<Box display="grid" gridTemplateColumns={[10]} justifyItems="center">
			<Text>Hi</Text>
		</Box>,
	);

	// Column width 10. 'Hi' width 2.
	// Center: (10 - 2) / 2 = 4 start offset.
	// '    Hi'
	// '    Hi'

	t.is(output, '    Hi');
});

test('grid align items end', t => {
	const output = renderToString(
		<Box display="grid" gridTemplateRows={[3]} alignItems="end">
			<Text>A</Text>
		</Box>,
	);

	// Row height 3. 'A' height 1.
	// End alignment -> Row 3.
	// \n\nA

	t.is(output, '\n\nA');
});

test('grid justify self', t => {
	const output = renderToString(
		<Box display="grid" gridTemplateColumns={[10]}>
			<Box justifySelf="end">
				<Text>X</Text>
			</Box>
		</Box>,
	);

	// X at end of 10.
	// '         X'
	t.is(output, '         X');
});

test('grid align self', t => {
	const output = renderToString(
		<Box display="grid" gridTemplateRows={[3]}>
			<Box alignSelf="end">
				<Text>X</Text>
			</Box>
		</Box>,
	);

	// Row 3. End -> Row 3.
	// \n\nX
	t.is(output, '\n\nX');
});

test('grid align content end', t => {
	// Requires container to be larger than grid tracks
	const output = renderToString(
		<Box display="grid" gridTemplateRows={[1]} height={4} alignContent="end">
			<Text>X</Text>
		</Box>,
	);

	// Height 4. Grid content height 1.
	// End -> Bottom.
	// \n\n\nX
	t.is(output, '\n\n\nX');
});
