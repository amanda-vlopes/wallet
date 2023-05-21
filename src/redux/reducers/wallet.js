// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas

import { DELETE_EXPENSE, EDIT_EXPENSE,
  REQUEST_SUCCESS, SAVE_EDIT_EXPENSE, SAVE_EXPENSE } from '../actions';

const initialState = {
  currencies: [],
  expenses: [],
  editor: false,
  idToEdit: 0,
};

const wallet = (state = initialState, action) => {
  switch (action.type) {
  case REQUEST_SUCCESS:
    return {
      ...state,
      currencies: action.moedas,
    };
  case SAVE_EXPENSE:
    return {
      ...state,
      expenses: [...state.expenses, { ...action.expenseInfo, id: state.expenses.length }],
    };
  case DELETE_EXPENSE:
    return {
      ...state,
      expenses: state.expenses.filter(({ id }) => id !== action.idExpense),
    };
  case EDIT_EXPENSE:
    return {
      ...state,
      editor: state.editor !== true,
      idToEdit: action.id,
      valueToEdit: action.value,
    };
  case SAVE_EDIT_EXPENSE:
    return {
      ...state,
      editor: false,
      expenses: action.editExpense,
    };
  default:
    return state;
  }
};

export default wallet;
