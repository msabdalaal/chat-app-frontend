import { useContext, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import Joi from "joi";
import { POST } from "../../api/axios";
import { MainContext } from "../../Contexts/MainContext";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2"; // Grid2 syntax as requested
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";

const initialValue = {
  email: "",
  password: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "email":
      return { ...state, email: action.payload };
    case "password":
      return { ...state, password: action.payload };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export default function Login() {
  const { setLogged, loading, setLoading, setLoggedUser, mainColor } =
    useContext(MainContext);
  const [state, dispatch] = useReducer(reducer, initialValue);
  const [errorMessage, setErrorMessage] = useState("");

  function validation() {
    const schema = Joi.object({
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
          "string.pattern.base": "Invalid Password",
        }),
    });
    return schema.validate(state, { abortEarly: true });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { error } = validation();
    if (error) {
      setErrorMessage(error.message);

      return;
    } else {
      setErrorMessage("");
    }
    const payload = {
      email: state.email,
      password: state.password,
    };

    setLogged(true);
    POST("/api/users/login", payload)
      .then((res) => {
        if (res.data.success) {
          setLoggedUser(res.data.data);
        }
      })
      .catch((err) => {
        setErrorMessage(err ? err : "An error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
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
        {errorMessage && (
          <Typography color="error" variant="body2" align="center" my={2}>
            {errorMessage}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" mb={2} align="center" color="#333333">
            Login
          </Typography>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid size={12}>
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
            <Grid size={12}>
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
            {/* <Grid size={12}>
              <Box display="flex" justifyContent="space-between">
                <Link to="/forgot-password">
                  <Typography variant="body2" color=mainColor>
                    Forgot Password?
                  </Typography>
                </Link>
              </Box>
            </Grid> */}
            <Grid size={12}>
              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: mainColor, // Primary color for the button
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#5BC0BE", // Accent color on hover
                    },
                    width: "100%",
                  }}
                  size="large"
                >
                  Account Login
                </Button>
              )}
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Typography align="center" color="#333333">
            OR LOGIN WITH
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
                  width: "100%",

                  "&:hover": {
                    backgroundColor: "#5BC0BE", // Soft green background on hover
                    color: "white",
                  },
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
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#5BC0BE", // Soft green background on hover
                    color: "white",
                  },
                }}
              >
                Facebook
              </Button>
            </Grid>
          </Grid>
          <Box mt={3} textAlign="center">
            <Typography color="#333333">
              Don&apos;t have an account?{" "}
              <Link to="/register" style={{ color: mainColor }}>
                Register
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
