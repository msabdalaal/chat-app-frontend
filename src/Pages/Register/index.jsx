import { useContext, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import Joi from "joi";
import { POST } from "../../api/axios";
import { MainContext } from "../../Contexts/MainContext";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2"; // Using Grid2 syntax from example
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";

const initialValue = {
  name: "",
  email: "",
  password: "",
  repeatPassword: "",
  agree: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "name":
      return { ...state, name: action.payload };
    case "email":
      return { ...state, email: action.payload };
    case "password":
      return { ...state, password: action.payload };
    case "repeat-password":
      return { ...state, repeatPassword: action.payload };
    case "agree":
      return { ...state, agree: action.payload };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export default function Register() {
  const { setLogged, loading, setLoading, setLoggedUser, mainColor } =
    useContext(MainContext);
  const [state, dispatch] = useReducer(reducer, initialValue);
  const [clientErrors, setClientErrors] = useState([]);
  const [serverErrors, setServerErrors] = useState("");

  function validateData() {
    const schema = Joi.object({
      name: Joi.string()
        .trim()
        .pattern(/^[a-zA-Z\s]+$/) // Allows only alphabetic characters and spaces
        .min(3)
        .max(30)
        .required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%?&])[A-Za-z\\d@$!%?&]{8,}$"
          )
        )
        .required()
        .messages({
          "string.pattern.base":
            "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
        }),
      repeatPassword: Joi.any().valid(Joi.ref("password")).required().messages({
        "any.only": "Passwords do not match",
      }),
      agree: Joi.boolean().valid(true).required().messages({
        "any.only": "Please agree with privacy policy & terms",
      }),
    });
    return schema.validate(state, { abortEarly: false });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { error } = validateData();
    if (error) {
      setServerErrors("");
      setClientErrors(error.details);
    } else {
      setClientErrors([]);
      const payload = {
        name: state.name,
        email: state.email,
        password: state.password,
      };
      setLoading(true);
      POST("/api/users/register", payload)
        .then((res) => {
          if (res.data.success) {
            setLogged(true);
            setLoggedUser(res.data.data);
          }
        })
        .catch((errMessage) => {
          setClientErrors([]);
          setServerErrors(errMessage);
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#FAFAFA", // Off white background
      }}
    >
      <Box
        width={{ xs: "100%", md: "50%" }}
        mx="auto"
        boxShadow={3}
        p={4}
        borderRadius={2}
        bgcolor="#ffffff" // White background for the form
      >
        {serverErrors && (
          <Typography color="error" variant="body2" align="center" my={2}>
            {serverErrors}
          </Typography>
        )}
        {clientErrors.length > 0 &&
          clientErrors.map((err, i) => (
            <Typography
              key={i}
              color="error"
              variant="body2"
              align="center"
              my={1}
            >
              {err.message}
            </Typography>
          ))}
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" mb={2} align="center" color="#333333">
            Register
          </Typography>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid size={6}>
              <TextField
                label="Full Name"
                variant="outlined"
                value={state.name}
                onChange={(event) =>
                  dispatch({ type: "name", payload: event.target.value })
                }
                sx={{
                  backgroundColor: "#E8E8E8", // Light gray background for input
                  borderRadius: "4px",
                  width: "100%",
                }}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Email Address"
                variant="outlined"
                value={state.email}
                onChange={(event) =>
                  dispatch({ type: "email", payload: event.target.value })
                }
                sx={{
                  backgroundColor: "#E8E8E8", // Light gray background for input
                  borderRadius: "4px",
                  width: "100%",
                }}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={state.password}
                onChange={(event) =>
                  dispatch({ type: "password", payload: event.target.value })
                }
                sx={{
                  backgroundColor: "#E8E8E8", // Light gray background for input
                  borderRadius: "4px",
                  width: "100%",
                }}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Repeat Password"
                variant="outlined"
                type="password"
                value={state.repeatPassword}
                onChange={(event) =>
                  dispatch({
                    type: "repeat-password",
                    payload: event.target.value,
                  })
                }
                sx={{
                  backgroundColor: "#E8E8E8", // Light gray background for input
                  borderRadius: "4px",
                  width: "100%",
                }}
              />
            </Grid>
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.agree}
                    onChange={(event) =>
                      dispatch({ type: "agree", payload: event.target.checked })
                    }
                    sx={{ color: mainColor }} // Primary color for checkbox
                  />
                }
                label={
                  <>
                    I agree with{" "}
                    <Link to="#" style={{ color: mainColor }}>
                      Privacy policy & terms
                    </Link>
                  </>
                }
              />
            </Grid>
            <Grid size={12}>
              {loading ? (
                <CircularProgress mx="auto" />
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: mainColor, // Primary color for button
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#5BC0BE", // Accent color on hover
                    },
                    width: "100%",
                  }}
                  size="large"
                >
                  Account Register
                </Button>
              )}
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Typography align="center" color="#333333">
            OR SIGN UP WITH
          </Typography>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            mt={2}
          >
            <Grid size={6}>
              <Button
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faGoogle} />}
                sx={{
                  color: "#333333", // Text color
                  borderColor: mainColor, // Primary border color
                  "&:hover": {
                    backgroundColor: "#5BC0BE", // Soft green background on hover
                    color: "white",
                  },
                  width: "100%",
                }}
              >
                Google
              </Button>
            </Grid>
            <Grid size={6}>
              <Button
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faFacebook} />}
                sx={{
                  color: "#333333", // Text color
                  borderColor: mainColor, // Primary border color
                  "&:hover": {
                    backgroundColor: "#5BC0BE", // Soft green background on hover
                    color: "white",
                  },
                  width: "100%",
                }}
              >
                Facebook
              </Button>
            </Grid>
          </Grid>
          <Box mt={3} textAlign="center">
            <Typography color="#333333">
              Already have an account?{" "}
              <Link to="/" style={{ color: mainColor }}>
                Login
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
