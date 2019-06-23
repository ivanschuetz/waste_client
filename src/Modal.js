import * as ReactDOM from "react-dom";
import React from "react";

const Modal = ({ title, children, onCloseClick }) => (
    ReactDOM.createPortal(
        <div className="modal">
            <div className="modal-content">
                <p className="modal-topbar-title">{title}</p>
                <p className="modal-topbar-x" onClick={() => onCloseClick()}>X</p>
                <div style={{ clear: "left" }} />
                {children}
            </div>
        </div>,
        document.getElementById('modal-root')
    )
);

export default Modal;
