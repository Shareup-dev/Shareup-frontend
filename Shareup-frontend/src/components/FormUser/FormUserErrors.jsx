import styled from "styled-components";

const ErrorContainer = styled.div`
  text-align: center;
  vertical-align: middle;
  grid-area: formError;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const ErrorText = styled.p`
  text-align: center;
  vertical-align: middle;
  color: red;
  font-size: 12px;
`;

const FormUserErrors = ({ errors = [] }) => {
  return (
    <ErrorContainer>
      {errors.map((error, index) => (
        <ErrorText key={index}>* {error}</ErrorText>
      ))}
    </ErrorContainer>
  );
};

export default FormUserErrors;
