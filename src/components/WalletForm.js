import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addExpense, editExpense, getCurrenciesFromAPI } from '../redux/actions';

class WalletForm extends Component {
  state = {
    value: '',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
    description: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getCurrenciesFromAPI());
  }

  componentDidUpdate(prevProps) {
    const { editor, expenses, idToEdit } = this.props;
    if (editor && !prevProps.editor) {
      this.setState({
        value: expenses[idToEdit].value,
        currency: expenses[idToEdit].currency,
        method: expenses[idToEdit].method,
        tag: expenses[idToEdit].tag,
        description: expenses[idToEdit].description,
      });
    } else if (!editor && prevProps.editor) {
      this.setState({
        value: '',
        currency: 'USD',
        method: 'Dinheiro',
        tag: 'Alimentação',
        description: '',
      });
    }
  }

  saveInfoExpense = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };

  addNewExpense = () => {
    const { dispatch, editor, idToEdit } = this.props;
    if (editor) {
      dispatch(editExpense(idToEdit, this.state));
    } else {
      dispatch(addExpense(this.state));
    }
    this.setState({
      value: '',
      description: '',
    });
  };

  render() {
    const { currencies, editor } = this.props;
    const { value, description, currency, method, tag } = this.state;
    const buttonText = editor ? 'Editar despesa' : 'Adicionar despesa';
    return (
      <section>
        <label htmlFor="value">Valor da despesa:</label>
        <input
          type="text"
          name="value"
          data-testid="value-input"
          id="value"
          onChange={ this.saveInfoExpense }
          value={ value }
        />

        <label htmlFor="description">Descrição da despesa:</label>
        <input
          type="text"
          name="description"
          id="description"
          data-testid="description-input"
          onChange={ this.saveInfoExpense }
          value={ description }
        />

        <label htmlFor="currency">Moeda:</label>
        <select
          name="currency"
          data-testid="currency-input"
          id="currency"
          onChange={ this.saveInfoExpense }
          value={ currency }
        >
          {
            currencies.map((moeda) => (
              <option value={ moeda } key={ moeda }>{ moeda }</option>
            ))
          }
        </select>

        <label htmlFor="method">Método de pagamento:</label>
        <select
          name="method"
          id="method"
          data-testid="method-input"
          onChange={ this.saveInfoExpense }
          value={ method }
        >
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de débito">Cartão de débito</option>
          <option value="Cartão de crédito">Cartão de crédito</option>
        </select>

        <label htmlFor="tag">Categoria da despesa</label>
        <select
          name="tag"
          id="tag"
          data-testid="tag-input"
          onChange={ this.saveInfoExpense }
          value={ tag }
        >
          <option value="Alimentação">Alimentação</option>
          <option value="Lazer">Lazer</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Transporte">Transporte</option>
          <option value="Saúde">Saúde</option>
        </select>

        <button onClick={ this.addNewExpense }>{ buttonText }</button>
      </section>
    );
  }
}

WalletForm.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  dispatch: PropTypes.func.isRequired,
  editor: PropTypes.bool.isRequired,
  idToEdit: PropTypes.number.isRequired,
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

export default connect(mapStateToProps)(WalletForm);
