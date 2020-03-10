export const parse_first_line = (lines, depth) => {
	// get title title, first line in this section
	let title = lines[0];
  
	// if the title doesn't begin with a hashtag, we claim fauly markdown
	if ( !title.startsWith("#".repeat(depth) + " ") ) {
		return {
			_title: "notitle_noheader",
			_tags: "notags",
			_hashtags: "#nohashtag",
			_key: "nokey",
			_rest_lines: lines
		};
	}
  
	// get [tag] from title or header
	let _tags = title.match(/(?<=\[).+?(?=\])/);
	if (_tags) _tags = _tags[0];
  
	// remove [tag] in title -> replace with ""
	title = title.replace(/\[(.*?)\]/, "");
  
	// extract keys in title, then replace it in the result
	var replace = "#".repeat(depth)+"[ ]*";
	var re = new RegExp(replace, "g");
	title = title.replace(re, "");

	// capture rest lines
	let _rest_lines = lines.slice(1);
  
	// cut out all whitelines that come before the lines with content
	const n = _rest_lines.length;
	let i = 0; // slice at this index
	for (; i < n; i++) {
		if (_rest_lines[i].length > 0) {
			break;
		}
	}
	_rest_lines = _rest_lines.slice(i);

	return {
		_title: title,
		_tags,
		_rest_lines: _rest_lines
	};
};

export const parse_core_information = (lines, depth, has_key) => {
	// get title title, first line in this section
	let title = lines[0];
  
	// if the title doesn't begin with a hashtag, we claim fauly markdown
	if ( !title.startsWith("#".repeat(depth) + " ") ) {
		// console.log("notitle", title, "lines", lines);
		return {
			_title: "notitle_noheader",
			_tags: "notags",
			_hashtags: "#nohashtag",
			_key: "nokey",
			_rest_lines: lines
		};
	}
  
	let key = "";
  
	// get [tag] from title or header
	let _tags = title.match(/(?<=\[).+?(?=\])/);
	if (_tags) _tags = _tags[0];
  
	// remove [tag] in title -> replace with ""
	title = title.replace(/\[(.*?)\]/, "");
  
	// extract keys in title, then replace it in the result
	if (has_key) { // was (depth == 1), no idea why
		var replace = "#".repeat(depth)+" ([a-zA-Z0-9_]*) ";
		var re = new RegExp(replace, "g");
	
		// const key_rgx = title.match(/# ([a-zA-Z0-9_]*) /);
	
		// console.log("test_title", title.replace(re, ""));
	
		const key_rgx = title.match(/# ([a-zA-Z0-9_]*) /);
		if (key_rgx) {
			key = key_rgx[1];
			title = title.replace(/# ([a-zA-Z0-9_]*) /, "");
		}
	}
	// else extract the hashtag and space
	else {
		var replace = "#".repeat(depth)+"  ([ ]*)";
		var re = new RegExp(replace, "g");
	  	title = title.replace(re, "");
	}
  
	// console.log(title);

	// capture rest lines
	const _rest_lines = lines.slice(1);
  
	// console.log("_rest_lines", _rest_lines);

	// get_hashtag_row (assuming there is only one in this section)
	let _hashtags = "";
	// let _hashtag_line = 0;
	// for (let i = 0; i < _rest_lines.length; i++) {
	// 	const line = _rest_lines[i];
	
	// 	// on first line match
	// 	if (line.match(/^#([A-Za-z0-9 _#])*/)) {
	// 		_hashtags = line;
	// 		_hashtag_line = i;
	// 		break;
	// 	} else if (line.match(/## ([A-Za-z0-9 _#])*/)) {
	// 		break;
	// 	}
	// }
  
	// // define rest lines below the hashtag lines
	// const absolute_rest_lines = _rest_lines.slice(_hashtag_line + 1);
  
	return {
		_title: title,
		_tags,
		_hashtags,
		_key: key,
		_rest_lines: _rest_lines
	};
};
  
export const parse_md_sections = (tag, lines, depth) => {
	// splits lines into sections with a certain depth (#, ##, ###, ...)
	// return position of sections (line i, j, k), and the interval (line i to i', j yo j', k to k', ...)
	const N = lines.length;

	// parse where subsection components are located
	// previously called 'subsection_idx'
	let parsed_subsections = [];
	lines.map((line, i) => {
		// if line starts with depth(1=#, 2=##, 3=###, ...)
		if (line.startsWith("#".repeat(depth) + " ")) {
		// console.log(line)
		parsed_subsections.push(i); // push index where it starts with depth x #
		}
	});

	// create <from line> - <to_line>, indicating a 'from'-line with a section
	// from-to sections
	let from_tos = [];

	// check if we have any subheaders
	if (parsed_subsections.length == 0) {
		from_tos.push({ from: 0, to: N - 1 });
	}

	// we got subheaders
	else {
		// return a "from:to" array
		let prev = 0;

		const n = parsed_subsections.length;
		for (let i = 0; i < n; i++) {
			const ss_idx = parsed_subsections[i];

			// if ## is at 0 position, just skip this position
			if (i == 0 && ss_idx == 0) continue;

			// assign from:to in dictionary
			from_tos.push({ from: prev, to: ss_idx });
			prev = ss_idx;

			// if at the last ## component, check if the value is end of lines, if not, add one more till end of linse
			if (i == n - 1) {
				// console.log(i, ss_idx, N, n-1);
				if (ss_idx < N - 1) from_tos.push({ from: ss_idx, to: N - 1 });
			}
		}
	}

	return {
		line_i_at_section: parsed_subsections,
		section_from_i_to_j: from_tos
	};
};
  