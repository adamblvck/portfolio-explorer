import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// Actions performed in Bubble Masonry
import { deleteGroup } from '../../actions/group';
import { fetchBubbleGroups } from '../../actions/fetching_public';
import { openGroupForm, openConceptForm } from '../../actions/form';

// Masonry
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

// Material Design Graphics
import PropTypes from 'prop-types';
import { Card, CardContent, withStyles, CardHeader, MenuItem, Menu } from '@material-ui/core';

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

        // // add object sizing
        // Object.size = function(obj) {
        //     var size = 0, key;
        //     for (key in obj) {
        //         if (obj.hasOwnProperty(key)) size++;
        //     }
        //     return size;
        // };
    }

    componentDidMount() {
        this.props.fetchBubbleGroups(this.props.boardID);
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
        
        // Don't render group if the no subgroups are available
        if (_.isEmpty(group.groups)){
            return (
                <div></div>
            );
        }

        // extract root color
        const { rootColor, background } = group;

        // for every subgroup present, render a `CardHeader` and a `ConceptMasonry`
        return _.map(group.groups, (group) => {
            return (
                <Draggable key={group.id}>
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
                                        group: group,
                                        render: this.renderFormAddConcept
                                    },
                                    {
                                        label: "Edit Subgroup",
                                        needAuth: true,
                                        group: group,
                                        render: this.renderFormEditGroup
                                    },
                                    {
                                        label: "Delete Subgroup",
                                        needAuth: true,
                                        group: group,
                                        render: this.renderDeleteGroup
                                    }
                                ]}
                            />
                        }
                        subheader={group.name}
                        // title={group.name}
                        component="h3"
                        className="subgroup-header"
                        style={{
                            '--parent-color': rootColor
                        }}
                    />
                    <ConceptMasonry
                        conceptIDs={group.concepts}
                        concepts={concepts}
                        background={background}
                        isAuthenticated={this.props.isAuthenticated}
                    />
                </Draggable>
            );
        });
    }

    renderCard(group){
        const { classes } = this.props;
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
                        groupName={`board-subgroups`} // to group places where it's possible to drag and drop
                        // style={{ paddingBottom: '200px' }}
                        dragClass="form-ghost" // dragged class
                        dropClass="form-ghost-drop" // drop region class
                        // onDrop={dnd_results => this.dnd_onDrop(col_i, dnd_results)} // perform this on drop
                        // getChildPayload={index => this.dnd_getConceptCard(col_i, index)} // get column index, and index of dragged item
                        nonDragAreaSelector=".field"
                        key={`draggable_subgroup_container_${group.id}`} // small key to make this one shine
                    >
                        {/* {this.generateForm(this.state.form)} */}
                        {this.renderSubgroups({...group, rootColor: group.color, background: group.background})}
                    </Container>
                </CardContent>
            </Card>
        );
    }

    renderGroups(groups) {
        return _.map(groups, group => {

            const g = group[Object.keys(group)[0]]

            console.log(g);

            return (
                <Draggable key={g.id}>
                    {this.renderCard(g)}
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
                                    bubble_id: this.props.boardID,
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

    dnd_onDrop = (col_i, dnd_results) => {
        console.log(dnd_results);

        console.log(applyDrag(this.props.groups[col_i], dnd_results)); // this return the new array for col_i
    }

    dnd_getConceptCard = (column_ix, item_ix) => {
        // column_ix = the column index of the dragged component
        // item_ix = index of item in column
        return this.props.groups[column_ix][item_ix];
    }

    renderDraggableGrid() {

        const { groups } = this.props;

        if (groups == null){
            return ( <div className="placeholder-css"/> ); // or placeholder
        }

        return _.map(groups, (column, col_i) => {
            return (
                <Col xs={4} md={4} key={`col_${col_i}`}>
                    <Container // drag and drop container
                        groupName="board-columns" // to group places where it's possible to drag and drop
                        style={{ paddingBottom: '200px' }}
                        dragClass="form-ghost" // dragged class
                        dropClass="form-ghost-drop" // drop region class
                        onDrop={dnd_results => this.dnd_onDrop(col_i, dnd_results)} // perform this on drop
                        getChildPayload={index => this.dnd_getConceptCard(col_i, index)} // get column index, and index of dragged item
                        nonDragAreaSelector=".field"
                        key={`draggable_in_${col_i}`} // small key to make this one shine
                    >
                        {/* {this.generateForm(this.state.form)} */}
                        {this.renderGroups(column)}
                    </Container>
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
                    { this.renderDraggableGrid() }
                </Grid>
            </div>
        );

    }
}

function mapStateToProps (state) {
    // add object sizing
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    // groups to chunks
    let chunked_groups = [];
    if (state.groups !== null && !_.isEmpty(state.groups)){ // only if groups exist, and result is NOT EMPTY

        const col_count = 3;
        const groups = state.groups.groups;
        const chunkSize = Object.size(groups) / col_count;
        const arrayFromObject = Object.entries(groups).map(([key, value]) => ({ [key]: value }));
        chunked_groups = chunk(arrayFromObject, chunkSize);
    }

    return {
        groups: chunked_groups,
        concepts: state.groups.concepts,
        modified: state.groups.modified // increases with 1 if groups/concepts are modified
    };
}

// export default connect(mapStateToProps, { fetchConcepts })(GroupsMasonry);
BoardMasonry.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(
    connect(mapStateToProps, {
        // actions
        fetchBubbleGroups, 
        deleteGroup, 
        openGroupForm, 
        openConceptForm
    })(BoardMasonry)
);