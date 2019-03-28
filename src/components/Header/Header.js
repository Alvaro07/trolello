import React from "react";
import { connect } from "react-redux";
import { setLogin } from "../../redux/reducer";

// Components
import Button from "../Button/Button";

const Header = props => {
  /**
   * Logout function
   */
  const logOut = () => {
    localStorage.clear();
    props.setLogin(false);
  };

  return (
    <header className="c-header">
      <h1 className="c-header__logo">Trollelo</h1>
      <div className="c-header__actions">
        <Button type="secondary" text="logOut" size="small" icon="sign-in-alt" onClick={() => logOut()} />
      </div>
    </header>
  );
};

const mapStateToProps = state => ({ state });
const mapDispatchToProps = dispatch => ({
  setLogin: boolean => dispatch(setLogin(boolean))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
