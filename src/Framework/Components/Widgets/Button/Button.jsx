import React from "react";
import PropTypes from "prop-types";
import "./Button.scss";
import classNames from "classnames";

function Button(props) {
  const { varient = "grey", trigger, className, children, ...restProps } = props;
  return (
    <button type="button" className={classNames(`DynBiz_Btn DynBiz_${varient}_Btn`, className)} {...restProps}>
      {trigger === "true" || trigger === true ? (
        <div className="DynBiz_btn__spinner">
          <div className="DynBiz_btn__bounce1" />
          <div className="DynBiz_btn__bounce2" />
          <div className="DynBiz_btn__bounce3" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;

Button.propTypes = {
  varient: PropTypes.string.isRequired,
  trigger: PropTypes.string,
  className: PropTypes.any,
  children: PropTypes.node.isRequired,
};
