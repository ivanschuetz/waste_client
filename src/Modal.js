import * as ReactDOM from "react-dom";
import React from "react";

const Modal = ({ children, onCloseClick }) => (
    ReactDOM.createPortal(
        <div className="modal">
            <p className="modal-topbar-title">Impressum</p>
            <p className="modal-topbar-x" onClick={() => onCloseClick()}>x</p>
            {children}
        </div>,
        document.getElementById('modal-root')
    )
);

export default Modal;
