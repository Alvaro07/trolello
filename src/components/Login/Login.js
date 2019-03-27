import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { setLogin, setUser } from "../../redux/reducer";
import { createUser, getUserByUserName, authUser } from "../../firebase/functions/user";

import InputText from "../InputText/InputText";
import Button from "../Button/Button";

const Login = props => {
  /**
   * Component State
   */

  const [dataLogin, setDataLogin] = useState({
    user: "",
    password: "",
    isValid: true,
    errorMessage: "Complete all the fields to login"
  });

  const [dataRegister, setDataRegister] = useState({
    user: "",
    email: "",
    password: "",
    isValid: true,
    errorMessage: "The register is not complete"
  });

  const [shake, setShake] = useState(false);
  const [isLoading, setLoad] = useState(true);

  /**
   * Effect
   */

  /**
   * Comprbamos si hay usuario en localstorage y accedemos
   */

  useEffect(() => {
    if (localStorage.user) {
      getUserByUserName(localStorage.user).then(data => {
        authUser(data.email, localStorage.password).then(() => {
          props.setUser(data);
          props.setLogin(true);
          setLoad(false);
        });
      });
    } else {
      setLoad(false);
    }
  }, []);

  /**
   * Reseteamos el estado de shake para que pueda funcionar una y otra vez
   */

  useEffect(() => {
    setTimeout(() => {
      setShake(false);
    }, 500);
  }, [shake]);

  /**
   * Authentication
   */
  const handleAuth = e => {
    e.preventDefault();

    // Comprobamos que los datos sean correctos
    if (!dataLogin.user.length || !dataLogin.password.length) {
      setDataLogin({ ...dataLogin, isValid: false });
      setShake(true);

      // Si los datos son correctos nos logueamos
    } else {
      setDataLogin({ ...dataLogin, isValid: true });

      getUserByUserName(dataLogin.user)
        .then(data => {
          authUser(data.email, dataLogin.password)
            .then(() => {
              localStorage.setItem("user", dataLogin.user);
              localStorage.setItem("password", dataLogin.password);
              props.setUser(data);
              props.setLogin(true);
            })
            .catch(error => {
              setDataLogin({ ...dataLogin, isValid: false, errorMessage: error.message });
              setShake(true);
            });
        })
        .catch(error => {
          setDataLogin({ ...dataLogin, isValid: false, errorMessage: error });
          setShake(true);
        });
    }
  };

  /**
   * Register
   */

  const handleRegister = e => {
    e.preventDefault();

    // Comprobamos que los datos sean correctos, si no lo son mostramos el error
    if (!dataRegister.user.length || !dataRegister.email.length || !dataRegister.password.length) {
      setDataRegister({ ...dataRegister, isValid: false });
      setShake(true);

      // Si los datos son correctos registramos, antes comporbando si el usuario ya existe
    } else {
      createUser(dataRegister.user, dataRegister.email, dataRegister.password, result => {
        if (!result) {
          setDataRegister({ ...dataRegister, isValid: true });
          props.setLogin(true);
        } else {
          setDataRegister({ ...dataRegister, isValid: false, errorMessage: result.message });
          setShake(true);
        }
      });
    }
  };

  /**
   * Render
   */
  if (isLoading) return <div className="dashboard">Cargando ...</div>;

  return props.state.isLogin ? (
    <Redirect from="/" to="/dashboard" />
  ) : (
    <section className="login-wrap">
      <header className="login-wrap__header">
        <h1 className="login-wrap__header__brand">Trolello</h1>
      </header>

      <main className={`login ${shake === true ? "login--shake" : ""}`}>
        <form className="login__form">
          <h2 className="login__title">Sign in</h2>
          <InputText
            type="text"
            id="signInUser"
            labelText="User"
            placeholder="type your user..."
            extraClass="margin-bottom-20"
            onKeyUp={e => setDataLogin({ ...dataLogin, user: e.target.value })}
            error={dataLogin.isValid === false && !dataLogin.user.length ? true : false}
          />
          <InputText
            type="password"
            id="signInPassword"
            labelText="Password"
            placeholder="enter your password..."
            extraClass="margin-bottom-30"
            onKeyUp={e => setDataLogin({ ...dataLogin, password: e.target.value })}
            error={dataLogin.isValid === false && !dataLogin.password.length ? true : false}
          />

          <Button text="Log in" onClick={e => handleAuth(e)} />

          {dataLogin.isValid === false && <p className="color-orange bold padding-top-20">{dataLogin.errorMessage}</p>}
        </form>
        <form className="login__form">
          <h2 className="login__title">Register</h2>
          <InputText
            type="text"
            id="registerUser"
            labelText="User"
            placeholder="type your user..."
            extraClass="margin-bottom-20"
            onKeyUp={e => setDataRegister({ ...dataRegister, user: e.target.value })}
            error={dataRegister.isValid === false && !dataRegister.user.length ? true : false}
          />
          <InputText
            type="email"
            id="registerEmail"
            labelText="Email"
            placeholder="type your email..."
            extraClass="margin-bottom-20"
            onKeyUp={e => setDataRegister({ ...dataRegister, email: e.target.value })}
            error={!dataRegister.isValid && !dataRegister.email.length ? true : false}
          />
          <InputText
            type="password"
            id="registerPassword"
            labelText="Password"
            placeholder="enter your new password..."
            extraClass="margin-bottom-30"
            onKeyUp={e => setDataRegister({ ...dataRegister, password: e.target.value })}
            error={dataRegister.isValid === false && !dataRegister.password.length ? true : false}
          />
          <Button text="Register" type="secondary" onClick={e => handleRegister(e)} />

          {dataRegister.isValid === false && <p className="color-orange bold padding-top-20">{dataRegister.errorMessage}</p>}
        </form>
      </main>
    </section>
  );
};

const mapStateToProps = state => ({ state });
const mapDispatchToProps = dispatch => ({
  setLogin: boolean => dispatch(setLogin(boolean)),
  setUser: data => dispatch(setUser(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
