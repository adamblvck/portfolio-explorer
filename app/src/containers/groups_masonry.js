import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// Actions
import { fetchConcepts, fetchCoreGroups, deleteGroup } from '../actions';

import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

// Material Design Graphics
import PropTypes from 'prop-types';
import { Card, CardContent, CardMedia, CardActions, Button, withStyles, Typography, CardHeader, MenuItem } from '@material-ui/core';

// Components and Containers
import ConceptsMasonry from './concepts_masonry';
import ConceptDetails from './concept_details';

// Forms
import FormAddConcept from './forms/form_addconcept';
import FormAddGroup from './forms/form_addgroup';
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

class GroupsMasonry extends Component {
    constructor(props) {
        super(props);

        this.renderDeleteGroup = this.renderDeleteGroup.bind(this);
    }

    componentDidMount() {
        this.props.fetchCoreGroups();
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
            <FormAddConcept
                groupId={groupId}
                groupName={groupName}
                key={label}
                // addButtonText={label}
            />
        );
    }

    renderFormAddGroup(component) {
        const { label, parent_groupId } = component;

        return (
            <FormAddGroup 
                n_depth={1}
                key={label}
                parent_groupId={parent_groupId}
                addButtonText={label}
            />
        );
    }

    renderFormEditGroup(component) {
        const { label, parent_groupId, group } = component;

        return (
            <FormEditGroup 
                n_depth={1}
                key={label}
                parent_groupId={parent_groupId}
                addButtonText={label}
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
        const { classes } = this.props;

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
                                        label:"Add Concept",
                                        groupId:group.id,
                                        groupName:group.name,
                                        needAuth: true,
                                        render:this.renderFormAddConcept
                                    },
                                    {
                                        label:"Edit Subgroup",
                                        groupId:group.id,
                                        // groupName:group.name,
                                        needAuth: true,
                                        render:this.renderFormEditGroup,
                                        group:group
                                    },
                                    {
                                        label:"Delete Subgroup",
                                        groupId:group.id,
                                        needAuth: true,
                                        render:this.renderDeleteGroup,
                                        group:group
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
                        concepts={group.concepts}
                        background={background}
                        isAuthenticated={this.props.isAuthenticated}
                    />
                </div>
            );
        });
    }

    renderGroups() {
        const { classes } = this.props;

        return _.map(this.props.groups, group => {
            return (
                <Card 
                    className={classes.card} 
                    key={group.id}
                    elevation={3}>


                    <CardHeader
                        action={
                            this.props.isAuthenticated  && <MenuGroup 
                                className="groupmenu-btn"
                                isAuthenticated={this.props.isAuthenticated}
                                components={ [
                                    {
                                        label:"Add Subgroup",
                                        parent_groupId:group.id,
                                        needAuth: true,
                                        render:this.renderFormAddGroup
                                    },
                                    {
                                        label:"Edit Group",
                                        parent_groupId:group.id,
                                        needAuth: true,
                                        render:this.renderFormEditGroup,
                                        group:group
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
                    
                    {/* <CardActions>
                        <FormAddGroup 
                            n_depth={1}
                            parent_groupId={group.id}
                            addButtonText="Add Subgroup"
                        />
                    </CardActions> */}
                    
                </Card>
            );
        });
    }

    renderMasonry() {
        return (
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry>
                    {this.renderGroups()}
                    <FormAddGroup 
                        n_depth={0}
                        parent_groupId={null}
                        addButtonText="Add Group"
                    />
                </Masonry>
            </ResponsiveMasonry>
        );
    }

    render() {
        return (
            <div>
                {/* Holds the overview of all concepts, with concept-basic at it's most granular level */}
                { this.renderMasonry() }
                
                {/* Holds concept details form */}
                <ConceptDetails 
                    id="concept-detail-popper"
                    isAuthenticated={this.props.isAuthenticated}
                />
            </div>
        );

    }
}

function mapStateToProps (state) {
    return { 
        groups: state.groups,
        // activeConcept: state.activeConcept
    };
}

// export default connect(mapStateToProps, { fetchConcepts })(GroupsMasonry);
GroupsMasonry.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(
    connect(mapStateToProps, { fetchConcepts, fetchCoreGroups, deleteGroup })(GroupsMasonry)
);