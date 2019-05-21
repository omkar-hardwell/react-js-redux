import Item1 from '../../images/item1.jpg'
import Item2 from '../../images/item2.jpg'
import Item3 from '../../images/item3.jpg'
import Item4 from '../../images/item4.jpg'
import Item5 from '../../images/item5.jpg'
import Item6 from '../../images/item6.jpg'
import {ADD_TO_CART, REMOVE_ITEM, SUB_QUANTITY, ADD_QUANTITY, ADD_SHIPPING} from '../actions/action-types/cart-actions'


const initState = {
    items: [
        {
            id: 1,
            title: 'Winter body',
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, ex.",
            price: 110,
            img: Item1
        },
        {
            id: 2,
            title: 'Adidas',
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, ex.",
            price: 80,
            img: Item2
        },
        {
            id: 3,
            title: 'Vans',
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, ex.",
            price: 120,
            img: Item3
        },
        {
            id: 4,
            title: 'White',
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, ex.",
            price: 260,
            img: Item4
        },
        {
            id: 5,
            title: 'Cropped-sho',
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, ex.",
            price: 160,
            img: Item5
        },
        {
            id: 6,
            title: 'Blues',
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, ex.",
            price: 90,
            img: Item6
        }
    ],
    addedItems: [],
    total: 0,
    isShippingSelected: false

};
const cartReducer = (state = initState, action) => {

    //INSIDE HOME COMPONENT
    if (action.type === ADD_TO_CART) {
        let addedItem = state.items.find(item => item.id === action.id);
        //check if the action id exists in the addedItems
        let existed_item = state.addedItems.find(item => action.id === item.id);
        if (existed_item) {
            addedItem.quantity += 1;

            saveToLocalStorage({
                ...state,
                total: state.total + addedItem.price
            });
            return {
                ...state,
                total: state.total + addedItem.price
            }
        }
        else {
            addedItem.quantity = 1;
            //calculating the total
            let newTotal = state.total + addedItem.price;

            saveToLocalStorage({
                ...state,
                addedItems: [...state.addedItems, addedItem],
                total: newTotal
            });
            return {
                ...state,
                addedItems: [...state.addedItems, addedItem],
                total: newTotal
            }

        }
    }
    if (action.type === REMOVE_ITEM) {
        let itemToRemove = state.addedItems.find(item => action.id === item.id);
        let new_items = state.addedItems.filter(item => action.id !== item.id);

        //calculating the total
        let newTotal = 0;
        if (new_items.length > 0) {
            newTotal = state.total - (itemToRemove.price * itemToRemove.quantity);
        }
        // console.log(itemToRemove);

        saveToLocalStorage({
            ...state,
            addedItems: new_items,
            total: newTotal
        });
        return {
            ...state,
            addedItems: new_items,
            total: newTotal
        }
    }
    //INSIDE CART COMPONENT
    if (action.type === ADD_QUANTITY) {
        let addedItem = state.items.find(item => item.id === action.id);
        addedItem.quantity += 1;
        let newTotal = state.total + addedItem.price;

        saveToLocalStorage({
            ...state,
            total: newTotal
        });
        return {
            ...state,
            total: newTotal
        }
    }
    if (action.type === SUB_QUANTITY) {
        let addedItem = state.items.find(item => item.id === action.id);
        //if the qt == 0 then it should be removed
        if (addedItem.quantity === 1) {
            let new_items = state.addedItems.filter(item => item.id !== action.id);
            let newTotal = state.total - addedItem.price;

            saveToLocalStorage({
                ...state,
                addedItems: new_items,
                total: newTotal
            });
            return {
                ...state,
                addedItems: new_items,
                total: newTotal
            }
        }
        else {
            addedItem.quantity -= 1;
            let newTotal = state.total - addedItem.price;

            saveToLocalStorage({
                ...state,
                total: newTotal
            });
            return {
                ...state,
                total: newTotal
            }
        }

    }

    if (action.type === ADD_SHIPPING) {
        saveToLocalStorage({
            ...state,
            total: ((state.addedItems) ? state.total + 6 : 0),
            isShippingSelected: true
        });
        return {
            ...state,
            total: ((state.addedItems) ? state.total + 6 : 0),
            isShippingSelected: true
        }
    }

    if (action.type === 'SUB_SHIPPING') {
        saveToLocalStorage({
            ...state,
            total: ((state.addedItems) ? state.total - 6 : 0),
            isShippingSelected: false
        });
        return {
            ...state,
            total: ((state.addedItems) ? state.total - 6 : 0),
            isShippingSelected: false
        }
    }

    // update store bases on local storage
    const addedToCart = (localStorage.getItem("items") === null) ? null : JSON.parse(localStorage.getItem("items"));
    if (addedToCart) state = addedToCart;

    return state
};

const saveToLocalStorage = (stateValue) => {
    localStorage.setItem("items", JSON.stringify(stateValue));
};

export default cartReducer;
