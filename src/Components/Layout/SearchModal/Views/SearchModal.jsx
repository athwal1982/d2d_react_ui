import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";
import SearchModalLogic from "../Logic/SearchModalLogic";
import MenuList from "../../Sidebar/Data/MenuList";
import "./SearchModal.scss";

function SearchModal({ setOpenSearchModal }) {
  const { firstTextInput, search, setSearch, onClickSearchItem, setAllSearchedItem, handleSearchChange, handleKeyDown } = SearchModalLogic();

  useEffect(() => {
    const filteredMenuData = MenuList.filter((data) => data.submenu === false);

    const filteredSubMenuData = MenuList.filter((data) => data.submenu.length > 0);

    const filteredData = [...filteredMenuData, ...filteredSubMenuData[0].submenu];

    const mappedData = filteredData.map((data) => {
      return {
        ...data,
        ref: React.createRef(),
      };
    });

    setAllSearchedItem(mappedData);
    setSearch({
      ...search,
      result: mappedData,
    });

    if (firstTextInput.current) {
      firstTextInput.current.focus();
    }
  }, []);

  return (
    <>
      <button type="button" className="DynBiz_SearchPopup_overlay" onClick={() => setOpenSearchModal(false)} />
      <div className="DynBiz_SearchPopup">
        <div className="DynBiz_SearchPopup_ContentBox">
          <header className="DynBiz_SearchPopup_Header">
            <input
              className="DynBiz_SearchPopup_SearchBox"
              onKeyDown={(e) => handleKeyDown(e, setOpenSearchModal)}
              ref={firstTextInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search..."
            />
            <button type="button" className="DynBiz_SearchPopup_HeaderCloseBtn" onClick={() => setOpenSearchModal(false)}>
              <FaTimes className="DynBiz_SearchPopup_Icon" />
            </button>
          </header>
          <ul className="DynBiz_SearchPopup_ListBox">
            {search &&
              search.result &&
              search.result.length > 0 &&
              search.result.map((data, i) => {
                return (
                  <button
                    type="button"
                    ref={data.ref}
                    key={i}
                    className={search.cursor === i ? "DynBiz_SearchPopup_List DynBiz_SearchPopup_ActiveList" : "DynBiz_SearchPopup_List"}
                    onClick={() => onClickSearchItem(data, setOpenSearchModal)}
                  >
                    <p>{data.name}</p>
                    <div className="DynBiz_SearchPopup_ModulePathBox" />
                  </button>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default SearchModal;

SearchModal.propTypes = {
  setOpenSearchModal: PropTypes.func.isRequired,
};
