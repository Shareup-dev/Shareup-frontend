import styled from "styled-components";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = styled.button`
  outline: 0;
  border: 0;
  grid-area: ${(props) => props.gridArea};
  border-radius: 24px;
  height: 36px;
  width: 75%;
  min-width: 140px;
  font-size: 18px;
  font-weight: bold;
  background-color: #8eb560;
  color: white;
  margin: 0 auto;

  font-family: "Poppins";
  letter-spacing: 2px;
  transition: all 0.1s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;

  box-shadow: -3px 10px 23px 5px rgba(0, 0, 0, 0.14);
  -webkit-box-shadow: -3px 10px 23px 5px rgba(0, 0, 0, 0.14);
  -moz-box-shadow: -3px 10px 23px 5px rgba(0, 0, 0, 0.14);

  &:active {
    color: #8eb560;
    background-color: white;
    transform: translateY(2px);
  }

  &:hover {
    border: 4px solid white;
  }

  & > svg {
    font-size: 24px;
    color: white;
    animation: loadingSpin 3s infinite linear;
  }

  @keyframes loadingSpin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const FormButton = ({ gridArea = "", text = "ShareIn", handleClick, showLoading = false }) => {
  return (
    <Button gridArea={gridArea} onClick={handleClick}>
      {text}
      {showLoading && <FontAwesomeIcon icon={faSpinner} />}
    </Button>
  );
};

export default FormButton;
