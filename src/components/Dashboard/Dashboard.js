import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { showModal } from "../../redux/reducer";

// Components
import Header from "../Header/Header";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import ModalContent from "../Modal/ModalContent";
import InputText from "../InputText/InputText";
import Textarea from "../Textarea/Textarea";

const Dashboard = props => {
  if (!props.state.isLogin) {
    return <Redirect from="/" to="/login" />;
  } else {
    return (
      <div className="dashboard">
        <Header />
        <div className="dashboard__table">
          <Button type="primary" text="New Board" iconClass="columns" onClick={() => props.showModal("new-board")} />

          {props.state.modal === "new-board" && (
            <Modal>
              <ModalContent modalTitle="Add new board" type="small">
                <InputText type="text" id="newBoardName" placeholder="Board Name" icon="columns" extraClass="margin-bottom-10" />
                <Textarea placeholder="Description" noResize={true} extraClass="margin-bottom-20" />
                <Button text="Create Board" />
              </ModalContent>
            </Modal>
          )}
        </div>
      </div>
    );
  }
};

const mapStateToProps = state => ({ state });
const mapDispatchToProps = dispatch => ({
  showModal: modal => dispatch(showModal(modal))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
