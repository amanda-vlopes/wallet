import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { act } from 'react-dom/test-utils';
import mockData from './helpers/mockData';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import Wallet from '../pages/Wallet';

const expenses = [{
  id: 0,
  value: '23',
  currency: 'EUR',
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
  tag: 'Lazer',
  description: 'Chocolate',
  exchangeRates: mockData,
},
];

const expected1 = ['Açai', 'Alimentação', 'Dinheiro', '23.00', 'Euro/Real Brasileiro', '5.13', '117.92', 'Real', 'ExcluirEditar'];
const expected2 = ['Chocolate', 'Lazer', 'Dinheiro', '40.00', 'Dólar Americano/Real Brasileiro', '4.75', '190.12', 'Real', 'ExcluirEditar'];
const expected3 = ['Pão de queijo', 'Lazer', 'Dinheiro', '20.00', 'Dólar Americano/Real Brasileiro', '4.75', '95.06', 'Real', 'ExcluirEditar'];

const valueInput = 'value-input';
const descriptionInput = 'description-input';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockData),
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('A aplicação contém um componente Table com as informações corretas', () => {
  const initialState = {
    wallet: {
      expenses,
      currencies: [],
      editor: false,
      idToEdit: 0,
    },
  };

  it('Será verificado se a tabela possui um cabeçalho com elementos th com os valores: Descrição, Tag, Método de pagamento,Valor, Moeda, Câmbio utilizado, Valor convertido, Moeda de conversão e Editar/Excluir ', async () => {
    await act(() => renderWithRouterAndRedux(<Wallet />));
    const headerExpected = ['Descrição', 'Tag', 'Método de pagamento', 'Valor', 'Moeda', 'Câmbio utilizado', 'Valor convertido', 'Moeda de conversão', 'Editar/Excluir'];
    const titleHeader = screen.getAllByRole('columnheader').map((title) => title.textContent);
    expect(titleHeader).toEqual(headerExpected);
  });

  it('Será verificado se a tabela é atualizada com as informações vindas da chave expenses do estado global', async () => {
    await act(() => renderWithRouterAndRedux(<Wallet />, { initialState }));

    const rows = screen.getAllByRole('cell').map((item) => item.textContent);
    const expectedRows = [...expected1, ...expected2];
    expect(rows).toEqual(expectedRows);
    expect(screen.getByTestId('total-field').textContent).toBe('308.04');
  });

  it('Será verificado se ao clicar no botão excluir a despesa é deletada do estado global,e deixará de ser exibida na tela', async () => {
    const { store } = await act(
      () => renderWithRouterAndRedux(<Wallet />, { initialState }),
    );

    act(() => userEvent.click(screen.getAllByTestId('delete-btn')[1]));

    await waitFor(() => {
      expect(store.getState().wallet.expenses).toHaveLength(1);
      expect(store.getState().wallet.expenses[0]).toEqual(expenses[0]);
    });

    const row = screen.getAllByRole('cell').map((item) => item.textContent);
    expect(row).toEqual(expected1);

    expect(screen.getByTestId('total-field').textContent).toBe('117.92');
  });

  it('Será verificado se ao clicar no botão editar é habilitado um formulário para editar a linha da tabela', async () => {
    await act(() => renderWithRouterAndRedux(<Wallet />, { initialState }));

    expect(screen.getByTestId(valueInput).value).toBe('');
    expect(screen.getByTestId(descriptionInput).value).toBe('');
    expect(screen.getByRole('button', { name: /adicionar despesa/i })).toBeInTheDocument();

    act(() => userEvent.click(screen.getAllByTestId('edit-btn')[1]));

    expect(screen.getByTestId(valueInput).value).toBe('40');
    expect(screen.getByTestId(descriptionInput).value).toBe('Chocolate');
    expect(screen.getByRole('button', { name: /editar despesa/i })).toBeInTheDocument();
  });

  it('Será verificado se ao clicar em Editar despesa, a despesa é atualizada, alterando o estado global', async () => {
    const { store } = await act(
      () => renderWithRouterAndRedux(<Wallet />, { initialState }),
    );
    act(() => userEvent.click(screen.getAllByTestId('edit-btn')[1]));

    userEvent.clear(screen.getByTestId(valueInput));
    userEvent.clear(screen.getByTestId(descriptionInput));
    userEvent.type(screen.getByTestId(valueInput), '20');
    userEvent.type(screen.getByTestId(descriptionInput), expected3[0]);

    act(() => userEvent.click(screen.getByRole('button', { name: /editar despesa/i })));

    const rows = screen.getAllByRole('cell').map((item) => item.textContent);
    const expectedRows = [...expected1, ...expected3];
    expect(rows).toEqual(expectedRows);

    expenses[1] = {
      id: 1,
      value: '20',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Lazer',
      description: 'Pão de queijo',
      exchangeRates: mockData,
    };

    expect(store.getState().wallet.expenses).toEqual(expenses);
  });
});
