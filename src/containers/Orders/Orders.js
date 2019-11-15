import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/order';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
    
    componentDidMount () {
        // axios.get('/orders.json').then( res => {
        //     let fetchData = [];

        //     for (let key in res.data) {
        //         fetchData.push({...res.data[key], id: key});
        //     }

        //     this.setState({loading: false, orders: fetchData});
        // }).catch(error => {
        //     this.setState({loading: false});
        // });
        const { onFetchOrders, token, userId } = this.props;
        onFetchOrders(token, userId);
    }

    render () {
        let orders = <Spinner />;

        if (!this.props.loading) {
            orders = (
                this.props.orders.map( order => (
                    <Order key={order.id} ingredients={order.ingredients} price={+order.price} />
                ))
            );
        }
        return (
            <div>
                { orders }
    
            </div>
        )
    }
}

const mapStateToProps = state => ({
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
});

const mapDispatchToProps = dispatch => ({
    onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));