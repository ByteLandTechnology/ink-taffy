import React from 'react';
import test from 'ava';
import {Box, Text} from '../src/index.js';
import {renderToString} from './helpers/render-to-string.js';

test('grid template columns', t => {
	const output = renderToString(
		<Box display="grid" gridTemplateColumns={[1, 1]} width={4}>
			<Text>A</Text>
			<Text>B</Text>
		</Box>,
	);

	t.is(output, 'AB');
});

test('grid template rows', t => {
	const output = renderToString(
		<Box display="grid" gridTemplateRows={[1, 1]} height={2}>
			<Text>A</Text>
			<Text>B</Text>
		</Box>,
	);

	t.is(output, 'A\nB');
});

test('grid auto flow column', t => {
	const output = renderToString(
		<Box
			display="grid"
			gridAutoFlow="column"
			gridTemplateRows={[1, 1]}
			height={2}
		>
			<Text>A</Text>
			<Text>B</Text>
		</Box>,
	);

	t.is(output, 'A\nB');
});

test('grid column gap', t => {
	const output = renderToString(
		<Box display="grid" gridTemplateColumns={[1, 1]} columnGap={1}>
			<Text>A</Text>
			<Text>B</Text>
		</Box>,
	);

	t.is(output, 'A B');
});

test('grid row gap', t => {
	const output = renderToString(
		<Box display="grid" gridTemplateRows={[1, 1]} rowGap={1}>
			<Text>A</Text>
			<Text>B</Text>
		</Box>,
	);

	t.is(output, 'A\n\nB');
});

test('grid placement', t => {
	const output = renderToString(
		<Box display="grid" gridTemplateColumns={[1, 1]} width={4}>
			<Box gridColumn={{start: 2, end: 'auto'}}>
				<Text>B</Text>
			</Box>
			<Box
				gridColumn={{start: 1, end: 'auto'}}
				gridRow={{start: 1, end: 'auto'}}
			>
				<Text>A</Text>
			</Box>
		</Box>,
	);

	t.is(output, 'AB');
});

test('grid complex placement', t => {
	const output = renderToString(
		<Box display="grid" gridTemplateColumns={[1, 1]} width={2}>
			<Box gridColumn={{start: 1, end: 3}}>
				<Text>AA</Text>
			</Box>
			<Text>B</Text>
			<Text>C</Text>
		</Box>,
	);

	t.is(output, 'AA\nBC');
});
