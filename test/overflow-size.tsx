/**
 * Test file for verifying overflow="hidden" box size calculation.
 *
 * This test suite verifies that when a box has overflow="hidden",
 * its size calculation is NOT affected by its child elements that
 * exceed the box's specified dimensions.
 *
 * The core issue being tested:
 * - When overflow is "hidden", the parent box should maintain its
 *   specified size regardless of child content dimensions.
 * - The child content should be clipped, but the parent's layout
 *   dimensions should not grow to accommodate the child.
 */

import React from 'react';
import test from 'ava';
import {Box, Text} from '../src/index.js';
import {renderToString} from './helpers/render-to-string.js';

// ============================================================================
// Test Group 0: Layout Width dependence on Overflow Style
// ============================================================================

test('verify layout width depends on overflow style', t => {
	// This test does not set an explicit width for the box with overflow="hidden".
	// It is placed as a flex item inside a container with width 10.

	// Expected behavior:
	// 1. If Taffy recognizes overflow="hidden", this box should shrink to 10 (even if the child is 20 wide). The rendered output should be clipped to 10 characters.
	// 2. If Taffy does not know (i.e. visible), this box will be expanded by the child to 20. The rendered result will show 20 characters.

	// If applyOverflowStyles is disabled, the Layout Width here will be 20, and the output length will be 20.
	// If applyOverflowStyles is active, the Layout Width here is 10, and the output length is 10.

	const output = renderToString(
		<Box width={10}>
			<Box overflow="hidden" flexGrow={1}>
				<Box width={20} flexShrink={0}>
					<Text>12345678901234567890</Text>
				</Box>
			</Box>
		</Box>,
	);

	const line = output.split('\n').find(l => l.length > 0);

	t.is(
		line?.length,
		10,
		`Width should be constrained to 10. actual: ${line?.length}`,
	);
});

test('verify layout width depends on overflowX style', t => {
	const output = renderToString(
		<Box width={10}>
			{/* overflowX="hidden" should also allow shrinking */}
			<Box overflowX="hidden" flexGrow={1}>
				<Box width={20} flexShrink={0}>
					<Text>12345678901234567890</Text>
				</Box>
			</Box>
		</Box>,
	);

	const line = output.split('\n').find(l => l.length > 0);

	t.is(
		line?.length,
		10,
		`Width should be constrained to 10 with overflowX="hidden". actual: ${line?.length}`,
	);
});

test('verify layout height depends on overflowY style', t => {
	const output = renderToString(
		<Box height={3} flexDirection="column">
			{/* overflowY="hidden" should allow shrinking vertically */}
			<Box overflowY="hidden" flexGrow={1}>
				<Box height={10} flexShrink={0}>
					<Text>
						L1{'\n'}L2{'\n'}L3{'\n'}L4{'\n'}L5{'\n'}L6
					</Text>
				</Box>
			</Box>
		</Box>,
	);

	const lines = output.split('\n').filter(l => l.length > 0);

	// The container is height 3. The inner box should shrink to fill it.
	// Max lines should be 3.
	t.true(
		lines.length <= 3,
		`Height should be constrained to 3 with overflowY="hidden". actual lines: ${lines.length}`,
	);
});

test('verify layout width with overflow="visible" does NOT shrink below content size', t => {
	const output = renderToString(
		<Box width={10}>
			{/* With overflow="visible", min-width should be "auto" (content size), which is 20.
			    So it should overflow the parent width of 10. */}
			<Box overflow="visible" flexGrow={1} flexShrink={1}>
				<Box width={20} flexShrink={0}>
					<Text>12345678901234567890</Text>
				</Box>
			</Box>
		</Box>,
	);

	const line = output.split('\n').find(l => l.length > 0);

	t.is(
		line?.length,
		20,
		`With overflow="visible", item should not shrink below content width (20). actual: ${line?.length}`,
	);
});

// ============================================================================
// Test Group 1: Basic overflow="hidden" size constraints (width)
// ============================================================================

test('overflow hidden - parent width should NOT be affected by wider child', t => {
	const output = renderToString(
		<Box width={10}>
			<Box width={5} overflow="hidden">
				{/* Child is wider than parent */}
				<Box width={20} flexShrink={0}>
					<Text>12345678901234567890</Text>
				</Box>
			</Box>
		</Box>,
	);

	// The parent box with overflow="hidden" and width=5 should only be 5 characters wide
	// If the bug exists, it would expand to accommodate the child's 20-character width
	const lines = output.split('\n');
	const maxWidth = Math.max(...lines.map(line => line.length));

	// The output should be at most 10 characters wide (outer container)
	// The inner box with overflow="hidden" should be 5 characters wide
	t.true(
		maxWidth <= 10,
		`Expected max width <= 10, but got ${maxWidth}. Output:\n${output}`,
	);
});

