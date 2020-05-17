import React, { Component } from 'react';
// import { Query } from "react-apollo";
// import gql from "graphql-tag";

import ReactMarkdown, { types } from "react-markdown";
import _ from "lodash";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

// import { makeStyles } from "@material-ui/styles";
// import "./MDSectionComponent.css";

import { parse_core_information, parse_md_sections } from "./markdown_tools";

// import NoteBlock from "./NoteBlock";

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

// const useStyles = makeStyles({
//   card: {
//     maxWidth: 400,
//     minWidth: 250,
//     margin: 7.5
//   },
//   media: {
//     height: 100
//   },
//   content: {
//     height: "auto",
//     width: "auto"
//   }
// });

class OldMDSectionComponent extends Component {
  
	constructor(props) {
		super(props);

		this.state = {
			edit_mode: this.props.edit_mode
		};

		console.log("got init", this.state.edit_mode);
	}

	componentWillReceiveProps = nextProps => {
		if (this.props.edit_mode !== nextProps.edit_mode) {
		this.setState({
			edit_mode: nextProps.edit_mode
		});
		}
	};

	toggle_edit = () => {
		this.setState({ edit_mode: !this.state.edit_mode });
		console.log("togled, new value:", this.state.edit_mode);
	};

	render_masonry_with_cards = (
		lines,
		section_from_i_to_j,
		line_i_at_section,
		depth
	) => {
		return (
		<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 600: 2, 900: 3 }}>
			<Masonry gutter="0 auto 0 auto">
			{/* iterate through sections */}
			{_.map(section_from_i_to_j, from_to => {
				const { from, to } = from_to;

				// are we parsing a section at this depth level?
				if (line_i_at_section.includes(from)) {
				const rest_lines = lines.slice(from, to);
				let md = rest_lines.join("\n");

				// render markdown

				// return this.render_section()

				return (
					<div key={from + "" + to}>
					<SectionComponent
						section_md={md}
						depth={depth}
						render_type={"masonry_card"}
						edit_mode={this.state.edit_mode}
					/>
					</div>
				);
				}

				// if not, we're parsing content that belongs to the section above
				// could be (descriptions, blogposts without sections, hashtahs, ...)
				else {
				const rest_lines = lines.slice(from, to);
				let md = rest_lines.join("\n");
				return (
					<div key={from + "" + to}>
					<SectionComponent
						section_md={md}
						depth={depth}
						render_type={"masonry_card"}
						edit_mode={this.state.edit_mode}
					/>
					</div>
				);

				//   const subsection = lines.slice(from, to);
				//   const md = subsection.join("\n");

				//   return <ReactMarkdown source={md} key={from + "" + to} />;
				}
			})}
			</Masonry>
		</ResponsiveMasonry>
		);
	};

	render_blogstyle = (lines, section_from_i_to_j, line_i_at_section, depth) => {
		return (
		<div className="blog_container">
			<div className="blog_side_item" />
			<div className="blog_center">
			{_.map(section_from_i_to_j, from_to => {
				const { from, to } = from_to;
				const md = lines.slice(from, to).join("\n");
				return (
				<SectionComponent
					section_md={md}
					depth={depth}
					render_type={"markdown_block"}
					key={from + "" + to}
					edit_mode={this.state.edit_mode}
				/>
				);
			})}
			</div>
			<div className="blog_side_item" />
		</div>
		);
	};

	parse_rest_lines = (tag, lines, depth) => {
		// get line indexes with sections at depth: (1:#, 2:##, 3:###) - line_i_at_section
		// get from_to
		const { line_i_at_section, section_from_i_to_j } = parse_md_sections(
		tag,
		lines,
		depth
		);

		switch (tag) {
		case "masonry":
			return this.render_masonry_with_cards(
			lines,
			section_from_i_to_j,
			line_i_at_section,
			depth
			);

		case "blog":
			return this.render_blogstyle(
			lines,
			section_from_i_to_j,
			line_i_at_section,
			depth
			);

		case "card":
			return this.render_blogstyle(
			lines,
			section_from_i_to_j,
			line_i_at_section,
			depth
			);

		default:
			// return blog-style
			return this.render_blogstyle(
			lines,
			section_from_i_to_j,
			line_i_at_section,
			depth + 1
			);
		}
	};

	// Renders a "full page overview", masonry style
	render_overview_masonry = (lines, depth) => {
		const { _title, _tags, _rest_lines, _hashtags } = parse_core_information(
		lines,
		depth,
		true
		);

		console.log(_tags);

		return (
		// <Card className="noteditor-paper" style={{ padding: "0px" }}>
		<div>
			<header className="Notepage-header">
			{/* <img
									src={process.env.PUBLIC_URL + "/img/grandstack.png"}
									className="App-logo"
									alt="logo"
								/> */}
			<h1 className="Notepage-title"> {_title} </h1>
			{!this.state.edit_mode && (
				<Button onClick={this.toggle_edit} style={{ float: "right" }}>
				EDIT
				</Button>
			)}
			{this.state.edit_mode && (
				<Button onClick={this.toggle_edit} style={{ float: "right" }}>
				COMMIT
				</Button>
			)}
			</header>

			{this.parse_rest_lines(_tags, _rest_lines, depth + 1)}
		</div>
		);
	};

	render_card = (lines, depth) => {
		const { _title, _tags, _rest_lines, _hashtags } = parse_core_information(
		lines,
		depth,
		true
		);

		// 2. parse rest of sections

		// 3. return appropriate section, or go deeper

		return (
		<Card
			className="noteditor-paper section-card-render"
			style={{ padding: "0px" }}
		>
			{/* title can become either a header of a card, or something else special */}
			<CardHeader
			title={_title}
			subheader={_hashtags}
			style={{
				color: "white",
				backgroundImage: "linear-gradient(45deg, #d53369 0%, #daae51 100%)"
			}}
			/>

			{/* Here's the rest of the markdown text, that we're gonna parse */}
			<CardContent>
			{this.parse_rest_lines(_tags, _rest_lines, depth + 1)}
			</CardContent>
		</Card>
		);
	};

	render_masonry_card = (lines, depth) => {
		let { _title, _tags, _rest_lines, _hashtags } = parse_core_information(
		lines,
		depth,
		true
		);

		let title_debug = `${_title} (${depth}, ${_tags}, ${_hashtags})`;

		console.log(_title, depth);

		// 2. parse rest of sections

		// 3. return appropriate section, or go deeper

		if (_title !== "notitle_noheader") {
		return (
			<Card
			className="noteditor-paper section-card-render"
			style={{ padding: "0px" }}
			>
			{/* title can become either a header of a card, or something else special */}
			<CardHeader
				title={_title}
				subheader={_hashtags}
				style={{
				color: "white",
				backgroundImage:
					"linear-gradient(45deg, #d53369 0%, #daae51 100%)"
				}}
			/>

			{/* Here's the rest of the markdown text, that we're gonna parse */}
			<CardContent>
				{this.parse_rest_lines(_tags, _rest_lines, depth + 1)}
			</CardContent>
			</Card>
		);
		} else {
		return <div>{this.parse_rest_lines(_tags, _rest_lines, depth + 1)}</div>;
		}
	};

	render_blog_overview = (lines, depth) => {
		let { _title, _tags, _rest_lines, _hashtags } = parse_core_information(
		lines,
		depth,
		true
		);

		const md = lines.join("\n");

		console.log("edit_mode", this.state.edit_mode);

		return (
		<div>
			{!this.state.edit_mode && <ReactMarkdown source={md} />}
			{this.state.edit_mode && <NoteBlock source={md} />}
		</div>
		);
	};

	render_concepts = (lines, depth) => {
		console.log(lines);
		return (
			<div>
				{/* {depth} */}
				{lines}
				{/* test */}
			</div>
		);
	};

	md_render = (section_markdown, depth, render_type) => {
		const lines = section_markdown.split(/\r?\n/);

		switch (render_type) {
			case "concept_details":
				return this.render_concepts(lines, depth);

			// Below these, the information is not used
			// case "overview":
			// 	return this.render_overview_masonry(lines, depth);

			// case "masonry_card":
			// 	return this.render_masonry_card(lines, depth);

			// case "card":
			// 	return this.render_card(lines, depth);

			// case "markdown_block":
			// 	return this.render_blog_overview(lines, depth);

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
			<div> {this.md_render( markdown , 0 , "concept_details" )} </div>
		);
    };
};
