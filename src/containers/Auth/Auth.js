import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/auth';
import Spinner from '../../components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utility';

class Auth extends Component {
    state ={
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true,
                },
                valid: false,
                touched: false,
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Your Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6,
                },
                valid: false,
                touched: false,
            },
        },
        isSignup: true,
    }

    componentDidMount() {
        const { buildingBurger, authRedirectPath, onSetAuthenticatedPath } = this.props;
        if(!buildingBurger && authRedirectPath !== '/') onSetAuthenticatedPath();
    }

    inputChangeHandler = (event, controlName) => {
        // const updatedControls = {
        // ...this.state.controls,
        //     [controlName]: {
        //         ...this.state.controls[controlName],
        //         value: event.target.value,
        //         valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
        //         touched: true,
        //     }
        // }
        const updatedControls = updateObject(this.state.controls, {
            [controlName]: updateObject(this.state.controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true,
            })
        });

        this.setState({controls: updatedControls});
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignup: !prevState.isSignup}
        });
    }

    render () {
        const formElementsArray = [];

        for (let key in this.state.controls) {
            formElementsArray.push(
                {id: key, config: this.state.controls[key]}
            );
        }

        let form = formElementsArray.map(formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => this.inputChangeHandler(event, formElement.id)} />
        ));

        if (this.props.loading) {
            form = <Spinner />;
        }

        let errorMessage = null;

        if (this.props.error) {
            errorMessage = <p>{this.props.error.message}</p>;
        }

        let authRedirect = null;
        if(this.props.isAuthenticted) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        return (
            <div className={classes.Auth}>
                { authRedirect }
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    { form }
                    <Button btnType="Success">Submit</Button>
                </form>
                <Button btnType="Danger" clicked={this.switchAuthModeHandler}>
                    Switch to {this.state.isSignup ? 'Sign In' : 'Sign Up'}
                </Button>
            </div>
        );
    }
}

const mapStateToprops = state => ({
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticted: state.auth.userId !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath,
});

const mapDispatchToProps = dispatch => ({
    onAuth: (email, pass, isSignup) => dispatch(actions.auth(email, pass, isSignup)),
    onSetAuthenticatedPath: () => dispatch(actions.setAuthRedirectPath('/')),
});

export default connect(mapStateToprops, mapDispatchToProps)(Auth);