test('overflow hidden - parent should display specified width even with larger child', t => {
	const output = renderToString(
		<Box width={6} overflow="hidden">
			<Box width={20} flexShrink={0}>
				<Text>ABCDEFGHIJKLMNOPQRST</Text>
			</Box>
		</Box>,
	);

	// The output should be exactly 6 characters wide, showing "ABCDEF"
	const lines = output.split('\n').filter(line => line.length > 0);
	t.is(lines.length, 1, 'Should have exactly 1 line of output');
	t.is(
		lines[0]?.length,
		6,
		`Expected width of 6, got ${lines[0]?.length}. Output: "${lines[0]}"`,
	);
	t.is(lines[0], 'ABCDEF', 'Content should be clipped to first 6 characters');
});

// ============================================================================
// Test Group 2: Basic overflow="hidden" size constraints (height)
// ============================================================================

test('overflow hidden - parent height should NOT be affected by taller child', t => {
	const output = renderToString(
		<Box height={3} overflow="hidden" flexDirection="column">
			{/* Child has more lines than parent height allows */}
			<Box height={10} flexShrink={0}>
				<Text>
					Line1{'\n'}Line2{'\n'}Line3{'\n'}Line4{'\n'}Line5{'\n'}Line6{'\n'}
					Line7
					{'\n'}Line8{'\n'}Line9{'\n'}Line10
				</Text>
			</Box>
		</Box>,
	);

	// The parent box with overflow="hidden" and height=3 should only show 3 lines
	const lines = output.split('\n');

	// If overflow is working correctly, we should see at most 3 non-empty lines
	const nonEmptyLines = lines.filter(line => line.trim().length > 0);
	t.true(
		nonEmptyLines.length <= 3,
		`Expected at most 3 lines, but got ${nonEmptyLines.length}. Output:\n${output}`,
	);
});

test('overflowY hidden - parent height should NOT be affected by taller child', t => {
	const output = renderToString(
		<Box height={2} overflowY="hidden" flexDirection="column">
			<Box flexShrink={0}>
				<Text>
					Line1{'\n'}Line2{'\n'}Line3{'\n'}Line4
				</Text>
			</Box>
		</Box>,
	);

	// Should only show 2 lines
	const lines = output.split('\n');
	const nonEmptyLines = lines.filter(line => line.trim().length > 0);
	t.true(
		nonEmptyLines.length <= 2,
		`Expected at most 2 lines, but got ${nonEmptyLines.length}. Output:\n${output}`,
	);
});

// ============================================================================
// Test Group 3: Combined width and height with overflow hidden
// ============================================================================

test('overflow hidden - both width and height should be constrained', t => {
	const output = renderToString(
		<Box width={4} height={2} overflow="hidden">
			<Box width={10} height={5} flexShrink={0}>
				<Text>
					1234567890{'\n'}ABCDEFGHIJ{'\n'}!@#$%^&*(){'\n'}qwertyuiop{'\n'}
					ZXCVBNM
				</Text>
			</Box>
		</Box>,
	);

	const lines = output.split('\n');

	// Check height constraint: should be at most 2 lines
	const nonEmptyLines = lines.filter(line => line.length > 0);
	t.true(
		nonEmptyLines.length <= 2,
		`Height constraint failed: expected <= 2 lines, got ${nonEmptyLines.length}`,
	);

	// Check width constraint: each line should be at most 4 characters
	for (const line of nonEmptyLines) {
		t.true(
			line.length <= 4,
			`Width constraint failed: expected <= 4 chars, got ${line.length} for line "${line}"`,
		);
	}
});

// ============================================================================
// Test Group 4: Nested overflow hidden containers
// ============================================================================

test('nested overflow hidden - inner container should respect its own constraints', t => {
	const output = renderToString(
		<Box width={10} overflow="hidden">
			<Box width={6} overflow="hidden">
				<Box width={20} flexShrink={0}>
					<Text>ABCDEFGHIJKLMNOPQRST</Text>
				</Box>
			</Box>
		</Box>,
	);

	// Inner box has width=6 with overflow=hidden
	// Should clip to 6 characters
	const line = output.split('\n').find(line => line.length > 0);
	t.is(
		line?.length,
		6,
		`Expected inner width of 6, got ${line?.length}. Output: "${line}"`,
	);
});

// ============================================================================
// Test Group 5: overflow hidden with flexShrink
// ============================================================================

