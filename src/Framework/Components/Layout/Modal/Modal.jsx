import React, { useState, useEffect } from "react";
import styled from "styled-components";
import classNames from "classnames";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";
import Draggable from "react-draggable";
import Portal from "../../../Utilities/Portals/Portal";
import Button from "../../Widgets/Button/Button";
import BizClass from "./Modal.module.scss";

function Modal(props) {
  const {
    varient,
    title,
    children,
    draggable,
    onlymodal,
    className,
    index = 0,
    height,
    show,
    width,
    left,
    right,
    top,
    bottom,
    overlay,
    onlyfooter = false,
    ...restProps
  } = props;

  const [isModalAnimOpen, setModalAnimOpen] = useState(false);

  const toggleModalAnimOpen = () => {
    setModalAnimOpen(true);
    setTimeout(() => {
      setModalAnimOpen(false);
    }, 100);
  };

  const keyDownHander = (e) => {
    if (e.shiftKey && e.keyCode === 27) {
      show();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyDownHander, false);
  }, []);

  const Header = React.Children.toArray(children).filter((children) => children.type.displayName === "BizNextPopupHeader");

  const Body = React.Children.toArray(children).filter((children) => children.type.displayName === "BizNextPopupBody");

  const Footer = React.Children.toArray(children).filter((children) => children.type.displayName === "BizNextPopupFooter");

  return (
    <Portal>
      <PopupBox Index={index + 1}>
        <Draggable handle="#handle" disabled={draggable}>
          <PopupBox
            Index={index + 1}
            className={classNames(BizClass.popup, BizClass[varient], isModalAnimOpen ? BizClass.AnimOn : null, className)}
            height={height}
            width={width}
            left={left}
            right={right}
            top={top}
            bottom={bottom}
          >
            {onlymodal === "true" ? null : (
              <header id="handle" className={BizClass.Header}>
                <h2>{title}</h2>
                <div className={BizClass.ContentBox}>{Header.length === 1 ? Header : null}</div>
                <button type="button" className={BizClass.CloseBtn} onClick={show}>
                  <FaTimes />
                </button>
              </header>
            )}
            <form className={BizClass.FormContent} {...restProps}>
              <div className={BizClass.BodyContent}>{Body.length === 1 ? Body : null}</div>
              {Footer.length === 1 ? (
                <footer className={BizClass.Footer}>
                  <div className={BizClass.FooterBox}>
                    {Footer}
                    {onlyfooter === "true" ? null : (
                      <Button type="button" varient="grey" onClick={() => show()}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </footer>
              ) : null}
            </form>
          </PopupBox>
        </Draggable>
        <PopupBox Index={index} className={classNames(BizClass.Overlay, BizClass[overlay])} onClick={() => toggleModalAnimOpen()} />
      </PopupBox>
    </Portal>
  );
}

export default Modal;

Modal.propTypes = {
  varient: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  draggable: PropTypes.bool,
  onlymodal: PropTypes.bool,
  className: PropTypes.string,
  index: PropTypes.number,
  height: PropTypes.string,
  show: PropTypes.func,
  width: PropTypes.string,
  left: PropTypes.string,
  right: PropTypes.string,
  top: PropTypes.string,
  overlay: PropTypes.string,
  bottom: PropTypes.string,
  onlyfooter: PropTypes.bool,
};

function ModalHeader(props) {
  const { children } = props;
  return children;
}

Modal.Header = ModalHeader;

ModalHeader.propTypes = {
  control: PropTypes.node,
};

function ModalBody(props) {
  const { children } = props;
  return children;
}

Modal.Body = ModalBody;

ModalBody.propTypes = {
  control: PropTypes.node,
};

function ModalFooter(props) {
  const { children } = props;
  return children;
}

Modal.Footer = ModalFooter;

ModalFooter.propTypes = {
  control: PropTypes.node,
};

Modal.Header.displayName = "BizNextPopupHeader";
Modal.Body.displayName = "BizNextPopupBody";
Modal.Footer.displayName = "BizNextPopupFooter";

const PopupBox = styled.div.attrs(() => ({}))`
  &&& {
    z-index: calc(9999 + ${(p) => p.Index});
    min-height: ${(p) => p.height};
    height: ${(p) => p.height};
    width: ${(p) => p.width};
    min-width: ${(p) => p.width};
    left: ${(p) => p.left};
    right: ${(p) => p.right};
    top: ${(p) => p.top};
    bottom: ${(p) => p.bottom};
  }
`;
