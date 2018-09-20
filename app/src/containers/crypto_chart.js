import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { deleteConcept, fetchCryptoPrices } from '../actions';

import { Sparklines, SparklinesCurve, SparklinesSpots, SparklinesReferenceLine } from 'react-sparklines';

class CryptoChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchCryptoPrices(this.props.symbol);
    }

    average(data) {
        return _.round(_.sum(data)/data.length, 2);
    }

    getLastPrice(data) {
        return _.round(data[data.length - 1], 2);
    }

    get24PriceChange(data) {
        const a0 = data[data.length - 1];
        const a1 = data[data.length - 31];

        const change = _.round((a0 - a1) / a0 * 100, 2);

        if (change > 0)
            return ( <span style={{color: 'green'}}>&#x25B2;{change}%</span> );
        else
            return ( <span style={{color: 'red'}}>&#x25BC;{change}%</span> );
    }

    render() {
        console.log('crypto_prices', this.props.crypto_prices);
        if (!this.props.crypto_prices)
            return (<div></div>);

        console.log(this.props.crypto_prices.data);
        const data = _.map(this.props.crypto_prices.data, 'close');
        console.log(data);

        return (
            <div>
                <h2>${this.getLastPrice(data)} {this.get24PriceChange(data)}</h2>
                <Sparklines data={data} limit={60} width={400} height={100} margin={5} >
                    <SparklinesCurve color="#FFA447" style={{ strokeWidth: 5, fill: "none" }}></SparklinesCurve>
                    <SparklinesReferenceLine type="avg"/>
                    <SparklinesSpots/>
                </Sparklines>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        crypto_prices: state.crypto_prices
    };
}

export default connect( mapStateToProps, {fetchCryptoPrices})(CryptoChart);