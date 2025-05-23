import styled from "styled-components";

export const FormStyle = styled.div`
  &&& {
    padding: 8px;
    display: grid;
    row-gap: 18px;
    grid-auto-rows: max-content;
  }
`;

export const FormGroupStyle = styled.div`
  &&& {
    display: grid;
    grid-template-columns: repeat(
      ${(props) => props.column},
      [label] minmax(${(props) => props.minwidth}, max-content) [input]
        ${(props) => (props.controlwidth ? `minmax(80px, ${props.controlwidth})` : "minmax(120px, 180px)")}
    );
    grid-gap: 8px;
    align-items: center;
    grid-auto-rows: max-content;
    padding: ${(props) => props.padding}px;
  }
`;

export const FormBoxGroupStyle = styled.div`
  &&& {
    border-top: ${(props) => (props.title ? "0px" : null)};
  }
`;

export const FormCustomGroupStyle = styled.div`
  &&& {
    display: grid;
    grid-template-columns: ${(props) => props.columntemplate};
    grid-column: span ${(props) => props.column};
    grid-row: span ${(props) => props.row};
    grid-gap: 12px;
  }
`;

export const InputLabelStyle = styled.label`
  &&& {
    grid-column-start: ${(props) => props.columnstart};
    grid-row-start: ${(props) => props.rowstart};
    grid-row: span ${(props) => props.row};
  }
`;

export const InputGroupStyle = styled.div`
  &&& {
    grid-column: span ${(props) => props.column};
    grid-row: span ${(props) => props.row};
    grid-row-start: ${(props) => props.rowstart};
    ${(props) => (props.row ? "grid-template-rows:  auto max-content;" : null)}
  }
`;
