import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const SessionTimeOut = (user) => {
    return(
        <React.Fragment>
            <Modal.Dialog>
            <Modal.Header closeButton>
                <Modal.Title>Hey there</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Your session was expired, Please login.</p>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={()=>{this.props.history.push(`${user}/login`)}} variant="primary">Register</Button>
            </Modal.Footer>
            </Modal.Dialog>
        </React.Fragment>
    )
}

export default SessionTimeOut;