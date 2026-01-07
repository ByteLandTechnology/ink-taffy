import React from 'react';
import test from 'ava';
import {Box, Text} from '../src/index.js';
import {renderToString} from './helpers/render-to-string.js';

// ============================================================================
// Test Group 1: Explicit Min/Max Constraints Interaction
// ============================================================================

test('overflow hidden with explicit minWidth > parent width', t => {
	// If explicit minWidth says 15, but parent says 10 with overflow hidden...
	// The child should refuse to shrink below 15, so it should overflow the 10 container (which is hidden).
	// The 10 container should remain 10.
	const output = renderToString(
		<Box width={10} overflow="hidden">
			<Box minWidth={15} flexShrink={1}>
				<Text>123456789012345</Text>
			</Box>
		</Box>,
	);

	const lines = output.split('\n').filter(l => l.length > 0);
	t.is(lines.length, 1, 'Should output 1 line');
	t.is(lines[0]?.length, 10, 'Parent width should be clamped to 10');
	t.is(lines[0], '1234567890', 'Content should be clipped at 10');
});

test('overflow hidden with explicit minHeight > parent height', t => {
	const output = renderToString(
		<Box height={2} overflow="hidden" flexDirection="column">
			<Box minHeight={4} flexShrink={1}>
				<Text>
					L1{'\n'}L2{'\n'}L3{'\n'}L4
				</Text>
			</Box>
		</Box>,
	);

	const lines = output.split('\n').filter(l => l.length > 0);
	t.is(
		lines.length,
		2,
		'Should only show 2 lines due to parent overflow hidden',
	);
	t.is(lines[0], 'L1');
	t.is(lines[1], 'L2');
});

// ============================================================================
// Test Group 2: Flex Basis Interaction
// ============================================================================

test('overflow hidden should shrink flex-basis', t => {
	// Parent width 10. Child flexBasis 20. flexShrink 1.
	// Since overflow is hidden (forcing min-width behavior to 0 logic), it should shrink to 10.
	const output = renderToString(
		<Box width={10} overflow="hidden">
			<Box flexBasis={20} flexShrink={1}>
				<Text>12345678901234567890</Text>
			</Box>
		</Box>,
	);

	const lines = output.split('\n').filter(l => l.length > 0);
	// If it shrunk to 10, the text "12345678901234567890" (length 20) in a 10-width box should wrap?
	// Wait, Text wraps based on available width.
	// If the box became 10 wide, text wrapping logic kicks in.
	t.is(lines.length, 2, 'Should have 2 lines because box shrunk to 10');
	t.is(lines[0], '1234567890');
});

test('overflow hidden should NOT shrink flex-basis if flexShrink=0', t => {
	const output = renderToString(
		<Box width={10} overflow="hidden">
			<Box flexBasis={20} flexShrink={0}>
				<Text>12345678901234567890</Text>
			</Box>
		</Box>,
	);

	const lines = output.split('\n').filter(l => l.length > 0);
	// Box stays 20. Text fits in one line. Parent clips at 10.
	t.is(lines.length, 1, 'Should have 1 line because box stayed at 20');
	t.is(lines[0]?.length, 10, 'Output clipped at 10');
});

// ============================================================================
// Test Group 3: Column Direction & Min Height
// ============================================================================

test('column direction: overflow hidden allows shrinking height below content', t => {
	// Parent height 3. Child content needs 5 lines.
	// flexGrow 1, flexShrink 1.
	const output = renderToString(
		<Box height={3} overflow="hidden" flexDirection="column">
			<Box flexGrow={1} flexShrink={1}>
				<Text>
					1{'\n'}2{'\n'}3{'\n'}4{'\n'}5
				</Text>
			</Box>
		</Box>,
	);

	const lines = output.split('\n').filter(l => l.length > 0);
	t.is(lines.length, 3, 'Should show exactly 3 lines');
});

// ============================================================================
// Test Group 4: Deep Nesting Mixed Overflow
// ============================================================================

test('deep nesting mixed: hidden > visible > hidden', t => {
	// Grandparent: width 10, hidden
	// Parent: visible (should extend if needed? But constrained by grandparent?)
	// Child: width 20, flexShrink 0.
	//
	// Grandparent (10) -> Parent (Visible) -> Child (20)
	// Parent is visible, so it should be large enough to hold Child (20).
	// Grandparent is hidden, so it should clip Parent @ 10.

	const output = renderToString(
		<Box width={10} overflow="hidden">
			<Box overflow="visible">
				<Box width={20} flexShrink={0}>
					<Text>12345678901234567890</Text>
				</Box>
			</Box>
		</Box>,
	);

	const line = output.split('\n').find(l => l.length > 0);
	t.is(line?.length, 10, 'Grandparent clips output to 10');
	t.is(line, '1234567890', 'See first 10 chars');
});

// ============================================================================
// Test Group 5: Text Wrapping inside Overflow Hidden + Padding
// ============================================================================

test('text wrapping with padding and overflow hidden', t => {
	// Parent width 12. Padding 1. Available content width = 10.
	// Text "1234567890" (10 chars) should fit on one line.
	// Text "12345678901" (11 chars) should wrap.
	const output = renderToString(
		<Box width={12} padding={1} overflow="hidden">
			<Text>12345678901</Text>
		</Box>,
	);

	const lines = output.split('\n').filter(l => l.trim().length > 0);
	// Top padding line
	// Content lines.
	// Bottom padding line.
	//
	// width 12. padding 1. content width 10.
	// "12345678901" -> "1234567890" + "1"

	// Check content lines
	// remove padding lines
	const contentLines = lines.filter(l => l.includes('1'));
	t.true(contentLines.length >= 2, 'Should wrap because 11 chars > 10 width');
});
