import React, { Component } from 'react';

import ReactMarkdown, { types } from "react-markdown";
import _ from "lodash";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { parse_core_information, parse_md_sections, parse_first_line } from "./markdown_tools";

import {
  Card,
  CardHeader,
  CardContent,
  Paper,
  CardActions,
  Modal,
  withStyles,
  MenuItem,
  Typography,
  TextField,
  Button
} from "@material-ui/core";

export default class MDSectionComponent extends Component {
  
	constructor(props) {
		super(props);
	}

	r_mindmap = () => {
		return (
			<div></div>
		);
	};

	r_procons = () => {
		return (
			<div></div>
		);
	};

	r_links = () => {
		return (
			<div></div>
		);
	};

	r_summary = () => {
		return (
			<div></div>
		);
	};

	r_concept_subsection = (lines, depth) => {
		let { _title, _tags, _rest_lines } = parse_first_line(lines, depth, false);

		switch (_tags) {
			case "mindmap":
				return r_mindmap(_title, _rest_lines);
			case "pro-cons":
				return r_procons(_title, _rest_lines);
			case "links":
				return r_links(_title, _rest_lines);
			case "summary":
				return r_summary(_title, _rest_lines);
			default:
				return r_summary(_title, _rest_lines);
		};
	};

	r_concept_sections = (lines, depth) => {
		// This function does the following:
		//   - Parses "core information" > title, tag, hashtags, ...
		//   - Parses subsections (## ...) > and render appropriate elements per subsection

		let { _title, _tags, _rest_lines } = parse_core_information(lines, depth, false);

		// parse subsectionss
		const { line_i_at_section, section_from_i_to_j } = parse_md_sections( _tags, _rest_lines, depth + 1 );

		return (
			<div>
				{/* iterate through sections */}
				{_.map(section_from_i_to_j, from_to => {
					const { from, to } = from_to;

					// are we parsing a section at this depth level?
					if (line_i_at_section.includes(from)) {
						const subsection_lines = _rest_lines.slice(from, to);
						return (
							<div key={from + "" + to}>
								{this.r_concept_subsection(subsection_lines, depth + 1)}
							</div>
						);
					}
				})}
			</div>
		);
	};

	md_render = (section_markdown, depth, render_type) => {
		const lines = section_markdown.split(/\r?\n/);

		switch (render_type) {
			case "concept_sections":
				return this.r_concept_sections(lines, depth);

			default:
				return this.render_card(lines, depth);
		}
	};

    render() {
		const { markdown } = this.props;

		// stop rendering if we have no markdown to be explorer here
		if (markdown === null)
			return <div/>

		// render based on markdown
        return (
			<div> {this.md_render( markdown , 1 , "concept_sections" )} </div>
		);
    };
};
