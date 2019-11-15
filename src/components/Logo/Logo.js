import React from 'react';

import classes from './Logo.module.css';
import burgerLogo from '../../assets/images/127 burger-logo.png';


const Logo = (props) => (
    <div className={classes.Logo}>
        <img src={burgerLogo} alt="MyBurger" />
    </div>
);

export default Logo;