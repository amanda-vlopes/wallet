// Coloque aqui suas actions
export const SAVE_USER = 'SAVE_USER';
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS';
export const SAVE_EXPENSE = 'SAVE_EXPENSE';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';
export const EDIT_EXPENSE = 'EDIT_EXPENSE';
export const SAVE_EDIT_EXPENSE = 'SAVE_EDIT_EXPENSE';
const urlAPI = 'https://economia.awesomeapi.com.br/json/all';

export const saveUser = (email) => ({
  type: SAVE_USER,
  email,
});

const requestSuccess = (moedas) => ({
  type: REQUEST_SUCCESS,
  moedas,
});

export const getCurrenciesFromAPI = () => async (dispatch) => {
  const response = await fetch(urlAPI);
  const data = await response.json();
  const moedas = Object.keys(data).filter((moeda) => moeda !== 'USDT');
  dispatch(requestSuccess(moedas));
};

const saveExpense = (info, exchangeRates) => ({
  type: SAVE_EXPENSE,
  expenseInfo: { ...info, exchangeRates },
});

export const addExpense = (info) => async (dispatch) => {
  const response = await fetch(urlAPI);
  const data = await response.json();
  dispatch(saveExpense(info, data));
};

export const deleteExpense = (idExpense) => ({
  type: DELETE_EXPENSE,
  idExpense,
});

export const editionMode = (id, value) => ({
  type: EDIT_EXPENSE,
  id,
  value,
});

const saveEditExpense = (editExpense) => ({
  type: SAVE_EDIT_EXPENSE,
  editExpense,
});

export const editExpense = (id, expense) => (dispatch, getState) => {
  const { expenses } = getState().wallet;
  const idArray = expenses.findIndex((gasto) => gasto.id === id);
  const rates = expenses[idArray].exchangeRates;
  const editedExpense = { id, ...expense, exchangeRates: rates };
  expenses.splice(id, 1, editedExpense);
  dispatch(saveEditExpense(expenses));
};
