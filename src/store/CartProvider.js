import { useReducer } from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    // finding the index of the already existing item
    // has the same id as the item we're adding(if the item is on the items[])
    // findIndex() will return true and the index of the already existing item
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    // if the item existing, we're going to access it in the state.items
    // if the item doesn't exist, it will return 'null'
    const existingCartItem = state.items[existingCartItemIndex];

    let updatedItems;

    if (existingCartItem) {
      const updateItem = {
        ...existingCartItem,
        // we need to update the amout of that existing item
        amount: existingCartItem.amount + action.item.amount,
      };

      // copy the old objects (without editing the old array in memory)
      updatedItems = [...state.items];

      // in 'updatedItems[existingCartItemIndex]'
      // we're accessing the already existing item within the old items[];
      // I'll overwrite this with updateItem
      // then the amount will be update to the real amount when we add the new item
      // which is the same item that already exist!
      // just the amount will change...
      updatedItems[existingCartItemIndex] = updateItem;
    } else {
      // when the items is added for the first time
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === "REMOVE") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );

    const existingItem = state.items[existingCartItemIndex];

    const updatedTotalAmount = state.totalAmount - existingItem.price;
    
    let updatedItems;

    if (existingItem.amount === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);
    } else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartActions] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartActions({ type: "ADD", item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartActions({ type: "REMOVE", id: id });
  };

  // it will be update over time.(dynamic)
  // the real 'data'
  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
