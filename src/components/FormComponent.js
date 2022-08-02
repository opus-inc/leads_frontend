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
  FormControlLabel,
  Switch,
  Typography,
} from "@material-ui/core";
import styled, { useTheme } from "styled-components";
import MuiPhoneNumber from "./PhoneInput";
import useWindowSize from "../hooks/useWindowSize";
import { cpfMask } from "../helpers/cpfMask";
import { Autocomplete } from "@mui/material";

const FieldItemComponent = ({ state, setState, field, index }) => {
  const { name, placeholder, type, label, options, required, disabled, condition } = field;
  
  if(condition) {
    if(!condition()) {
      return <></>
    }
  }

  return (
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
      ) : type === "autocomplete" ? (
        <Autocomplete
          disablePortal
          disabled={disabled}
          id={`mui-autocomplete-${name}`}
          options={options}
          sx={{ minWidth: 120 }}
          renderInput={(params) => <TextField {...params} label={label} />}
          value={state[name]}
          // renderOption={(option) => option.label}
          getOptionLabel={(option) => {
            console.log(option);
            if(typeof option === "string") {
              return options.find(opt => opt.id === option)?.label ?? ""
            } else {
              return option.label
            }
          }}
          onChange={(e, newValue) => {
            let temp = { ...state };
            temp[name] = newValue.id;
            setState({ ...temp });
          }}
        />
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
      ) : type === "radio" ? (
        <FormControlLabel
          control={
            <Switch
              checked={state[name]}
              onChange={(e) => {
                let temp = { ...state };
                temp[name] = e.target.checked;
                setState(temp);
              }}
              name={name}
              id={name}
              color="primary"
              size="small"
            />
          }
          label={
            <Typography style={{ fontSize: "0.75rem" }}>
              {label}
            </Typography>
          }
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
          {...(options && { ...options })}
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
}

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
          field,
          index
        ) => (
          <FieldItemComponent 
            state={state}
            setState={setState}
            field={field}
            index={index}
          />
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
