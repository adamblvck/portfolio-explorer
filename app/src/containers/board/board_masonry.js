import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// Actions performed in Board Masonry
import { deleteGroup, updateGroupLayout, updateConceptLayout, updateConceptLayout_changegroup } from '../../actions/group';
import { fetchBoardGroups } from '../../actions/fetching_public';
import { openGroupForm, openConceptForm } from '../../actions/form';
import { fetchBoard, updateBoardLayout} from '../../actions/board';

// Masonry
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

// Material Design Graphics
import PropTypes from 'prop-types';
import { Card, CardContent, withStyles, CardHeader, MenuItem, Menu, Button } from '@material-ui/core';

// Components and Containers
import ConceptMasonry from './concept_masonry';
import MenuGroup from '../../components/menus/menu_groups';

import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag } from './utils';

import { chunk } from 'lodash';

import { Grid, Row, Col } from 'react-bootstrap';

const styles = {
        card: {
        maxWidth: 400,
        minWidth: 250,
        margin: 7.5
    },
    media: {
      height: 100,
    },
    content: {
        height: "auto",
        width: "auto"
    }
};

class BoardMasonry extends Component {
    constructor(props) {
        super(props)

        this.renderDeleteGroup = this.renderDeleteGroup.bind(this);
        this.renderFormEditGroup = this.renderFormEditGroup.bind(this);
        this.renderFormAddSubgroup = this.renderFormAddSubgroup.bind(this);
        this.renderFormAddConcept = this.renderFormAddConcept.bind(this);

        this.create_and_update_column_layout = this.create_and_update_column_layout.bind(this);
        this.update_layout_from_state = this.update_layout_from_state.bind(this);

        this.dnd_onDrop = this.dnd_onDrop.bind(this);
        this.dnd_onDropSubgroup = this.dnd_onDropSubgroup.bind(this);

        this.state = {
            columns: 3,
            new_layout: []
        };

        this.concept_dnd = {};
    }

    componentDidMount = () => {
        this.props.fetchBoard(this.props.boardID);
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log('nextProps', nextProps);

    //     const current_layout = nextProps.group_layouts[this.state.columns.toString()]['layout'];
    //     console.log('current_layout',current_layout);
    //     this.setState({new_layout: current_layout});
    // }

    create_and_update_column_layout = () => {
        // add object sizing
        Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };
        
        const groups = this.props.groups;
        const chunkSize = Math.ceil(Object.size(groups) / this.state.columns);
        const arrayFromObject = Object.entries(groups).map(([key, value]) => ( key ));
        const chunked_groups = chunk(arrayFromObject, chunkSize);

        // console.log("chunked_groups", chunked_groups);

        const layout = {
            name: this.state.columns.toString(),
            layout: chunked_groups
        }

        this.props.updateBoardLayout({
            id: this.props.board_id,
            group_layouts: [layout]
        });
    }

    update_layout_from_state = () => {
        const layout = {
            name: this.state.columns.toString(),
            layout: this.state.new_layout
        }

        this.props.updateBoardLayout({
            id: this.props.board_id,
            group_layouts: [layout]
        });
    }

    /* 
        Render form components
    */

    renderFormAddConcept(component) {
        const { label, group } = component;

        const params = {
            mode: "new",
            initialValues: {groupIds: [group.id]}
        };

        return (
            <MenuItem
                color="secondary" 
                key={`addConceptTo-${group.id}`}
                onClick={() => this.props.openConceptForm(params)}
            >
                {label}
            </MenuItem>
        );
    }

    renderFormAddSubgroup(component) {
        // BEAR IN MIND CURRENTLY USED initialValues IS FOR **SUBGROUPS** ONLY
        const { label, parent_groupId } = component;

        const group_form_params = {
            mode: "new",
            initialValues: {name: "New Subgroup", n_depth: 1, parent_groupId: parent_groupId}
        };

        return (
            <MenuItem
                color="secondary" 
                key={`addto-${parent_groupId}`}
                onClick={() => this.props.openGroupForm(group_form_params)}
            >
                {label}
            </MenuItem>
        );
    }

