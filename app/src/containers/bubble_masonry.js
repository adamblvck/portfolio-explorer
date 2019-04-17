import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// Actions performed in Bubble Masonry
import { fetchConcepts, deleteGroup, fetchBubbleGroups } from '../actions';
import { openGroupForm } from '../actions/form'

// Masonry
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

// Material Design Graphics
import PropTypes from 'prop-types';
import { Card, CardContent, withStyles, CardHeader, MenuItem } from '@material-ui/core';

// Components and Containers
import ConceptsMasonry from './concepts_masonry';

// Forms
import FormEditConcept from './forms/form_concept';

import FormEditGroup from './forms/form_group';

import MenuGroup from './menus/menu_groups';

const styles = {
        card: {
        maxWidth: 450,
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

class BubbleMasonry extends Component {
    constructor(props) {
        super(props);

        this.renderDeleteGroup = this.renderDeleteGroup.bind(this);

        this.handleSpecialMenuItem = this.handleSpecialMenuItem.bind(this);
        this.renderFormEditGroup = this.renderFormEditGroup.bind(this);
        this.renderFormAddGroup = this.renderFormAddGroup.bind(this);
    }

    componentDidMount() {
        this.props.fetchBubbleGroups(this.props.bubbleID);
    }

    /* 
        Render form components
    */

    handleDeleteGroup(group) {
        this.props.deleteGroup(group);
    }

    renderFormAddConcept(component) {
        const { label, groupName, groupId } = component;
        return (
            <FormEditConcept
                groupId={groupId}
                groupName={groupName}
                key={label}
                label={label}
                mode="new"
                initialValues={{groupIds: [groupId]}}
            />
        );
    }

    renderFormAddGroup(component) {
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
                key="deleteGroup"
                onClick={() => this.handleDeleteGroup(group)}>
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

        return _.map(group.groups, (group) => {
            return (
                <div
                    key={group.id}
                >
                    <CardHeader
                        action={
                            this.props.isAuthenticated && // if authenticated
                            <MenuGroup 
                                className="groupmenu-btn"
                                isAuthenticated={this.props.isAuthenticated}
                                components={ [
                                    {
                                        label: "Add Concept",
                                        groupId: group.id,
                                        groupName: group.name,
                                        needAuth: true,
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
                                        groupId: group.id,
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
                    <ConceptsMasonry
                        conceptIDs={group.concepts}
                        concepts={concepts}
                        background={background}
                        isAuthenticated={this.props.isAuthenticated}
                    />
                </div>
            );
        });
    }

    renderCard(group){
        const { classes } = this.props;



        return (
            <Card className={classes.card} elevation={3}>
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
                                    render: this.renderFormAddGroup
                                }
                                
                            ]}
                        />
                    }
                    title={group.name}
                    subheader={group.description}
                    style={{backgroundColor: group.color, background: group.background}}
                    className='RootGroupHeader'
                />

                <CardContent className={classes.content}>
                    {this.renderSubgroups({...group, rootColor: group.color, background: group.background})}
                </CardContent>
            </Card>
        );
    }

    renderGroups() {
        return _.map(this.props.groups, group => {
            return (
                <div key={group.id}>
                    {this.renderCard(group)}
                </div>
            );
        });
    }

    handleSpecialMenuItem() {

        const init_values = {
            name: "New Subgroup",
            n_depth: 1,
            parent_groupId: "blaaaaayadadadada"
        };

        const wow = {
            mode: "new",
            initialValues: init_values
        };

        this.props.openGroupForm(wow);
    };

    renderMasonry() {
        return (
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry gutter="0 auto 0 auto">
                    <MenuItem onClick={this.handleSpecialMenuItem} >
                        CLICK ME FOR SPECIALNESS
                    </MenuItem>
                    
                    {this.renderGroups()}
                </Masonry>
            </ResponsiveMasonry>
        );
    }

    render() {
        const { classes, concepts } = this.props;
        // console.log("concepts in subgroups", concepts);

        return (
            <div>
                {/* Holds the overview of all concepts, with concept-basic at it's most granular level */}
                { this.renderMasonry() }
            </div>
        );

    }
}

function mapStateToProps (state) {
    return {
        groups: state.groups.groups,
        concepts: state.groups.concepts,
        modified: state.groups.modified // increases with 1 if groups/concepts are modified
    };
}

// export default connect(mapStateToProps, { fetchConcepts })(GroupsMasonry);
BubbleMasonry.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(
    connect(mapStateToProps, { fetchConcepts, fetchBubbleGroups, deleteGroup, openGroupForm })(BubbleMasonry)
);