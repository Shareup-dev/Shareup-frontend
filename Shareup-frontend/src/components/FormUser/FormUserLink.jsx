import styled from "styled-components";

const LinkStyle = styled.a`
  height: 100%;
  text-align: center;
  vertical-align: middle;
  grid-area: ${(props) => props.gridArea};
  font-size: 12px;
  font-family: "Roboto";
  outline: 0;
  text-decoration: none;
  color: #dbdada;
`;

const FormLink = ({ gridArea = "", text = "Submit", handleClick }) => {
  return (
    <LinkStyle href='#' gridArea={gridArea} onClick={handleClick}>
      {text}
    </LinkStyle>
  );
};

export default FormLink;
