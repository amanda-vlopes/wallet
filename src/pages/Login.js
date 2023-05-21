import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { saveUser } from '../redux/actions';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
  };

  saveInfoInput = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };

  isButtonDisabled = () => {
    const { email, password } = this.state;
    const isEmailValid = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i.test(email);
    const six = 6;
    const isPasswordValid = password.length >= six;
    return !(isEmailValid && isPasswordValid);
  };

  goToWallet = () => {
    const { email } = this.state;
    const { dispatch, history } = this.props;
    dispatch(saveUser(email));
    history.push('/carteira');
  };

  render() {
    const { email, password } = this.state;
    return (
      <div>
        <input
          type="text"
          data-testid="email-input"
          name="email"
          value={ email }
          onChange={ this.saveInfoInput }
          placeholder="Digite aqui o seu email"
        />

        <input
          type="password"
          data-testid="password-input"
          name="password"
          onChange={ this.saveInfoInput }
          value={ password }
          placeholder="Digite a sua senha"
        />

        <button
          disabled={ this.isButtonDisabled() }
          onClick={ this.goToWallet }
        >
          Entrar
        </button>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect()(Login);
