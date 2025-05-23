import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchModalLogic() {
  const navigateTo = useNavigate();
  const [search, setSearch] = useState({
    cursor: 0,
    result: [],
  });

  const [allSearchedItem, setAllSearchedItem] = useState([]);
  const firstTextInput = useRef();

  const onClickSearchItem = (data, setOpenSearchModal) => {
    if (data) {
      navigateTo(data.url);
      setOpenSearchModal(false);
    }
  };

  const handleSearchChange = (val) => {
    const filteredData = allSearchedItem.filter((data) => {
      return data.name.toLowerCase().includes(val.toLowerCase());
    });
    setSearch({
      cursor: 0,
      result: filteredData,
    });
  };

  const handleKeyDown = (e, setOpenSearchModal) => {
    const { cursor, result } = search;
    if (e.keyCode === 38 && cursor > 0) {
      e.preventDefault();
      setSearch({
        ...search,
        cursor: search.cursor - 1,
      });
      const selectedData = search.result[search.cursor - 1];
      if (selectedData && selectedData.ref.current)
        selectedData.ref.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
    } else if (e.keyCode === 40 && cursor < result.length - 1) {
      e.preventDefault();
      setSearch({
        ...search,
        cursor: search.cursor + 1,
      });
      const selectedData = search.result[search.cursor + 1];
      if (selectedData && selectedData.ref.current)
        selectedData.ref.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
    } else if (e.keyCode === 13) {
      e.preventDefault();
      const selectedData = search.result[search.cursor];
      if (selectedData) {
        navigateTo(selectedData.url);
        setOpenSearchModal(false);
      }
    }
  };

  return { firstTextInput, search, setSearch, setAllSearchedItem, onClickSearchItem, handleSearchChange, handleKeyDown };
}

export default SearchModalLogic;
