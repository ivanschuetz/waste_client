import * as ReactDOM from "react-dom";
import React from "react";

import SVGIcon from './icons/SVGIcon';

const Modal = ({ title, children, onCloseClick }) => {

    const onModalClick = (event) => {
        if (event.target === document.querySelector(".modal")) {
            onCloseClick();
        }
    };

    return ReactDOM.createPortal(
        <div className="modal" onClick={onModalClick}>
            <div className="modal-content">
                <div className="modal-topbar">
                    <p className="modal-topbar-title">{title}</p>
                    <p className="modal-topbar-x" onClick={() => onCloseClick()}>
                        <SVGIcon name="close-2" width="20px" height="20px" />
                    </p>
                </div>
                <div className="modal-bottombar">

                    <div style={{ clear: "left" }} />
                    {children}
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    )
};

export default Modal;