    renderFormEditGroup(component) {
        const { label, group } = component;

        const group_form_params = {
            mode: "update",
            initialValues: group
        };

        return (
            <MenuItem
                color="secondary" 
                key={`edit-${group.id}`}
                onClick={() => this.props.openGroupForm(group_form_params)}
            >
                {label}
            </MenuItem>
        );
    }

    renderDeleteGroup(component) {
        const { group, label } = component;

        return (
            <MenuItem
                color="secondary" 
                key={`delete${group.id}`}
                onClick={() => {
                    if( confirm('Sure want to delete group?')) {
                        this.props.deleteGroup(group)
                    }
                }}>
                {label}
            </MenuItem>
        );
    }

    /* 
        Render cascading groups of information!
    */

    renderSubgroups(group) {
        const { classes, concepts } = this.props;

        const subgroups = group.groups;

        // get out the only array inside the layout called "1"...
        const subgroup_layout = group.group_layouts && group.group_layouts['1'] ? group.group_layouts['1'].layout[0] : [];

        // Don't render group if the no subgroups are available
        if (_.isEmpty(group.groups)){
            return (
                <div></div>
            );
        }

        // extract root color
        const { rootColor, background } = group;

        // for every subgroup present, render a `CardHeader` and a `ConceptMasonry`
        return _.map(subgroup_layout, (subgroup_id) => {
            const subgroup = subgroups[subgroup_id];

            // console.log("subgroup", subgroup);

            return (
                <Draggable key={`subgroup_render_${subgroup.id}`}>
                    <CardHeader
                        action={
                            this.props.isAuthenticated && // if authenticated
                            <MenuGroup 
                                className="groupmenu-btn"
                                isAuthenticated={this.props.isAuthenticated}
                                components={ [
                                    {
                                        label: "Add Concept",
                                        needAuth: true,
                                        group: subgroup,
                                        render: this.renderFormAddConcept
                                    },
                                    {
                                        label: "Edit Subgroup",
                                        needAuth: true,
                                        group: subgroup,
                                        render: this.renderFormEditGroup
                                    },
                                    {
                                        label: "Delete Subgroup",
                                        needAuth: true,
                                        group: subgroup,
                                        render: this.renderDeleteGroup
                                    }
                                ]}
                            />
                        }
                        subheader={subgroup.name}
                        // title={group.name}
                        component="h3"
                        className="subgroup-header"
                        style={{
                            '--parent-color': rootColor
                        }}
                    />
                    <ConceptMasonry
                        groupId={subgroup.id} // used in D&D
                        parent_groupId={subgroup.parent_groupId} // used in D&D
                        dnd_onDropConcept={this.dnd_onDropConcept}
                        dnd_getConcept={this.dnd_getConcept}
                        concept_layouts={subgroup.concept_layouts}
                        conceptIDs={subgroup.concepts}
                        concepts={concepts}
                        background={background}
                        isAuthenticated={this.props.isAuthenticated}
                    />
                </Draggable>
            );
        });
    }

