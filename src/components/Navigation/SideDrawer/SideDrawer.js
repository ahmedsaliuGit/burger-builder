import React from "react";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";

import classes from "./SideDrawer.module.css";
import Aux from "../../../hoc/Aux/Aux";
import Backdrop from "../../UI/Backdrop/Backdrop";

const SideDrawer = props => {
  let attactedClasses = [classes.SideDrawer, classes.Close];

  if (props.open) attactedClasses = [classes.SideDrawer, classes.Open];

  return (
    <Aux>
      <Backdrop show={props.open} clicked={props.closed} />
      <div className={attactedClasses.join(" ")} onClick={props.closed}>
        <div className={classes.Logo}>
          <Logo />
        </div>
        <nav>
          <NavigationItems isAuth={props.isAuthenticated} />
        </nav>
      </div>
    </Aux>
  );
};

export default SideDrawer;
