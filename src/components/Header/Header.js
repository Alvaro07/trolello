import React from "react";
import { connect } from "react-redux";
import { setLogin, setUser, setBoards } from "../../redux/reducer";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Components
import Button from "../Button/Button";

const Header = props => {
  /**
   * Logout function
   */
  const logOut = () => {
    localStorage.clear();
    props.setLogin(false);
    props.setUser(null);
    props.setBoards(null);
  };

  // Taskboard return button
  let returnButton = null;
  if (props.location !== undefined && props.location.pathname.match("TaskBoard")) {
    returnButton = (
      <Link className="c-header__return-btn" to={`/dashboard`}>
        <FontAwesomeIcon icon="align-left" />
      </Link>
    );
  }

  return (
    <header className="c-header">
      <div className="c-header__wrap">
        {returnButton}
        <h1 className="c-header__logo">
          <Link to={`/dashboard`}>Trollelo</Link>
        </h1>
        <div className="c-header__actions">
          <Button variant="secondary" text="logOut" size="small" icon="sign-in-alt" onClick={() => logOut()} />
        </div>
      </div>
    </header>
  );
};

const mapStateToProps = state => ({ state });
const mapDispatchToProps = dispatch => ({
  setLogin: boolean => dispatch(setLogin(boolean)),
  setUser: data => dispatch(setUser(data)),
  setBoards: boards => dispatch(setBoards(boards))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
