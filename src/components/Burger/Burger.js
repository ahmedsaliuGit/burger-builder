import React from 'react';

import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import classes from './Burger.module.css';

const burger = (props) => {
    const { ingredients } = props;

    let transformedIngredient = Object.keys(ingredients).map(igKey => {
        return [...Array(ingredients[igKey])].map((_, i) => {
            return <BurgerIngredient key={igKey + i} type={igKey} />;
        });
    }).reduce((arr, el) => {
        return arr.concat(el);
    }, []);
    
    if (transformedIngredient.length === 0) transformedIngredient = <p>Please, start adding ingredient</p>;
    
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            { transformedIngredient }
            <BurgerIngredient type="bread-bottom" />
        </div>
    )
}

export default burger;