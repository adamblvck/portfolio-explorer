import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// Actions
import { fetchConcepts, fetchCoreGroups } from '../actions';

import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

// Material Design Graphics
import PropTypes from 'prop-types';
import { Card, CardContent, CardMedia, CardActions, Button, withStyles, Typography, CardHeader } from '@material-ui/core';

// Components and Containers
import ConceptsMasonry from './concepts_masonry';
import ConceptDetails from './concept_details';

// Forms
import FormAddConcept from './forms/form_addconcept';
import FormAddGroup from './forms/form_addgroup';

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
        width: 300
    }
};

class GroupsMasonry extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchCoreGroups();
    }

    renderSubgroups(group) {
        const { classes } = this.props;

        // Don't render group if the no subgroups are available
        if (_.isEmpty(group.groups)){
            return (
                <div></div>
            );
        }

        return _.map(group.groups, group => {
            return (

                <div
                    key={group.id}
                >
                    <CardHeader
                        // action={
                        //     <MenuGroup 
                        //         className="groupmenu-btn"                             
                        //     />
                        // }
                        // title={group.name}
                        subheader={group.name}
                        component="h3"
                        className="subgroup-header"
                    />
                    {/* <Typography gutterBottom variant="subheading" component="h3" align="center">
                        {group.name}
                    </Typography> */}
                    <ConceptsMasonry
                        concepts={group.concepts}
                    />
                    <FormAddConcept
                            groupId={group.id}
                            groupName={group.name}
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

                    {/* <CardMedia
                        className={classes.media}
                        image="https://cdn.images.express.co.uk/img/dynamic/22/590x/cryptocurrency-predictions-2018-914087.jpg"
                        title="Contemplative Reptile"
                    /> */}

                    <CardHeader
                        action={
                            <MenuGroup 
                                className="groupmenu-btn" 
                                menuItems={ [
                                    {label:"Add Subgroup",func:"test"},
                                    {label:"Edit Group",func:"test"}
                                ]}
                            />
                        }
                        title={group.name}
                        subheader={group.description}
                    />

                    <CardContent className={classes.content}>
                        {this.renderSubgroups(group)}
                    </CardContent>
                    
                    <CardActions>
                        <FormAddGroup 
                            n_depth={1}
                            parent_groupId={group.id}
                            addButtonText="Add Subgroup"
                        />
                    </CardActions>
                    
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
        // check if activeConcepts are ready to be viewed
        const show_details = !this.props.activeConcept ? false : true;

        // assign open/ anchorEl/concept if activeConcept exists.. otherwise apply default values
        const { activeConcept } = this.props;
        const open = show_details ? activeConcept.open : false;
        const anchorEl = show_details ? activeConcept.anchorEl : null;
        const concept = show_details ? activeConcept.concept : null;

        return (
            <div>
                { this.renderMasonry() }
                
                <ConceptDetails 
                    id="concept-detail-popper"

                    // information for component 
                    open={open} 
                    anchorEl={anchorEl} 
                    concept={concept}/>
            </div>
        );

    }
}

function mapStateToProps (state) {
    return { 
        groups: state.groups,
        activeConcept: state.activeConcept
    };
}

// export default connect(mapStateToProps, { fetchConcepts })(GroupsMasonry);
GroupsMasonry.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(
    connect(mapStateToProps, { fetchConcepts, fetchCoreGroups })(GroupsMasonry)
);