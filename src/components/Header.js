import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import wallet from '../images/wallet.png';


class Header extends Component {
  render() {
    const { email, expenses } = this.props;
    const valorTotal = expenses.reduce((
      expTotal,
      { value, currency, exchangeRates },
    ) => expTotal + (value * exchangeRates[currency].ask), 0);
    return (
      <header>
          <div className='title_container'>
            <img src={ wallet } alt="wallet" />
            <h1>MyWallet</h1>
          </div>
        <div>
          <p data-testid="email-field">{ email }</p>
          <p>Total de despesas:</p>
          <span data-testid="total-field">{ valorTotal.toFixed(2) }</span>
          <span data-testid="header-currency-field">BRL</span>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  email: PropTypes.string.isRequired,
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
  ...state.user,
  ...state.wallet,
});

export default connect(mapStateToProps)(Header);
