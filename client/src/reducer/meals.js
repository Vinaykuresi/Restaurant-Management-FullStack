import actionTypes from "../actionTypes";

const initialState = {
  mealItem:{}
};

export default (state = initialState, action) => {
    switch(action.type){
        case(actionTypes.ADD_MEAL):
            return {...state,mealItem:action.mealItem}
        default:
            return state
    }
}