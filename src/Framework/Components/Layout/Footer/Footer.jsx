import React from "react";
import BizClass from "./Footer.module.scss";

function Footer(props) {
  const { title, children, ...rest } = props;

  return (
    <React.Fragment>
      <footer className={BizClass.Div} {...rest}>
        {children}
      </footer>
    </React.Fragment>
  );
}

export default Footer;
