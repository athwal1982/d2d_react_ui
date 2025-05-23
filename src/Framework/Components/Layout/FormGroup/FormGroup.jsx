import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import Select from "react-select";
import PropTypes from "prop-types";
import { ReactSelectStyle, ReactSelectStyleBigOptions, ReactMultiSelectStyle } from "Framework/Assets/Styles/Widgets/SelectStyle/SelectStyle";
import { FormStyle, FormGroupStyle, InputGroupStyle, FormBoxGroupStyle, FormCustomGroupStyle, InputLabelStyle } from "./FormGroupStyle";
import BizClass from "./FormGroup.module.scss";

export default function Form(props) {
  const { children, ...restProps } = props;
  return <FormStyle {...restProps}>{children}</FormStyle>;
}

Form.propTypes = {
  children: PropTypes.node.isRequired,
};

function FormGroup(props) {
  const { column = 1, padding = 0, minwidth = "60px", controlwidth, children, ...restProps } = props;
  return (
    <FormGroupStyle column={column} padding={padding} minwidth={minwidth} controlwidth={controlwidth} {...restProps}>
      {children}
    </FormGroupStyle>
  );
}

Form.Group = FormGroup;

FormGroup.propTypes = {
  column: PropTypes.number,
  padding: PropTypes.number,
  minwidth: PropTypes.string,
  controlwidth: PropTypes.string,
  children: PropTypes.node.isRequired,
};

function FormBoxGroup(props) {
  const { column = 1, padding = 8, minwidth = "50px", title, controlwidth, children, ...restProps } = props;

  return (
    <FormBoxGroupStyle className={classNames(BizClass.BoxGroup)} title={title}>
      {title ? <h2 className={BizClass.BoxGroupTxt}>{title}</h2> : null}
      <FormGroupStyle column={column} padding={padding} minwidth={minwidth} controlwidth={controlwidth} {...restProps}>
        {children}
      </FormGroupStyle>
    </FormBoxGroupStyle>
  );
}

