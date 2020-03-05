const verify_layout_structures = (layouts, layout_type) => {
	// add required layouts if the layout is empty in the given layout structure

	// params
	// 	layouts: layouts as array of objects containing layouts
	//	parent_tye: string denoting what type of layout it is ( board | group | concept )
	//	if no layouts or too little are present (depends on parent_tye), create a few empty ones

	// make a new copy of layouts
	let new_layout = [ ...layouts ];

	// if the array is empty ... GOOD!
	if (layouts.length == 0 ) {
		switch (layout_type){
			case 'board_layout':
				new_layout.push( { name:'1', layout:[[]] } );
				new_layout.push( { name:'2', layout:[[]] } );
				new_layout.push( { name:'3', layout:[[]] } );
				break;

			case 'group_layout':
				new_layout.push( { name:'1', layout:[[]] } );
				break;

			case 'concept_layout':
				new_layout.push( { name:'1', layout:[[]] } );
				break;

			default:
				break;
		}
	}

	return new_layout;
};

const remove_id_from_layouts = (layouts, id) => {
	
}

module.exports = {
	verify_layout_structures,
	remove_id_from_layouts
};