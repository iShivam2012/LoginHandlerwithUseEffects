import React, { useState, useEffect, useReducer, useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../store/auth-context";
import Input from "../UI/Input/Input";

const emailReducer = (state, action) => {
  if (action.type === "EMAIL_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  } else if (action.type === "EMAIL_VALID") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passReducer = (state, action) => {
  switch (action.type) {
    case "PASS_INPUT":
      return {
        passValue: action.val,
        isPassValid: action.val.trim().length > 6,
      };
      break;
    case "PASS_VALID":
      return {
        passValue: state.passValue,
        isPassValid: state.passValue.trim().length > 6,
      };
      break;
    default:
      return { passValue: "", isPassValid: false };
  }
};

const Login = () => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();

  const ctx = useContext(AuthContext);

  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, emailDispatch] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passState, passDispatch] = useReducer(passReducer, {
    passValue: "",
    isPassValid: null,
  });

  const { isValid } = emailState;
  const { isPassValid } = passState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("form validity");
      setFormIsValid(isValid && isPassValid);
    }, 500);
    return () => {
      clearTimeout(identifier);
    };
  }, [isValid, isPassValid]);

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    emailDispatch({ type: "EMAIL_INPUT", val: event.target.value });
    // setFormIsValid(event.target.value.includes("@") && passState.isPassValid);
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    passDispatch({ type: "PASS_INPUT", val: event.target.value });
    // setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(enteredEmail.includes("@"));
    emailDispatch({ type: "EMAIL_VALID" });
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    passDispatch({ type: "PASS_VALID" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    // props.onLogin(enteredEmail, enteredPassword);
    ctx.onLogin(emailState.value, passState.passValue);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          isValid={isValid}
          label="E-Mail"
          type="email"
          id="email"
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />

        <Input
          isValid={isPassValid}
          label="Password"
          type="password"
          id="password"
          value={passState.passValue}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />

        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
