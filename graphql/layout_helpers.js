const Group = require('../models/group');
const Concept = require('../models/concept');
const Board = require('../models/board');
const User = require('../models/user');
var _ = require('lodash');

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

const handle = (err, reject) => {
	console.log(err);
	reject(err);
}

const create_n_column_layout = (holons, cols) => {
	// Params:
	// `holons` mapped as such: {id:{object}, id:{object}, ....}

	const chunk_size = Math.ceil(Object.keys(holons).length / cols);
	const array_of_holon_ids = Object.entries(holons).map(([key, value]) => ( key ));
	const chunked_holons = _.chunk(array_of_holon_ids, chunk_size);

	return chunked_holons
}

const verify_holon_layout_structures = (parent_holon, layouts, layout_type) => {
	// add required layouts if the layout is empty in the given layout structure

	// params
	// holon: always contain an ID
	// 	layouts: layouts as array of objects containing layouts
	//	parent_tye: string denoting what type of layout it is ( board | group | concept )
	//	if no layouts or too little are present (depends on parent_tye), create a few empty ones

	return new Promise((resolve, reject) => {

		if (layouts.length != 0 ) resolve(layouts);

		switch (layout_type){
			case 'board_layout':
				Group.find({_boardId: parent_holon.id})
				.then(groups => {
					const _groups = _.mapKeys(groups, "_id");

					console.log(create_n_column_layout(_groups, 1));
					console.log(create_n_column_layout(_groups, 2));
					console.log(create_n_column_layout(_groups, 3));

					let new_layout = [ ...layouts ];
					new_layout.push( { name:'1', layout: create_n_column_layout(_groups, 1) } );
					new_layout.push( { name:'2', layout: create_n_column_layout(_groups, 2) } );
					new_layout.push( { name:'3', layout: create_n_column_layout(_groups, 3) } );

					resolve(new_layout);
				})
				.catch(error => {
					handle(error);
				});
				break;

			case 'group_layout':
				Group.find({parent_groupId: parent_holon.id})
				.then(groups => {
					const _groups = _.mapKeys(groups, "_id");

					console.log(create_n_column_layout(_groups, 1));

					let new_layout = [ ...layouts ];
					new_layout.push( { name:'1', layout: create_n_column_layout(_groups, 1) } );

					resolve(new_layout);
				})
				.catch(error => {
					handle(error);
				});
				break;

			case 'concept_layout':
				Concept.find({groupIds: parent_holon.id})
				.then(groups => {
					const _groups = _.mapKeys(groups, "_id");

					console.log(create_n_column_layout(_groups, 1));

					let new_layout = [ ...layouts ];
					new_layout.push( { name:'1', layout: create_n_column_layout(_groups, 1) } );

					resolve(new_layout);
				})
				.catch(error => {
					handle(error);
				});
				break;

			default:
				break;
		}

	});

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

const add_id_to_layouts = (layouts, id) => {

	for(let j = 0; j<layouts.length;j++){
		let l = layouts[j];

		// !!!! Add to first list in thr presummed 2D list
		if (l.layout.length >= 1) {
			l.layout[0] = l.layout[0].concat([id]); // here we concat, pushing gives weird behavior
		}

		layouts[j] = l; // assign a new one
	}

	return layouts;
}

const remove_id_from_layouts = (layouts, id) => {
	
}

module.exports = {
	verify_layout_structures,
	verify_holon_layout_structures,
	remove_id_from_layouts,
	add_id_to_layouts
};