    renderGroup(group){
        const { classes } = this.props;

        const groupId = group.id;

        return (
            <Card className={`${classes.card} board_group_card`} elevation={3}>
                <CardHeader
                    action={
                        this.props.isAuthenticated && // if authenticated
                        <MenuGroup 
                            className="groupmenu-btn"
                            isAuthenticated={this.props.isAuthenticated}
                            components={ [
                                {
                                    label: "Edit Group",
                                    needAuth: true,
                                    group: group,
                                    render: this.renderFormEditGroup
                                },
                                {
                                    label: "New Subgroup",
                                    parent_groupId: group.id,
                                    needAuth: true,
                                    render: this.renderFormAddSubgroup
                                },
                                {
                                    label: "Delete Group",
                                    needAuth: true,
                                    group: group,
                                    render: this.renderDeleteGroup
                                }
                            ]}
                        />
                    }
                    title={group.name}
                    subheader={group.description}
                    style={{backgroundColor: group.color, background: group.background}}
                    className='RootGroupHeader'
                />

                {/* Create container with draggable subgroups */}
                <CardContent className={classes.content}>
                    <Container // drag and drop container
                        groupName={`board-subgroups${groupId}`} // to group places where it's possible to drag and drop
                        // style={{ paddingBottom: '200px' }}
                        dragClass="form-ghost" // dragged class
                        dropClass="form-ghost-drop" // drop region class
                        onDrop={dnd_results => this.dnd_onDropSubgroup(groupId, dnd_results)} // perform this on drop
                        getChildPayload={index => this.dnd_getSubgroup(groupId, index)} // get column index, and index of dragged item
                        nonDragAreaSelector=".field"
                        key={`draggable_subgroup_container_${groupId}`} // small key to make this one shine
                    >
                        {/* {this.generateForm(this.state.form)} */}
                        {this.renderSubgroups({...group, rootColor: group.color, background: group.background})}
                    </Container>
                </CardContent>
            </Card>
        );
    }

    renderGroups(groups, column) {
        return _.map(column, group_id => {
            const g = groups[group_id]; // get corresponding group

            if (g === undefined)
                return ( <div>MISSING GROUP_ID IN GROUPS: {group_id}</div> );

            return (
                <Draggable key={`draggable_g_${g.id}`}>
                    {this.renderGroup(g)}
                </Draggable>
            );
        });
    }

    renderMasonry() {
        return (
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 600: 2, 900: 3}}
            >
                <Masonry gutter="0 auto 0 auto">

                    {/* Render Groups */}
                    {this.renderGroups()}

                    {/* Add Group Button */}
                    <MenuItem
                        onClick={() => {
                            const params = {
                                mode: "new",
                                initialValues: {
                                    board_id: this.props.board_name,
                                    _boardId: this.props.board_id,
                                    background:"linear-gradient(45deg, #4532E6, #1cb5e0)",
                                    n_depth:0,
                                    parent_groupId:null}
                            };

                            this.props.openGroupForm(params)
                        }}>
                        Add Group
                    </MenuItem>

