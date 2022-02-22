import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  CircularProgress,
  NoSsr,
  Box,
} from "@material-ui/core";
import styled, { useTheme } from "styled-components";
import MuiPhoneNumber from "./PhoneInput";
import useWindowSize from "../hooks/useWindowSize";
import { cpfMask } from "../helpers/cpfMask";

const FormComponent = ({
  fields,
  onSubmit,
  width,
  state,
  setState,
  buttonText,
  loading,
  formId,
}) => {
  const theme = useTheme();
  const size = useWindowSize();

  return (
    <Form
      id={formId || "form"}
      onSubmit={onSubmit}
      width={width}
      style={{
        // width: `${width}%`,
        backgroundColor: "white",
        borderRadius: "8px",
        // padding: 25,
        // ...(size.width <= 480 && { paddingLeft: 25, paddingRight: 25 }),
        padding: 25,
        // paddingBottom: 25,
      }}
    >
      {fields.map(
        (
          { name, placeholder, type, label, options, required, disabled },
          index
        ) => (
          <ItemWrapper key={name + index} type={type}>
            {type === "select" ? (
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id={name}>{label}</InputLabel>
                <Select
                  labelId={name}
                  id={`select-${name}`}
                  required={required}
                  value={state[name]}
                  label={label}
                  onChange={(e) => {
                    let temp = { ...state };
                    temp[name] = e.target.value;
                    setState({ ...temp });
                  }}
                  variant="standard"
                  size="small"
                  disabled={disabled}
                >
                  <MenuItem selected value>
                    {placeholder}
                  </MenuItem>
                  {options &&
                    options.map(({ value, name }) => (
                      <MenuItem key={name} id={name} name={name} value={value}>
                        {name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            ) : type === "tel" ? (
              <NoSsr>
                <MuiPhoneNumber
                  defaultCountry={"br"}
                  style={{
                    marginBottom: 6,
                  }}
                  id={name}
                  type={type}
                  label={label}
                  placeholder={placeholder}
                  required={required}
                  disabled={disabled}
                  value={state[name]}
                  onChange={(e) => {
                    let temp = { ...state };
                    temp[name] = e;
                    setState(temp);
                  }}
                  variant="standard"
                />
              </NoSsr>
            ) : type === "cpf" ? (
              <TextField
                id={name}
                type={type}
                label={label}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                value={state[name]}
                onChange={(e) => {
                  let temp = { ...state };
                  temp[name] = cpfMask(e.target.value);
                  setState(temp);
                }}
                style={{
                  marginBottom: 6,
                }}
                variant="standard"
                {...((type === "date" ||
                  type === "datetime" ||
                  type === "datetime-local") && {
                  InputLabelProps: { shrink: true },
                })}
              />
            ) : (
              <TextField
                id={name}
                type={type}
                label={label}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                value={state[name]}
                onChange={(e) => {
                  let temp = { ...state };
                  temp[name] = e.target.value;
                  setState(temp);
                }}
                style={{
                  marginBottom: 6,
                }}
                variant="standard"
                {...((type === "date" ||
                  type === "datetime" ||
                  type === "datetime-local") && {
                  InputLabelProps: { shrink: true },
                })}
              />
            )}
          </ItemWrapper>
        )
      )}
      {buttonText && (
        <Button
          type="submit"
          variant="contained"
          value="Ativar"
          color="primary"
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading && <CircularProgress size="22px" color="white" />}
          {!loading && buttonText}
        </Button>
      )}
    </Form>
  );
};

FormComponent.defaultProps = {
  width: 100,
};

const Form = styled.form`
  display: grid;
  width: ${(props) => props.width}%;

  @media (max-width: 480px) {
    width: 80%;
  }

  @media (max-width: 625px) {
    width: 90%;
  }

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ type }) => (type === "checkbox" ? `flex-direction: row;` : ``)}
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`;
export default FormComponent;