test('overflow hidden child with flexShrink=0 should not affect parent size', t => {
	const output = renderToString(
		<Box width={8} overflow="hidden">
			<Box width={4} flexShrink={0}>
				<Text>AAAA</Text>
			</Box>
			<Box width={4} flexShrink={0}>
				<Text>BBBB</Text>
			</Box>
			<Box width={4} flexShrink={0}>
				<Text>CCCC</Text>
			</Box>
		</Box>,
	);

	// Total child width is 12 (3 * 4), but parent is 8 with overflow=hidden
	// Should only show first 8 characters
	const line = output.split('\n').find(line => line.length > 0);
	t.true(
		(line?.length ?? 0) <= 8,
		`Expected width <= 8, got ${line?.length}. Output: "${line}"`,
	);
});

// ============================================================================
// Test Group 6: overflow hidden with border
// ============================================================================

test('overflow hidden with border - content area should be constrained', t => {
	const output = renderToString(
		<Box width={8} height={4} overflow="hidden" borderStyle="round">
			<Box width={20} height={10} flexShrink={0}>
				<Text>
					ABCDEFGHIJKLMNOPQRST{'\n'}
					12345678901234567890{'\n'}
					!@#$%^&*()!@#$%^&*(){'\n'}
					qwertyuiopasdfghjklz
				</Text>
			</Box>
		</Box>,
	);

	const lines = output.split('\n');

	// With border, the box should be 8 chars wide and 4 lines tall total
	// Content area is 6x2 (subtracting 2 for left/right border, 2 for top/bottom border)
	t.is(lines.length, 4, `Expected 4 lines total, got ${lines.length}`);

	for (const line of lines) {
		t.true(
			line.length <= 8,
			`Expected width <= 8, got ${line.length} for line "${line}"`,
		);
	}
});

// ============================================================================
// Test Group 7: overflowX vs overflowY
// ============================================================================

test('overflowX hidden - only horizontal clipping, vertical can grow', t => {
	const output = renderToString(
		<Box width={5} overflowX="hidden" flexDirection="column">
			<Box width={10} flexShrink={0}>
				<Text>ABCDEFGHIJ{'\n'}1234567890</Text>
			</Box>
		</Box>,
	);

	const lines = output.split('\n').filter(line => line.length > 0);

	// Width should be clipped to 5
	for (const line of lines) {
		t.true(
			line.length <= 5,
			`Expected width <= 5, got ${line.length} for line "${line}"`,
		);
	}

	// Height should NOT be clipped - both lines should be visible
	t.is(
		lines.length,
		2,
		`Expected 2 lines (no height clipping), got ${lines.length}`,
	);
});

test('overflowY hidden - only vertical clipping, horizontal can grow', t => {
	const output = renderToString(
		<Box height={1} overflowY="hidden">
			<Box flexShrink={0}>
				<Text>ABCDEFGHIJ{'\n'}1234567890</Text>
			</Box>
		</Box>,
	);

	const lines = output.split('\n').filter(line => line.length > 0);

	// Height should be clipped to 1
	t.is(
		lines.length,
		1,
		`Expected 1 line (height clipped), got ${lines.length}`,
	);

	// Width should NOT be clipped - full 10 characters should be visible
	t.is(
		lines[0]?.length,
		10,
		`Expected width of 10 (no clipping), got ${lines[0]?.length}`,
	);
});

// ============================================================================
// Test Group 8: Verify that overflow hidden is passed to Taffy layout engine
// ============================================================================

test('overflow hidden box maintains exact specified dimensions', t => {
	// This test specifically checks that the layout engine respects overflow: hidden
	// by not expanding the parent to fit child content
	const output = renderToString(
		<Box flexDirection="row">
			<Box width={5} height={3} overflow="hidden" borderStyle="single">
				<Box width={100} height={100} flexShrink={0}>
					<Text>This is very long text that should be clipped</Text>
				</Box>
			</Box>
			<Box width={5}>
				<Text>NEXT</Text>
			</Box>
		</Box>,
	);

	const lines = output.split('\n');

	// The first box should be exactly 5 chars wide
	// The second box "NEXT" should start at position 5
	// If overflow isn't working, the first box might expand and push "NEXT" further right

	// Find the line containing "NEXT"
	const lineWithNext = lines.find(line => line.includes('NEXT'));
	t.truthy(lineWithNext, 'Should find line containing NEXT');

	// NEXT should appear starting around position 5 (after the 5-wide overflow box)
	const nextPosition = lineWithNext?.indexOf('NEXT') ?? -1;
	t.true(
		nextPosition >= 5 && nextPosition <= 6,
		`NEXT should be at position 5-6, but found at ${nextPosition}. Output:\n${output}`,
	);
});

// ============================================================================
// Test Group 9: Edge cases
// ============================================================================

test('overflow hidden with zero-width child', t => {
	renderToString(
		<Box width={10} overflow="hidden">
			<Box width={0}>
				<Text />
			</Box>
		</Box>,
	);

	// Should render an empty output or just whitespace
	t.pass('Should not crash with zero-width child');
});

