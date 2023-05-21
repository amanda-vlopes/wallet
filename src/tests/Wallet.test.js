import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { act } from 'react-dom/test-utils';
import App from '../App';
import WalletForm from '../components/WalletForm';
import mockData from './helpers/mockData';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import Wallet from '../pages/Wallet';

describe('A aplicação contém um componente Wallet com as informações corretas', () => {
  const email = 'trybe@teste.com';
  const valueInput = 'value-input';
  const descriptionInput = 'description-input';

  const expenses = [{
    id: 0,
    value: '23',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
    description: 'Açai',
    exchangeRates: mockData,
  },
  {
    id: 1,
    value: '40',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
    description: 'Chocolate',
    exchangeRates: mockData,
  },
  ];

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Será verificado se os campos para preencher as informações da despesa são renderizados corretamente ao fazer o login e ser redirecionado para a pagina /carteira', async () => {
    const { store } = renderWithRouterAndRedux(<App />);
    userEvent.type(screen.getByTestId('email-input'), email);
    userEvent.type(screen.getByTestId('password-input'), '123456');

    act(() => {
      userEvent.click(screen.getByText(/entrar/i));
    });

    await waitFor(() => expect(store.getState().wallet.currencies).not.toHaveLength(0));

    expect(screen.getByTestId(valueInput)).toBeInTheDocument();
    expect(screen.getByTestId(descriptionInput)).toBeInTheDocument();
    expect(screen.getByTestId('currency-input')).toBeInTheDocument();
    expect(screen.getByTestId('method-input')).toBeInTheDocument();
    expect(screen.getByTestId('tag-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /adicionar despesa/i })).toBeInTheDocument();
  });

  it('Será verificado se ao digitar nos campos e apertar o botão Adicionar despesa as informações são salvas no estado global', async () => {
    const { store } = renderWithRouterAndRedux(<WalletForm />);

    expect(store.getState().wallet.expenses).toEqual([]);

    userEvent.type(screen.getByTestId(valueInput), '23');
    userEvent.type(screen.getByTestId(descriptionInput), 'Açai');

    act(() => {
      userEvent.click(screen.getByRole('button', { name: /adicionar despesa/i }));
    });

    await waitFor(() => expect(store.getState().wallet.expenses).toHaveLength(1));

    expect(store.getState().wallet.expenses[0]).toEqual(expenses[0]);
  });

  it('Será verificado se ao adicionar uma nova despesa o elemento com o total de despesas é atualizado com o valor adicionado', async () => {
    const { store } = renderWithRouterAndRedux(<WalletForm />);
    userEvent.type(screen.getByTestId(valueInput), '23');
    userEvent.type(screen.getByTestId(descriptionInput), 'Açai');

    act(() => {
      userEvent.click(screen.getByRole('button', { name: /adicionar despesa/i }));
    });

    await waitFor(() => expect(store.getState().wallet.expenses).toHaveLength(1));
    expect(store.getState().wallet.expenses[0]).toEqual(expenses[0]);

    expect(screen.getByTestId(valueInput).textContent).toBe('');
    expect(screen.getByTestId(descriptionInput).textContent).toBe('');

    userEvent.type(screen.getByTestId(valueInput), '40');
    userEvent.type(screen.getByTestId(descriptionInput), 'Chocolate');

    act(() => {
      userEvent.click(screen.getByRole('button', { name: /adicionar despesa/i }));
    });

    await waitFor(() => expect(store.getState().wallet.expenses).toHaveLength(2));
    expect(store.getState().wallet.expenses[1]).toEqual(expenses[1]);
  });

  it('Será verificado se ao adicionar uma nova despesa, as informações da mesma são renderizadas na tela', async () => {
    const { store } = renderWithRouterAndRedux(<Wallet />);

    userEvent.type(screen.getByTestId(valueInput), '23');
    userEvent.type(screen.getByTestId(descriptionInput), 'Açai');

    act(() => {
      userEvent.click(screen.getByRole('button', { name: /adicionar despesa/i }));
    });

    await waitFor(() => expect(store.getState().wallet.expenses).toHaveLength(1));

    userEvent.clear(screen.getByTestId(valueInput));
    userEvent.clear(screen.getByTestId(descriptionInput));

    userEvent.type(screen.getByTestId(valueInput), '40');
    userEvent.type(screen.getByTestId(descriptionInput), 'Chocolate');

    act(() => {
      userEvent.click(screen.getByRole('button', { name: /adicionar despesa/i }));
    });

    await waitFor(() => expect(store.getState().wallet.expenses).toHaveLength(2));

    expenses
      .forEach(({ id, value, currency, method, tag, description, exchangeRates }) => {
        screen.getByText(description);
        expect(screen.getAllByText(tag)[id]).toBeInTheDocument();
        expect(screen.getAllByText(method)[id]).toBeInTheDocument();
        screen.getByText(Number(value).toFixed(2));
        expect(screen.getAllByText(exchangeRates[currency].name)[id]).toBeInTheDocument();
        expect(screen.getAllByText(Number(exchangeRates[currency].ask).toFixed(2))[id])
          .toBeInTheDocument();
        screen.getByText((exchangeRates[currency].ask * value).toFixed(2));
        expect(screen.getAllByText('Real')[id]).toBeInTheDocument();
        expect(screen.getAllByTestId('delete-btn')[id]).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /editar/i })[id]).toBeInTheDocument();
      });
  });
});
