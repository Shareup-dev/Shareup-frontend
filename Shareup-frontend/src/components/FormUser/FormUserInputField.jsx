import styled from "styled-components";

const ContainerInput = styled.div`
  display: grid;
  border-radius: 8px;
  height: 40px;
  grid-area: ${(props) => props.gridArea};

  ${(props) => {
    if (props.type !== "checkbox")
      return `
    background-color: #dbdada;
    grid-template-columns: 48px auto;
    `;

    return `
    background-color: transparent;
    grid-template-columns: auto auto;
    padding: 0 16px;
  justify-content: center;
    gap: 8px;
    `;
  }};
`;

const Input = styled.input`
  margin: 0 !important;
  outline: 0;
  border: 0;
  background-color: transparent;
  height: 100%;
  padding-left: 8px;
  font-family: "Roboto";
  font-size: 16px;
`;

const ContainerIcon = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #726f6f;
`;

const CheckBoxText = styled.p`
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-family: "Roboto";
  color: #dbdada;
`;

const FormUserInputField = ({
  type = "text",
  icon = "",
  name = "",
  gridArea = "",
  placeholder = "",
  value = "",
  checked = true,
  handleChange,
  handleClick,
}) => {
  const isCheckBox = type === "checkbox";
  return (
    <ContainerInput gridArea={gridArea} type={type}>
      {!isCheckBox && <ContainerIcon>{icon}</ContainerIcon>}
      <Input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        defaultChecked={checked}
        checked={checked}
        onChange={handleChange}
        onClick={handleClick}
      />
      {isCheckBox && <CheckBoxText>{placeholder}</CheckBoxText>}
    </ContainerInput>
  );
};

export default FormUserInputField;
