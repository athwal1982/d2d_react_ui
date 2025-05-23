import React from "react";
import Split from "react-split-grid";
import styled from "styled-components";
import PropTypes from "prop-types";
import BizClass from "./Splitter.module.scss";

function Splitter(props) {
  const { varient, template, children } = props;

  return (
    <Split
      render={({ getGridProps, getGutterProps }) => (
        <SplitterDash className={BizClass.Splitter_Dash} {...getGridProps()} template={template} varient={varient}>
          {children && children[1] ? children[0] : null}
          {children && children[1]
            ? children.map((data, i) => {
                return (
                  <React.Fragment key={i}>
                    {varient === "column" ? <Splitter.Columm getGutterProps={getGutterProps} column={(i + 2 + i).toString()} /> : null}
                    {varient === "row" ? <Splitter.Row getGutterProps={getGutterProps} row={(i + 2 + i).toString()} /> : null}
                    {children[i + 1]}
                  </React.Fragment>
                );
              })
            : null}
        </SplitterDash>
      )}
    />
  );
}

export default Splitter;

Splitter.propTypes = {
  varient: PropTypes.string.isRequired,
  template: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function SplitterColumn(props) {
  const { column, getGutterProps } = props;
  return <ColumnSplitter className={BizClass.Grid_ColumnSplitter} {...getGutterProps("column", 1)} column={column} />;
}

Splitter.Columm = SplitterColumn;

SplitterColumn.propTypes = {
  column: PropTypes.string,
  getGutterProps: PropTypes.func,
};

function SplitterRow(props) {
  const { row, getGutterProps } = props;
  return <RowSplitter className={BizClass.Grid_RowSplitter} {...getGutterProps("row", 1)} row={row} />;
}

Splitter.Row = SplitterRow;

SplitterRow.propTypes = {
  row: PropTypes.number,
  getGutterProps: PropTypes.func,
};

const SplitterDash = styled.div`
  &&& {
    ${(props) => (props.varient === "column" ? `grid-template-columns:  ${props.template};` : null)}
    ${(props) => (props.varient === "row" ? `grid-template-rows:  ${props.template};` : null)}
  }
`;

const ColumnSplitter = styled.div`
  &&& {
    ${(props) => (props.column ? `grid-column:  ${props.column};` : null)}
  }
`;

const RowSplitter = styled.div`
  &&& {
    ${(props) => (props.row ? `grid-row:  ${props.row};` : null)}
  }
`;