                </Masonry>
            </ResponsiveMasonry>
        );
    }

    dnd_onDropConcept = (parent_groupId, groupId, dnd_results) => {

        // same group layout change
        if (dnd_results.removedIndex !== null && dnd_results.addedIndex !== null) {
            console.log(parent_groupId, groupId, dnd_results);

            const this_layout = this.props.groups[parent_groupId].groups[groupId].concept_layouts['1']['layout'][0];
            const new_layout = applyDrag(this_layout, dnd_results);
            const layout = {
                name: '1',
                layout: [new_layout]
            }

            this.props.updateConceptLayout({
                id: groupId,
                concept_layouts: [layout]
            });

            this.concept_dnd = {};
        }

        // Removed from this list (parent_groupId, groupId)
        else if (dnd_results.removedIndex !== null && dnd_results.addedIndex == null) {

            console.log("Removed from", parent_groupId, groupId, dnd_results);

            const this_layout = this.props.groups[parent_groupId].groups[groupId].concept_layouts['1']['layout'][0];
            const new_layout = applyDrag(this_layout, dnd_results);
            const layout = {
                name: '1',
                layout: [new_layout]
            }

            this.concept_dnd['from_id'] = groupId;
            this.concept_dnd['from_layout'] = [layout];
            this.concept_dnd['concept_id'] = dnd_results.payload;
        }

        // Added to this list (parent_groupId, groupId)
        else if (dnd_results.removedIndex == null && dnd_results.addedIndex !== null) {
            console.log("Added to", parent_groupId, groupId, dnd_results);

            const this_layout = this.props.groups[parent_groupId].groups[groupId].concept_layouts['1']['layout'][0];
            const new_layout = applyDrag(this_layout, dnd_results);
            const layout = {
                name: '1',
                layout: [new_layout]
            }

            this.concept_dnd['to_id'] = groupId;
            this.concept_dnd['to_layout'] = [layout];
            this.concept_dnd['concept_id'] = dnd_results.payload;
        }

        // IMPORTANT PART
        // when we have both the TO and FROM layout, we send it to the server
        if (this.concept_dnd['from_id'] !== undefined && this.concept_dnd['to_id'] !== undefined) {

            console.log(this.concept_dnd);

            this.props.updateConceptLayout_changegroup({
                to_id: this.concept_dnd['to_id'],
                to_concept_layouts: this.concept_dnd['to_layout'],
                from_id: this.concept_dnd['from_id'],
                from_concept_layouts: this.concept_dnd['from_layout'],
                concept_id: this.concept_dnd['concept_id'],
            });

            // reset the DND stuff
            this.concept_dnd = {};
        }

    }

    dnd_getConcept = (parent_groupId, groupId, item_ix) => {
        // parent_groupId is group which contains concept_layout
        // console.log(parent_groupId, groupId, item_ix);
        // console.log(this.props.groups[parent_groupId].groups[groupId].concept_layouts);
        const active_layout = this.props.groups[parent_groupId].groups[groupId].concept_layouts['1'];
        return active_layout['layout'][0][item_ix];
    }

    dnd_onDropSubgroup = (parent_groupId, dnd_results) => {
        // console.log("parent_groupId",parent_groupId);

        const active_col = this.props.groups[parent_groupId].group_layouts['1']['layout'][0];
        const new_col = applyDrag(active_col, dnd_results);

        // console.log(active_col, new_col);

        const layout = {
            name: '1',
            layout: [new_col]
        }

        // here we want to send the new_col layout to the server
        this.props.updateGroupLayout({
            id: parent_groupId,
            group_layouts: [layout]
        });
    }

    dnd_getSubgroup = (parent_groupId, item_ix) => {
        // here we assume the server created the `1` layout, AND we're working with a 2D array (hence we take index=0)
        const active_layout = this.props.groups[parent_groupId].group_layouts['1'];

        // console.log("parent_groupId",parent_groupId);

        return active_layout['layout'][0][item_ix];
    }

    dnd_onDrop = (col_i, dnd_results) => {
        // this function gets called by every "list of draggable items" there are under the same name
        // this means that your own accounting needs to be done to check weather to upgrade or not ...

        const active_col = this.props.group_layouts[this.state.columns]['layout'][col_i];
        const new_col = applyDrag(active_col, dnd_results);

        // console.log(active_col, new_col);

        // if first column in iteration
        if (col_i == 0){
            this.setState({new_layout: [new_col] });

        // if somewhere between first / last column
        } else {
            const new_layout = this.state.new_layout.concat([new_col]);
            this.setState({new_layout: new_layout });
        }

        // if last column in iteration
        if (col_i == (this.state.columns-1) ) {
            this.update_layout_from_state();
        }
    }

    dnd_getConceptCard = (column_ix, item_ix) => {
        // column_ix = the column index of the dragged component
        // item_ix = index of item in column
        const active_layout = this.props.group_layouts[this.state.columns];
        return active_layout['layout'][column_ix][item_ix];
    }

    renderGrid() {
        const { groups, group_layouts } = this.props;

        // console.log("props", this.props);
        // console.log(groups, group_layouts);

        // check if we have a layout available, if not create one (send to server)
        if (group_layouts !== undefined) {
            // if (group_layouts[this.state.columns.toString()] == null) {
            //     console.log("no column layout defined!");
            //     this.create_and_update_column_layout();

            //     return ( <div className="placeholder-css"/> ); // or placeholder
            // }
        } else {
            return ( 
                // return an "add button" if none of the above is true.
                <div>
                    <Button onClick={() => {
                            const params = {
                                mode: "new",
                                initialValues: {
                                    board_id: this.props.boardID,
                                    _boardId: this.props.board_id,
                                    background:"linear-gradient(45deg, #4532E6, #1cb5e0)",
                                    n_depth:0,
                                    parent_groupId:null}
                            };

                            this.props.openGroupForm(params)
                        }}>
                            Add Group
                        </Button>
                </div>
            );
        }

        const fetched_layout_groups = group_layouts[this.state.columns.toString()].layout;
        // console.log('fetched_layout_groups', fetched_layout_groups);

        return _.map(fetched_layout_groups, (column, col_i) => {
            const col_index_is_zero = col_i == 0;
            // console.log('col_i', col_i);
            return (
                <Col xs={4} md={4} key={`col_${col_i}`}>

                    {/* If authenticated - show draggable grid */}
                    {this.props.isAuthenticated && <Container // drag and drop container
                        groupName="board-columns" // to group places where it's possible to drag and drop
                        // style={{ paddingBottom: '200px' }}
                        dragClass="form-ghost" // dragged class
                        dropClass="form-ghost-drop" // drop region class
                        onDrop={dnd_results => this.dnd_onDrop(col_i, dnd_results)} // perform this on drop
                        getChildPayload={index => this.dnd_getConceptCard(col_i, index)} // get column index, and index of dragged item
                        nonDragAreaSelector=".field"
                        key={`draggable_in_${col_i}`} // small key to make this one shine
                    >
                        {/* {this.generateForm(this.state.form)} */}
                        {this.renderGroups(groups, column)}
                    </Container>}

                    {/* If not authenticated - not-draggable grid */}
                    { !this.props.isAuthenticated && <div key={`draggable_in_${col_i}`}>
                        {/* {this.generateForm(this.state.form)} */}
                        {this.renderGroups(groups, column)}
                    </div>}

                    {/* Add a simple button click0r */}
                    { col_index_is_zero && <Button onClick={() => {
                            const params = {
                                mode: "new",
                                initialValues: {
                                    board_id: this.props.boardID,
                                    _boardId: this.props.board_id,
                                    background:"linear-gradient(45deg, #4532E6, #1cb5e0)",
                                    n_depth:0,
                                    parent_groupId:null}
                            };

                            this.props.openGroupForm(params)
                        }}>
                            Add Group
                        </Button>
                    }

                </Col>
            );
        });
    }

    render() {
        const { classes, concepts } = this.props;
        // console.log("concepts in subgroups", concepts);

        return (
            <div>
                {/* Holds the overview of all concepts, with concept-basic at it's most granular level */}
                <Grid>
                    { this.renderGrid() }
                    <Button onClick={() => {
                            const params = {
                                mode: "new",
                                initialValues: {
                                    board_id: this.props.board_name,
                                    _boardId: this.props.board_id,
                                    background:"linear-gradient(45deg, #4532E6, #1cb5e0)",
                                    n_depth:0,
                                    parent_groupId:null}
                            };

                            this.props.openGroupForm(params)
                        }}>
                            Add Group
                        </Button>
                </Grid>
            </div>
        );
    }
}

function mapStateToProps (state) {

    if (state.boards !== null && !_.isEmpty(state.boards) && !_.isEmpty(state.boards.groups)){ // only if groups exist, and result is NOT EMPTY

        return {
            board_id: state.boards.id,
            board_name: state.boards.board_id,
            group_layouts: state.boards.group_layouts,
            groups: state.boards.groups.groups,
            concepts: state.boards.groups.concepts,
            modified: state.boards.groups.modified // increases with 1 if groups/concepts are modified
        };
    }

    return {};
}

// export default connect(mapStateToProps, { fetchConcepts })(GroupsMasonry);
BoardMasonry.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(
    connect(mapStateToProps, {
        // actions
        fetchBoard,
        updateBoardLayout,

        fetchBoardGroups,

        updateGroupLayout,
        updateConceptLayout,
        updateConceptLayout_changegroup,

        deleteGroup, 
        openGroupForm, 
        openConceptForm
    })(BoardMasonry)
);