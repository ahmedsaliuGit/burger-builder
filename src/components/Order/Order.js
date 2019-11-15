import React from 'react';

import classes from './Order.module.css';

const Order = (props) => {
    const ingredients = [];

    for (let ingreName in props.ingredients) {
        ingredients.push({name: ingreName, amount: props.ingredients[ingreName]});
    }

    const ingredientsData = ingredients.map(ig => (
        <span key={ig.name} className={classes.OrderIngredients}>{ig.name} ({ig.amount})</span>
    ))

    return (
        <div className={classes.Order}>
            <p>Ingreduents: {ingredientsData}</p>
            <p>Price <strong>{props.price.toFixed(2)}</strong></p>
        </div>
    );
};

export default Order;