import actionTypes from "../actionTypes";

export const addMeal = (mealItem) => {
    return (dispatch) => dispatch({ type: actionTypes.ADD_MEAL, mealItem });
};