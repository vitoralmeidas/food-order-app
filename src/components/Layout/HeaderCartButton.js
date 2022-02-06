import { useContext, useEffect, useState } from "react";

import CartContext from "../../store/cart-context";
import CartIcon from "../Cart/CartIcon";
import classes from "./HeaderCartButton.module.css";

const HeaderCartButton = (props) => {
  const cartCtx = useContext(CartContext);
  const [isBtnHighlighted, setisBtnHighlighted] = useState(false);

  const numberOfCartItems = cartCtx.items.reduce((curNumber, item) => {
    return curNumber + item.amount;
  }, 0);

  const { items } = cartCtx;

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      return setisBtnHighlighted(false);
    }, 300);
    
    setisBtnHighlighted(true);

    return () => {
      clearTimeout(timer);
    };
  }, [items]);

  const btnClass = `${classes.button} ${isBtnHighlighted ? classes.bump : ""}`;

  return (
    <button className={btnClass} onClick={props.onClick}>
      <span className={classes.icon}>
        <CartIcon />
      </span>
      <span>Your Cart</span>
      <span className={classes.badge}>{numberOfCartItems}</span>
    </button>
  );
};

export default HeaderCartButton;
