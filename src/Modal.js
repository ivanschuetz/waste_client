import * as ReactDOM from "react-dom";
import React from "react";

const Modal = ({ children }) => (
    ReactDOM.createPortal(
        <div className="modal">
            {children}
        </div>,
        document.getElementById('modal-root')
    )
);

export default Modal;
