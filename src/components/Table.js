import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteExpense, editionMode } from '../redux/actions';

class Table extends Component {
  render() {
    const { expenses, dispatch } = this.props;
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
          <tbody>
            {
              expenses.map(
                ({ currency, description, id, method, tag, value, exchangeRates }) => (
                  <tr key={ id }>
                    <td>{ description }</td>
                    <td>{ tag }</td>
                    <td>{ method }</td>
                    <td>{ Number(value).toFixed(2) }</td>
                    <td>{exchangeRates[currency].name}</td>
                    <td>{ Number(exchangeRates[currency].ask).toFixed(2) }</td>
                    <td>{ (exchangeRates[currency].ask * value).toFixed(2) }</td>
                    <td>Real</td>
                    <td>
                      <button
                        data-testid="delete-btn"
                        onClick={ () => dispatch(deleteExpense(id)) }
                      >
                        Excluir
                      </button>
                      <button
                        data-testid="edit-btn"
                        onClick={ () => dispatch(editionMode(
                          id,
                          exchangeRates[currency].ask * value,
                        )) }
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ),
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}

Table.propTypes = {
  dispatch: PropTypes.func.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    value: PropTypes.string,
    description: PropTypes.string,
    currency: PropTypes.string,
    method: PropTypes.string,
    tag: PropTypes.string,
  })).isRequired,
};

const mapStateToProps = (state) => ({
  ...state.wallet,
});

export default connect(mapStateToProps)(Table);
