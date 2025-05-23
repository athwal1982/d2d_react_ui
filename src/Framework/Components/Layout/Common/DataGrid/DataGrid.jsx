import React from "react";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import "ag-grid-enterprise";
import classNames from "classnames";
import { PropTypes } from "prop-types";
import "./DataGrid.scss";

function DataGrid(props) {
  const { className, children, loader, ...restProps } = props;

  return (
    <div className={classNames("AGDataGrid", "ag-theme-blue", className)}>
      {loader !== false ? loader : null}
      <AgGridReact
        enableRangeSelection
        rowSelection="multiple"
        defaultColDef={{
          sortable: true,
          resizable: true,
          enableRowGroup: true,
          enablePivot: true,
          enableValue: true,
          children: true,
        }}
        {...restProps}
      >
        {children}
      </AgGridReact>
    </div>
  );
}

export default DataGrid;

const DataGridColumn = React.forwardRef((props, ref) => {
  const { ...restProps } = props;
  return <AgGridColumn {...restProps} ref={ref} />;
});

DataGrid.Column = DataGridColumn;

DataGrid.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  loader: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]).isRequired,
};
