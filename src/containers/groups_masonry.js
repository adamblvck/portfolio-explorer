import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchConcepts } from '../actions';

import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const styles = {
    card: {
      maxWidth: 450,
      margin: 10
    },
    media: {
      height: 100,
    },
    content: {
        height: 450,
        width: 450
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
                <Card className={classes.card} key={group.id}>
                    <CardMedia
                        className={classes.media}
                        image="https://cdn.images.express.co.uk/img/dynamic/22/590x/cryptocurrency-predictions-2018-914087.jpg"
                        title="Contemplative Reptile"
                    />
                    <CardContent className={classes.content}>
                        <Typography gutterBottom variant="headline" component="h2">
                        {group.name}
                        </Typography>
                        <Typography component="p">
                            Short description of the group
                        </Typography>
                    </CardContent>
                </Card>    
            )
        });
    }

    render() {

        return (
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry>
                    {this.renderGroups()}
                </Masonry>
            </ResponsiveMasonry>
        )
    }
}

function mapStateToProps (state) {
    return { groups: state.groups };
}

// export default connect(mapStateToProps, { fetchConcepts })(GroupsMasonry);

GroupsMasonry.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(
    connect(mapStateToProps, { fetchConcepts })(GroupsMasonry)
);