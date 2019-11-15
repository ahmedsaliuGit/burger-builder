import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/';

const asyncChechout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout');
});

const asyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders');
});

const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth');
});

class App extends Component {
  // state = {
  //   show: true,
  // }

  // componentDidMount () {
  //   setTimeout( () => {
  //     console.log('Is going to remove it now');
  //     this.setState({show: false});
  //   }, 5000);
  // }

  componentDidMount() {
    this.props.onAuthCheckState();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={asyncAuth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );

    if(this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/checkout" component={asyncChechout} />
          <Route path="/orders" component={asyncOrders} />
          <Route path="/auth" component={asyncAuth} />
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to="/" />
        </Switch>
      );
    }
    return (
      <div>
        <Layout>
         {/* { this.state.show ? <BurgerBuilder /> : null } */}
         {/* <Switch>
           <Route path="/checkout" component={Checkout} />
           <Route path="/orders" component={Orders} />
           <Route path="/auth" component={Auth} />
           <Route path="/logout" component={Logout} />
           <Route path="/" exact component={BurgerBuilder} />
         </Switch> */}
         { routes }
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.token !== null,
})

const mapDispatchToProps = dispatch => ({
  onAuthCheckState: () => dispatch(actions.authCheckState()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