test('overflow hidden with negative margin child', t => {
	const output = renderToString(
		<Box width={10} overflow="hidden">
			<Box marginLeft={-5} width={20} flexShrink={0}>
				<Text>ABCDEFGHIJKLMNOPQRST</Text>
			</Box>
		</Box>,
	);

	// Content should be clipped at the box boundaries
	const line = output.split('\n').find(line => line.length > 0);
	t.true(
		(line?.length ?? 0) <= 10,
		`Expected width <= 10, got ${line?.length}`,
	);
});

test('overflow hidden should work with percentage dimensions', t => {
	const output = renderToString(
		<Box width={20} overflow="hidden">
			<Box width="50%" overflow="hidden">
				<Box width={30} flexShrink={0}>
					<Text>ABCDEFGHIJKLMNOPQRSTUVWXYZ1234</Text>
				</Box>
			</Box>
		</Box>,
	);

	// Inner box should be 50% of 20 = 10 chars, with overflow hidden
	const line = output.split('\n').find(line => line.length > 0);
	t.true(
		(line?.length ?? 0) <= 10,
		`Expected width <= 10 (50% of 20), got ${line?.length}. Output: "${line}"`,
	);
});

// ============================================================================
// Test Group 10: "min-width: auto" behavior (overflow: hidden allowing shrinking)
// ============================================================================

test('overflow hidden allows flex item to shrink below content size', t => {
	// In Flexbox, default min-width is 'auto', which means 'min-content'.
	// Setting overflow: hidden (or scroll/auto) changes default min-width to 0.
	// This means a flex item with overflow: hidden should be able to shrink to fit its container,
	// whereas one with overflow: visible should force expansion (or overflow).

	const output = renderToString(
		<Box width={10} borderStyle="round">
			<Box overflow="hidden" flexGrow={1}>
				<Box width={20} flexShrink={0}>
					<Text>Content</Text>
				</Box>
			</Box>
		</Box>,
	);

	// Outer box is 10 wide.
	// Inner Box wants to be 20.
	// With overflow="hidden", Inner Box should shrink to fit inside Outer Box (width ~8).

	const lines = output.split('\n');
	// Check the width of the top border line. It should be 10 characters wide.
	// ╭────────╮ (10 chars, 8 content)

	t.is(
		lines[0]?.length,
		10,
		`Top border should be 10 chars wide. Output:\n${output}`,
	);
});

test('overflow visible prevents flex item from shrinking below content size (control)', t => {
	// This is testing Ink/Taffy default behavior.
	const output = renderToString(
		<Box width={10} borderStyle="round">
			<Box overflow="visible" flexGrow={1}>
				<Box width={20} flexShrink={0}>
					<Text>Content</Text>
				</Box>
			</Box>
		</Box>,
	);

	const lines = output.split('\n');
	t.is(
		lines[0]?.length,
		10,
		'Parent with fixed width should remain fixed width',
	);
});

// ============================================================================
// Test Group 11: Child dimensions verification inside overflow="hidden"
// ============================================================================

test('child inside overflow hidden retains its full size if not flexible', t => {
	// Child has fixed width 20, flexShrink 0.
	// Parent has width 10, overflow hidden.
	// Child should remain 20 wide. Text length 20 should NOT wrap.
	// If Child was forced to 10, text would wrap.

	const output = renderToString(
		<Box width={10} overflow="hidden">
			<Box width={20} flexShrink={0}>
				<Text>12345678901234567890</Text>
			</Box>
		</Box>,
	);

	// Output should show first 10 chars.
	// We check that there is only 1 line. If child became width 10, text would wrap to 2 lines.

	const lines = output.split('\n').filter(l => l.length > 0);
	t.is(
		lines.length,
		1,
		'Text should not wrap, implying child width is preserved at 20',
	);
	t.is(lines[0], '1234567890', 'Should see clipped content of the first line');
});

test('child inside overflow hidden shrinks if flexible', t => {
	// Child has width 20, but flexShrink 1 (default is 1 in Ink/Yoga/Taffy generally, let's correspond to previous tests).
	// Actually Ink Box default flexShrink is 1.
	// Parent width 10, overflow hidden.
	// Child should shrink to 10. Text length 20 SHOULD wrap.

	const output = renderToString(
		<Box width={10} overflow="hidden">
			<Box width={20} flexShrink={1}>
				<Text>12345678901234567890</Text>
			</Box>
		</Box>,
	);

	const lines = output.split('\n').filter(l => l.length > 0);
	// Should wrap because child shrunk to 10.
	t.is(lines.length, 2, 'Text SHOULD wrap, implying child width shrunk to 10');
	t.is(lines[0], '1234567890', 'Line 1');
	t.is(lines[1], '1234567890', 'Line 2');
});
