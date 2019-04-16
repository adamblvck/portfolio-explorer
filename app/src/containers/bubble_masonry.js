import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// Actions performed in Bubble Masonry
import { fetchConcepts, deleteGroup, fetchBubbleGroups } from '../actions';

// Masonry
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

// Material Design Graphics
import PropTypes from 'prop-types';
import { Card, CardContent, withStyles, CardHeader, MenuItem } from '@material-ui/core';

// Components and Containers
import ConceptsMasonry from './concepts_masonry';

// Forms
import FormEditConcept from './forms/form_concept';

import FormEditGroup from './forms/form_editgroup';

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

        return (
            <FormEditGroup key={label}
                n_depth={1}
                parent_groupId={parent_groupId}

                label={label}
                mode="new"

                // initialValues={{name: "New Subgroup", n_depth: 1, parent_groupId: parent_groupId}}
                // initialValues={{name: "FUCK YOURSELF ADD"}}
            />
        );
    }

    renderFormEditGroup(component) {
        const { label, group } = component;
        
        return (
            <FormEditGroup key={label}
                label={label}
                mode="update"

                initialValues={group}
            />
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
                            this.props.isAuthenticated && <MenuGroup 
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
                        this.props.isAuthenticated  && <MenuGroup 
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

    renderMasonry() {
        return (
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry gutter="0 auto 0 auto">
                    {this.renderGroups()}
                    <FormEditGroup 
                        n_depth={0}
                        parent_groupId={null}
                        label="New Group"
                        mode="new"
                        initialValues={{name:"New Group", n_depth: 0, parent_groupId: null}}
                    />
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
    connect(mapStateToProps, { fetchConcepts, fetchBubbleGroups, deleteGroup })(BubbleMasonry)
);