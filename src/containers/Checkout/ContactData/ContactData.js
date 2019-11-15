import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';


class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
            },
            postalCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Postal Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLenght: 5,
                    maxLenght: 5
                },
                valid: false,
                touched: false,
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true,
            }
        },
        formIsValid: false,
    }

    orderHandler = (event) => {
        event.preventDefault();
        // this.setState({loading: true});
        const { onBurgerOrder, token, ings, price,  } = this.props;

        const formData = {};

        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        
        const order = {
            ingredients: ings,
            price: price,
            orderData: formData,
            userId: this.props.userId
        }

        onBurgerOrder(order, token);
    }

    inputChangeHandler = (event, inputIdentifier) => {
        // const updatedOrderForm = {...this.state.orderForm};

        const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
            touched: true,
        });// {...updatedOrderForm[inputIdentifier]}

        const updatedOrderForm = updateObject(this.state.orderForm, {
            [inputIdentifier]: updatedFormElement
        });

        // updatedFormElement.value = event.target.value;

        // updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        // updatedFormElement.touched = true;

        // updatedOrderForm[inputIdentifier] = updatedFormElement;

        let isFormValid = true;

        for (let formIdentifier in updatedOrderForm) {
            isFormValid = updatedOrderForm[formIdentifier].valid && isFormValid;
        }

        this.setState({orderForm: updatedOrderForm, formIsValid: isFormValid});
    }

    render() {
        const formElementsArray = [];

        for (let key in this.state.orderForm) {
            formElementsArray.push(
                {id: key, config: this.state.orderForm[key]}
            );
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                { formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangeHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>Order</Button>
            </form>
        );

        if (this.props.loading) form = <Spinner />

        return (
            <div className={classes.ContactData}>
                { form }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
});

const mapDispatchToPorps = dispatch => ({
    onBurgerOrder: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token)),
});

export default connect(mapStateToProps, mapDispatchToPorps)(withErrorHandler(ContactData, axios));