import React, { useEffect, useRef } from "react";
import Select from "react-select";
import { PageBarSelectStyle } from "Framework/Assets/Styles/Widgets/SelectStyle/SelectStyle";
import classNames from "classnames";
import { PropTypes } from "prop-types";
import BizClass from "./PageBar.module.scss";

function PageBar(props) {
  const { children, ...restProps } = props;

  return (
    <div className={BizClass.PageBar} {...restProps}>
      {children}
    </div>
  );
}

export default PageBar;

PageBar.propTypes = {
  children: PropTypes.node,
};

const PageSelect = React.forwardRef((props, ref) => {
  const { label = "", ...restProps } = props;

  return (
    <Select
      {...restProps}
      ref={ref}
      menuPlacement="auto"
      openMenuOnFocus
      isClearable
      menuPosition="absolute"
      menuPortalTarget={document.body}
      isSearchable
      className={BizClass.DynBiz_PageTitle_Select}
      placeholder={`Select ${label}`}
      styles={PageBarSelectStyle}
      menuShouldScrollIntoView={false}
      noOptionsMessage={() => "No Result Found"}
    />
  );
});

PageBar.Select = PageSelect;

PageSelect.propTypes = {
  label: PropTypes.string,
};

const PageSearch = React.forwardRef((props, ref) => {
  const { onClick, focus, btnText = "Search", label = "Search", className, disabled = false, ...restPropsProps } = props;

  const firstSearchInput = useRef();

  useEffect(() => {
    if (firstSearchInput.current) {
      firstSearchInput.current.focus();
    }
  }, [focus]);

  const ButtonClickFunction = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      ButtonClickFunction();
    }
  };

  return (
    <div className={BizClass.DynBiz_PageTitle_SearchBox} ref={ref}>
      <input
        type="text"
        placeholder={label}
        className={BizClass.DynBiz_PageTitle_SearchInputBox}
        ref={focus === "true" ? firstSearchInput : null}
        onKeyDown={(e) => handleKeyDown(e)}
        disabled={disabled}
        {...restPropsProps}
      />
      <button type="button" className={BizClass.DynBiz_PageTitle_SearchBoxBtn} onClick={() => ButtonClickFunction()} disabled={disabled}>
        {btnText}
      </button>
    </div>
  );
});

PageBar.Search = PageSearch;

PageSearch.propTypes = {
  onClick: PropTypes.func.isRequired,
  focus: PropTypes.string,
  btnText: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

const PageButton = React.forwardRef((props, ref) => {
  const { loader, className, children, ...restProps } = props;

  return (
    <button type="button" className={BizClass.DynBiz_PageTitle_Btn} ref={ref} {...restProps}>
      {loader === true ? (
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
});

PageBar.Button = PageButton;

PageButton.propTypes = {
  loader: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
};

const PageInput = React.forwardRef((props, ref) => {
  const { className, ...restProps } = props;

  return <input className={classNames(BizClass.DynBiz_PageTitle_Input, className)} ref={ref} {...restProps} />;
});

PageBar.Input = PageInput;

PageInput.propTypes = {
  className: PropTypes.string,
};

const PageExcelButton = React.forwardRef((props, ref) => {
  const { loader, className, children, ...restProps } = props;

  return (
    <button type="button" className={BizClass.DynBiz_PageTitle_ExcelBtn} ref={ref} {...restProps}>
      {loader === true ? (
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
});

PageBar.ExcelButton = PageExcelButton;

PageExcelButton.propTypes = {
  loader: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
};
