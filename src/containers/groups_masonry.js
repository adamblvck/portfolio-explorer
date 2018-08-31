import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// Actions
import { fetchConcepts } from '../actions';

import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

// Material Design Graphics
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

// Components and Containers
import ConceptsMasonry from './concepts_masonry';
import ConceptDetails from './concept_details';

const styles = {
    card: {
      maxWidth: 450,
      margin: 10
    },
    media: {
      height: 100,
    },
    content: {
        height: 350,
        width: 300
    }
};

class GroupsMasonry extends Component {
    componentDidMount(){
        this.props.fetchConcepts();
    }

    renderGroups() {
        const { classes } = this.props;

        return _.map(this.props.groups, group => {
            return (
                <Card 
                    className={classes.card} 
                    key={group.id}
                    elevation={3}>

                    <CardMedia
                        className={classes.media}
                        image="https://cdn.images.express.co.uk/img/dynamic/22/590x/cryptocurrency-predictions-2018-914087.jpg"
                        title="Contemplative Reptile"
                    />
                    <CardContent className={classes.content}>
                        <Typography gutterBottom variant="title" component="h1" align="center">
                        {group.name}
                        </Typography>
                        
                        <ConceptsMasonry
                            concepts={group.concepts}
                        />
                    </CardContent>
                </Card>    
            )
        });
    }

    renderMasonry() {
        return (
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry>
                    {this.renderGroups()}
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
    connect(mapStateToProps, { fetchConcepts })(GroupsMasonry)
);