FormBoxGroup.propTypes = {
  column: PropTypes.number,
  padding: PropTypes.number,
  minwidth: PropTypes.string,
  title: PropTypes.string,
  controlwidth: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Form.BoxGroup = FormBoxGroup;

function FormCustomGroup(props) {
  const { column, row, columntemplate, children, ...restProps } = props;

  return (
    <FormCustomGroupStyle column={column} row={row} columntemplate={columntemplate} {...restProps}>
      {children}
    </FormCustomGroupStyle>
  );
}

FormCustomGroup.propTypes = {
  column: PropTypes.number,
  row: PropTypes.number,
  columntemplate: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Form.CustomGroup = FormCustomGroup;

function FormInputGroup(props) {
  const { errorMsg, req, label, columnstart, rowstart, column, row = 0, children, ...restProps } = props;

  return (
    <div className={classNames(BizClass.InputGroupBox, errorMsg ? BizClass.InputErrorMsgBox : null, row ? BizClass.ControlRowSpan : null)}>
      {label ? (
        <InputLabelStyle
          className={classNames(BizClass.InputLabel, req === "true" ? BizClass.InputReqLabel : null)}
          columnstart={columnstart}
          rowstart={rowstart}
          column={column}
          row={row}
        >
          {label}
        </InputLabelStyle>
      ) : null}
      <InputGroupStyle className={BizClass.InputGroup} columnstart={columnstart} rowstart={rowstart} column={column} row={row} {...restProps}>
        {children}
        {errorMsg ? <span className={BizClass.ErrorMsg}>{errorMsg}</span> : null}
      </InputGroupStyle>
    </div>
  );
}

Form.InputGroup = FormInputGroup;

FormInputGroup.propTypes = {
  errorMsg: PropTypes.string,
  req: PropTypes.string,
  label: PropTypes.string,
  columnstart: PropTypes.number,
  rowstart: PropTypes.number,
  column: PropTypes.number,
  row: PropTypes.number,
  children: PropTypes.node.isRequired,
};

const FormInputControl = React.forwardRef((props, ref) => {
  const { control, className, label = "", focus, isClearable, isSearchable, menuPlacement, noOptionsMessage, styles, width, prefix, ...restProps } = props;

  const firstFormInput = useRef();

  useEffect(() => {
    if (firstFormInput.current) {
      firstFormInput.current.focus();
    }
  }, [focus]);

  let InputControl = "";
  switch (control) {
    case "input":
      InputControl = (
        <input className={classNames(BizClass.InputControl, className)} placeholder={label} ref={focus === "true" ? firstFormInput : ref} {...restProps} />
      );
      break;
    case "textarea":
      InputControl = (
        <textarea
          className={classNames(BizClass.InputControl, className)}
          placeholder={label}
          style={{ resize: "none" }}
          ref={focus === "true" ? firstFormInput : ref}
          {...restProps}
        />
      );
      break;
    case "select":
      InputControl = (
        <div style={{ width: width || null }}>
          <Select
            {...restProps}
            ref={focus === "true" ? firstFormInput : ref}
            classNamePrefix="BizN__"
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuShouldScrollIntoView={false}
            styles={styles || ReactSelectStyle}
            menuPlacement={menuPlacement || "auto"}
            isClearable={isClearable || true}
            isSearchable={isSearchable || true}
            placeholder={prefix === false ? label : `Select ${label}`}
            noOptionsMessage={() => noOptionsMessage || "No Result Found"}
          />
        </div>
      );
      break;
    case "selectBigOptions":
      InputControl = (
        <div style={{ width: width || null }}>
          <Select
            {...restProps}
            ref={focus === "true" ? firstFormInput : ref}
            classNamePrefix="BizN__"
            menuPortalTarget={document.body}
            menuPosition="absolute"
            menuShouldScrollIntoView={false}
            styles={styles || ReactSelectStyleBigOptions}
            menuPlacement={menuPlacement || "top"}
            isClearable={isClearable || true}
            isSearchable={isSearchable || true}
            placeholder={prefix === false ? label : `Select ${label}`}
            noOptionsMessage={() => noOptionsMessage || "No Result Found"}
          />
        </div>
      );
      break;
    case "multiselect":
      InputControl = (
        <Select
          {...restProps}
          isMulti
          ref={focus === "true" ? firstFormInput : ref}
          classNamePrefix="BizN__"
          menuPortalTarget={document.body}
          menuPosition="absolute"
          menuShouldScrollIntoView={false}
          styles={styles || ReactMultiSelectStyle}
          menuPlacement={menuPlacement || "auto"}
          isClearable={isClearable || true}
          isSearchable={isSearchable || true}
          placeholder={prefix === false ? label : `Select ${label}`}
          noOptionsMessage={() => noOptionsMessage || "No Result Found"}
        />
      );
      break;
    case "checkbox":
      InputControl = <input className={classNames(className)} type="checkbox" ref={focus === "true" ? firstFormInput : ref} {...restProps} />;
      break;
    case "radio":
      InputControl = <input className={classNames(className)} type="radio" ref={focus === "true" ? firstFormInput : ref} {...restProps} />;
      break;
    case "switch":
      InputControl = (
        <label className={BizClass.Switch}>
          <input className={classNames(BizClass.Switch_input, className)} type="checkbox" ref={focus === "true" ? firstFormInput : ref} {...restProps} />
          <span className={BizClass.Switch_label} />
          <span className={BizClass.Switch_handle} />
        </label>
      );
      break;
    default:
      break;
  }

  return InputControl;
});

Form.InputControl = FormInputControl;

FormInputControl.propTypes = {
  control: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  focus: PropTypes.string,
  isClearable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  menuPlacement: PropTypes.string,
  noOptionsMessage: PropTypes.string,
  styles: PropTypes.node,
  width: PropTypes.string,
  prefix: PropTypes.string,
};
