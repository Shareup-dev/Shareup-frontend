import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faKey, faCheck } from "@fortawesome/free-solid-svg-icons";
import UserService from "../../services/UserService";
import AuthService from "../../services/auth.services";



const formSchema = {
  firstName: {
    type: "text",
    name: "firstName",
    value: "",
    errors: "",
    placeholder: "First Name",
    icon: <FontAwesomeIcon icon={faUser} />,
  },
  lastName: {
    type: "text",
    name: "lastName",
    value: "",
    errors: "",
    placeholder: "Last Name",
    icon: <FontAwesomeIcon icon={faUser} />,
  },
  email: {
    type: "email",
    name: "email",
    value: "",
    errors: "",
    placeholder: "Email",
    icon: <FontAwesomeIcon icon={faEnvelope} />,
  },
  password: {
    type: "password",
    name: "password",
    value: "",
    errors: "",
    placeholder: "Password",
    icon: <FontAwesomeIcon icon={faKey} />,
  },
  passwordConfirm: {
    type: "password",
    name: "passwordConfirm",
    value: "",
    errors: "",
    placeholder: "Re-enter Password",
    icon: <FontAwesomeIcon icon={faKey} />,
  },
  checkBoxTerms: {
    type: "checkbox",
    name: "checkBoxTerms",
    value: false,
    errors: "",
    placeholder: "Accepts terms and conditions",
    icon: <FontAwesomeIcon icon={faCheck} />,
  },
  checkBoxAgeOver18: {
    type: "checkbox",
    name: "checkBoxAgeOver18",
    value: false,
    errors: "",
    placeholder: "I am 18 years old or above",
    icon: <FontAwesomeIcon icon={faCheck} />,
  },
};

const useFormHook = ({ formType }) => {
  const [content, setContent] = useState({ ...formSchema });
  const [formErrors, setFormErrors] = useState([]);
  const [statusSubmit, setStatusSubmit] = useState({
    ok: true,
    loading: false,
    message: "",
  });

  const [isHandleChanged, setIsHandleChange] = useState(false);

  
  const handleChangeContent = (event) => {
    setIsHandleChange(true);
    const { name, value, checked } = event.target;

    const isCheckBoxClicked = name === "checkBoxTerms" || name === "checkBoxAgeOver18";

    if (isCheckBoxClicked) console.log("handle change", { name, checked });
    if (!isCheckBoxClicked) console.log("handle change", { name, value });

    if (isCheckBoxClicked) contentUpdate(name, checked);
    if (!isCheckBoxClicked) contentUpdate(name, value);
  };

  const contentUpdate = (inputName, value, isError = false) => {
    setContent((currentContent) => {
      const contentCopy = { ...currentContent };
      if (!isError) contentCopy[inputName] = { ...contentCopy[inputName], value: value };
      if (isError) contentCopy[inputName] = { ...contentCopy[inputName], error: value };

      return contentCopy;
    });
  };

  const contentValidate = () => {
    setFormErrors([]);
    if (isHandleChanged) {
      let newArray = [];

      const isRegister = formType === "register";

      const hasFirstNameOrLastName = content.firstName.value.length > 0 && content.lastName.value.length > 0;
      const hasEmail = content.email.value.length > 0;
      const isEmailFormCorrect = content.email.value.includes("@");
      const hasPassword = content.password.value.length > 0;
      const isPasswordConfirmEqualToPassword = content.password.value === content.passwordConfirm.value;

      if (!hasFirstNameOrLastName && isRegister) newArray.push("Please fill first and last name.");
      if (!isPasswordConfirmEqualToPassword && isRegister) newArray.push("Password not matching.");

      if (!hasEmail) newArray.push("Please fill email.");
      if (!isEmailFormCorrect) newArray.push("Incorrect email format.");
      if (!hasPassword) newArray.push("Please fill password.");
      if ((!content.checkBoxAgeOver18.value && isRegister) || (!content.checkBoxTerms.value && isRegister))
        newArray.push("Please tick check boxes.");

      setFormErrors((currentErrors) => [...currentErrors, ...newArray]);
      return newArray.length > 0;
    }
  };

  const contentRegister = async () => {
    let user = {
      email: content.email.value,
      password: content.password.value,
      firstName: content.firstName.value,
      lastName: content.lastName.value,
    };
    try {
      let userResponse = await UserService.createUser(user);
      console.log("userResponse", userResponse);
      return userResponse;
    } catch (userError) {
      return userError.response;
    }
  };

  const contentLogin = async () => {
    let user = {
      email: content.email.value,
      password: content.password.value,
    };

    try {
      let authResponse = await AuthService.login(user.email, user.password);
      console.log("authResponse", authResponse);

      return authResponse;
    } catch (authError) {
      return authError.response;
    }
  };

  const handleSubmission = async (event) => {
    event.preventDefault();

    const isRegister = formType === "register";
    const hasFormErrors = contentValidate();
    let submitResponse;
    let submitMsg;

    if (hasFormErrors) return console.log("fix errors first", formType, content);

    setStatusSubmit({ ok: false, loading: true, message: "" });
    setIsHandleChange(false);

    if (isRegister) {
      submitResponse = await contentRegister();
      console.log("submitResponse Register", submitResponse);
    }
    if (!isRegister) {
      submitResponse = await contentLogin();
      console.log("submitResponse Login", submitResponse);
    }

    if (submitResponse.status !== 200 && !isRegister)
      submitMsg = `Code: ${submitResponse.status}. ${"Login failed. Please check username and password."}`;
    if (submitResponse.status !== 200 && isRegister)
      submitMsg = `Code: ${submitResponse.status}. ${submitResponse.data}`;

    if (submitResponse.status === 200 && isRegister)
      submitMsg = `Code: ${submitResponse.status}. "Registered successfully"`;
    if (submitResponse.status === 200 && !isRegister) {
      submitMsg = `Code: ${submitResponse.status}. "Logged in successfully"`;
      window.location.reload();
    }

    setStatusSubmit({
      ok: submitResponse.status === 200,
      loading: false,
      message: submitMsg,
    });

    setContent({ ...formSchema });
  };

  useEffect(() => {
    console.log("statusSubmit", statusSubmit);
  }, [statusSubmit]);

  useEffect(() => {
    if (isHandleChanged) contentValidate();
    console.log("content update", content);
  }, [content]);

  useEffect(() => {
    console.log("@FormHook", formType);
  }, [formType]);

  return {
    formErrors,
    content,
    statusSubmit,
    handleChangeContent,
    handleSubmission,
  };
};

export default useFormHook;
