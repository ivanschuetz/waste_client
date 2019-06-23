import * as ReactDOM from "react-dom";
import React from "react";


const Modal = ({ title, children, onCloseClick }) => (
    ReactDOM.createPortal(
        <div className="modal">
            <div className="modal-content">
                <div className="modal-topbar">
                    <h2 className="modal-topbar-title">{title}</h2>
                    <p className="modal-topbar-x" onClick={() => onCloseClick()}>X</p>
                </div>
                <div className="modal-bottombar">

                    <div style={{ clear: "left" }} />
                    {children}
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    )
);

export default Modal;
