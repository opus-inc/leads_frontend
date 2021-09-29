import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@material-ui/core";
import styled, { useTheme } from "styled-components";

const FormComponent = ({
  fields,
  onSubmit,
  width,
  state,
  setState,
  buttonText,
}) => {
  const theme = useTheme();
  console.log(theme);
  return (
    <Form
      id="form"
      onSubmit={onSubmit}
      style={{
        width: `${width}%`,
        backgroundColor: "white",
        borderRadius: "8px",
        padding: 25,
      }}
    >
      {fields.map(
        ({ name, placeholder, type, label, options, required }, index) => (
          <ItemWrapper key={index} type={type}>
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
                    setState(temp);
                  }}
                  variant="standard"
                >
                  <MenuItem selected value>
                    {placeholder}
                  </MenuItem>
                  {options &&
                    options.map(({ value, name }) => (
                      <MenuItem key={name} value={value}>
                        {name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                id={name}
                type={type}
                label={label}
                placeholder={placeholder}
                required={required}
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
              />
            )}
          </ItemWrapper>
        )
      )}
      <Button type="submit" variant="contained" value="Ativar" color="primary">
        {buttonText}
      </Button>
    </Form>
  );
};

FormComponent.defaultProps = {
  width: 100,
};

const Form = styled.form`
  display: grid;
  width: 100%;
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
