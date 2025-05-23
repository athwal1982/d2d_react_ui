import ReactDOM from "react-dom";

function HeaderPortal(props) {
  return ReactDOM.createPortal(props.children, document.getElementById("BizHeaderPortal"));
}

export default HeaderPortal;
