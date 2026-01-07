import {type Layout} from 'taffy-js';

const getMaxWidth = (layout: Layout) => {
	return (
		layout.width -
		layout.paddingLeft -
		layout.paddingRight -
		layout.borderLeft -
		layout.borderRight
	);
};

export default getMaxWidth;
