import React, { Component } from "react";
import { connect } from "react-redux";

import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import * as actionCreator from "../../store/actions/index";

// const INGREDIENT_PRICES = {
//     salad: 0.5,
//     cheese: 0.4,
//     meat: 1.3,
//     bacon: 0.7
// }

export class BurgerBuilder extends Component {
  state = {
    purchasing: false
  };
  // state = {
  //     totalPrice: 4,
  //     purchasable: false,
  //     purchasing: false,
  //     loading: false,
  //     error: null,
  // }

  componentDidMount() {
    // axios.get('https://react-my-burger-36846.firebaseio.com/ingredients.json').then( response => {
    //     this.setState({ingredients: response.data});
    // }).catch( error => {
    //     this.setState({error: error});
    // });
    this.props.onInitIngredients();
  }

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.onSetAuthRedirectPath("/checkout");
      this.props.history.push("/auth");
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  updatePurchasable = ingredients => {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

    return sum > 0;
  };

  // purchaseContinueHandler = () => {
  //     this.setState({loading: true});

  //     const queryParams = [];

  //     for (let i in this.state.ingredients) {
  //         queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
  //     }

  //     queryParams.push('price=' + this.state.totalPrice.toFixed(2));

  //     const queryString = queryParams.join('&');

  //     this.props.history.push({
  //         pathname: '/checkout',
  //         search: '?' + queryString,
  //     });
  // }

  purchaseContinueHandler = () => {
    // this.setState({loading: true});
    this.props.onPurchaseInit();

    this.props.history.push("/checkout");
  };

  // addIngredientHandler = (type) => {
  //     const ingredientAddition = this.state.ingredients[type];
  //     const updatedCount = ingredientAddition + 1;
  //     const updatedIngredients = {
  //         ...this.state.ingredients
  //     }
  //     updatedIngredients[type] = updatedCount;
  //     const priceAddition = INGREDIENT_PRICES[type];
  //     const oldPrice = this.state.totalPrice;
  //     const newPrice = oldPrice + priceAddition;

  //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
  //     this.updatePurchasable(updatedIngredients)
  // }

  // removeIngredientHandler = (type) => {
  //     const oldCount = this.state.ingredients[type];

  //     if ( oldCount <= 0 ) return;

  //     const updatedCount = oldCount - 1;
  //     const updatedIngredients = {
  //         ...this.state.ingredients
  //     }
  //     updatedIngredients[type] = updatedCount;
  //     const priceDeduction = INGREDIENT_PRICES[type];
  //     const oldPrice = this.state.totalPrice;
  //     const newPrice = oldPrice - priceDeduction;

  //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
  //     this.updatePurchasable(updatedIngredients)
  // }

  render() {
    const disableInfo = {
      ...this.props.ings
    };

    for (let key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0;
    }

    let summaryOrder = null;

    let burger = this.props.error ? (
      <p>Burger ingredients cannot be loaded.</p>
    ) : (
      <Spinner />
    );

    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            addedIngredient={this.props.onAddIngredient}
            ingredientRemover={this.props.onRemoveIngredient}
            disableBtn={disableInfo}
            purchasable={this.updatePurchasable(this.props.ings)}
            ordered={this.purchaseHandler}
            isAuth={this.props.isAuthenticated}
            price={this.props.price}
          />
        </Aux>
      );

      summaryOrder = (
        <OrderSummary
          ingredients={this.props.ings}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.props.price}
        />
      );
    }

    // if (this.state.loading) {
    //     summaryOrder = <Spinner />;
    // }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {summaryOrder}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => ({
  ings: state.burgerBuilder.ingredients,
  price: state.burgerBuilder.totalPrice,
  error: state.burgerBuilder.error,
  isAuthenticated: state.auth.userId !== null
});

const mapDispatchToProps = dispatch => ({
  onAddIngredient: ingName => dispatch(actionCreator.addIngredient(ingName)),
  onRemoveIngredient: ingName =>
    dispatch(actionCreator.removeIngredient(ingName)),
  onInitIngredients: () => dispatch(actionCreator.initIngredient()),
  onPurchaseInit: () => dispatch(actionCreator.purchaseInit()),
  onSetAuthRedirectPath: path =>
    dispatch(actionCreator.setAuthRedirectPath(path))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
