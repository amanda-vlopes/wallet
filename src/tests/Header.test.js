import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import Header from '../components/Header';

describe('A aplicação contém um componente Header com as informações corretas', () => {
  const email = 'trybe@teste.com';
  const idEmail = 'email-input';
  const idPassword = 'password-input';

  it('Será verificado se o email digitado no Login aparece no componente Header ao ser redirecionado', () => {
    renderWithRouterAndRedux(<App />);
    userEvent.type(screen.getByTestId(idEmail), email);
    userEvent.type(screen.getByTestId(idPassword), '123456');

    userEvent.click(screen.getByText(/entrar/i));

    expect(screen.getByTestId('email-field').textContent).toBe(email);
  });

  it('Será verificado se o componente Header possui um elemento com o total de despesas', () => {
    renderWithRouterAndRedux(<Header />);
    expect(screen.getByText(/total de despesas:/i)).toBeInTheDocument();
  });

  it('Será verificado se o componente Header possui um elemento com o texto BRL', () => {
    renderWithRouterAndRedux(<Header />);
    expect(screen.getByTestId('header-currency-field')).toBeInTheDocument();
    expect(screen.getByTestId('header-currency-field').textContent).toBe('BRL');
  });

  it('Será verificado se o componente Header é renderizado com o total de despesas igual a 0 no momento em que a aplicação é redirecionada para /carteira', () => {
    renderWithRouterAndRedux(<App />);
    userEvent.type(screen.getByTestId(idEmail), email);
    userEvent.type(screen.getByTestId(idPassword), '123456');
    userEvent.click(screen.getByText(/entrar/i));

    expect(screen.getByTestId('total-field').textContent).toBe('0.00');
  });
});
