import React, { Component } from 'react';

import ReactMarkdown, { types } from "react-markdown";
import _ from "lodash";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { parse_core_information, parse_md_sections, parse_first_line } from "./markdown_tools";
import MindmapViewer from '../concept/mindmap_viewer';
import { Grid, Row, Col } from 'react-bootstrap';

// import icons
import PlusIcon from '@material-ui/icons/AddCircleRounded';
import MinusIcon from '@material-ui/icons/RemoveCircleRounded';
import LinkIcon from '@material-ui/icons/LinkRounded';

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

	renderList = (items, component) => {
        return _.map(items, item => {
            return (
                <li
                    key={item}
                    className="list-unstyled"
                >   
                    {component}
                    {item}
                </li>
            )
        });
    }

	r_marketfigures = (title_rest_lines) => {
		
	}

	r_mindmap = (title, rest_lines) => {
		// returns a simple mindmap rendered from a tree-like structure
		let md = rest_lines.join("\n");

		return (
			<div style={{width:'300px'}}>
				<h2>{title}</h2>
				<MindmapViewer mindmapData={md}/>
			</div>
		);
	};

	r_procons = (title, rest_lines) => {
		// returns a simple list with pros and cons

		// first sort lines on positives vs negatives
		let pros = [];
		let cons = [];
		for (let i = 0; i<rest_lines.length; i++){
			const line = rest_lines[i];
			if (line[0] == '+') pros.push(line.slice(1));
			else if (line[0] == '-') cons.push(line.slice(1));
		}

		return (
			<Row>
				<Col xs={12} md={6}>
					<div style={{marginBottom:'10px', marginLeft:'5px', marginRight:'5px'}}>
						<h2>Pro's</h2>
						{this.renderList(pros, <PlusIcon color="primary" className="trade-off-icon"/>)}
					</div>
				</Col>
				<Col xs={12} md={6}>
					<div style={{marginBottom:'10px', marginLeft:'5px', marginRight:'5px'}}>
						<h2>Con's</h2>
						{this.renderList(cons, <MinusIcon color="secondary" className="trade-off-icon"/>)}
					</div>
				</Col>
			</Row>
		);
	};

	r_links = (title, rest_lines) => {

		if (rest_lines.length < 1){
			return (<div></div>)
		}

		let url_links = [];

		// go through each line, extract the lines out of it
		for (let i=0; i<rest_lines.length; i++) {
			const line = rest_lines[i];
			let url_title = line.match(/(?<=\[).+?(?=\])/);
			let url = line.match(/(?<=\().+?(?=\))/);

			// if the parsed title and url are non-zero, we can add them to an array containing everything
			if (url_title.length > 0 && url.length > 0) {
				url_links.push({'name':url_title[0], 'url':url[0]});
			}
		}

		// go through parsed url_links and create HTML equivalents (React-based)
		return (
			<div>
				<h2>{title}</h2>
				{
					_.map(url_links, url_link => {
						return (
							<li // list item
								key={url_link.url} 
								className="list-unstyled">
								<a // anchor
									href={url_link.url} 
									target="_blank"
									style={{color: 'black'}}
								>
									<LinkIcon style={{verticalAlign: 'middle'}}/>{url_link.name}
								</a>
							</li>
						);
					})
				}
			</div>
		);

	};

	r_summary = (title, rest_lines) => {
		// returns a simple title header, and unparsed plaintext inside a paragraph
		let md = rest_lines.join("\n");

		return (
			<div>
				<h2>{title}</h2>
				<p className="concept-short-copy-header">{md}</p>
			</div>
		);
	};

	r_concept_subsection = (lines, depth) => {
		let { _title, _tags, _rest_lines } = parse_first_line(lines, depth, false);

		switch (_tags) {
			case "mindmap":
				return this.r_mindmap(_title, _rest_lines);
			case "pro-cons":
				return this.r_procons(_title, _rest_lines);
			case "links":
				return this.r_links(_title, _rest_lines);
			case "summary":
				return this.r_summary(_title, _rest_lines);
			default:
				return this.r_summary(_title, _rest_lines);
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
				<CardContent className="concept-detail-content">
					<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 600: 2}}>
						<Masonry gutter="0 auto 0 auto">
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
						</Masonry>
					</ResponsiveMasonry>
				</CardContent>
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
