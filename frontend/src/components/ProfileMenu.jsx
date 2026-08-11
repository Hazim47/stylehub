import { useState, useRef } from "react";

import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";

import { GoogleLogin } from "@react-oauth/google";

import API from "../api/axios";

import { useTranslation } from "react-i18next";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export default function ProfileMenu() {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const [confirmLogout, setConfirmLogout] = useState(false);

  const timer = useRef(null);

  const token = localStorage.getItem("token");

  const getUser = () => {
    try {
      const data = localStorage.getItem("user");

      if (!data || data === "undefined") {
        return null;
      }

      return JSON.parse(data);
    } catch {
      localStorage.removeItem("user");

      return null;
    }
  };

  const user = getUser();

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.reload();
  };

  const googleLogin = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      setOpen(false);
    } catch (error) {
      console.log("Google Login Error", error);
    }
  };

  return (
    <Box
      onMouseEnter={() => {
        clearTimeout(timer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        timer.current = setTimeout(() => {
          if (!confirmLogout) {
            setOpen(false);
          }
        }, 300);
      }}
      sx={{
        position: "relative",
        zIndex: 2000,
        direction: "inherit",
      }}
    >
      <IconButton
        sx={{
          width: {
            xs: 42,
            md: 50,
          },

          height: {
            xs: 42,
            md: 50,
          },

          border: "1px solid #ddd",

          padding: 0,

          overflow: "hidden",

          transition: "0.3s",

          "&:hover": {
            transform: "translateY(-3px)",

            background: "#000",
          },
        }}
      >
        {token && user?.picture ? (
          <Avatar
            src={user.picture}
            sx={{
              width: "100%",

              height: "100%",
            }}
          />
        ) : (
          <PersonOutlineOutlinedIcon
            sx={{
              fontSize: 32,

              color: "#000",
            }}
          />
        )}
      </IconButton>

      {open && (
        <Paper
          elevation={15}
          sx={{
            position: "absolute",

            top: "70px",

            insetInlineEnd: 0,

            width: {
              xs: 260,
              md: 290,
            },

            borderRadius: "25px",

            overflow: "hidden",

            zIndex: 5000,

            background: "#fff",

            direction: "inherit",
          }}
        >
          {token ? (
            <>
              <Box
                sx={{
                  background: "#000",

                  height: 80,
                }}
              />

              <Box
                sx={{
                  mt: -5,

                  textAlign: "center",

                  px: 3,
                }}
              >
                <Avatar
                  src={user?.picture}
                  sx={{
                    width: 90,

                    height: 90,

                    margin: "auto",

                    border: "5px solid white",

                    boxShadow: "0 5px 20px #ccc",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 20,

                    fontWeight: 800,

                    mt: 2,
                  }}
                >
                  {user?.name}
                </Typography>

                <Typography
                  sx={{
                    color: "#777",

                    fontSize: 14,

                    mt: 0.5,
                  }}
                >
                  {user?.email}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {confirmLogout ? (
                <Box
                  sx={{
                    px: 3,

                    pb: 3,

                    textAlign: "center",
                  }}
                >
                  <Typography fontWeight={700} mb={2}>
                    {t("profile.logoutConfirm")}
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={logout}
                    sx={{
                      borderRadius: 30,

                      background: "#000",

                      mb: 1,
                    }}
                  >
                    {t("profile.yesLogout")}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setConfirmLogout(false)}
                    sx={{
                      borderRadius: 30,
                    }}
                  >
                    {t("profile.cancel")}
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    px: 3,

                    pb: 3,
                  }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setConfirmLogout(true)}
                    sx={{
                      borderRadius: 30,

                      background: "#000",

                      "&:hover": {
                        background: "#222",
                      },
                    }}
                  >
                    {t("profile.logout")}
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box
              sx={{
                p: 3,

                textAlign: "center",
              }}
            >
              <Typography fontWeight={800} fontSize={20} mb={1}>
                {t("profile.welcome")}
              </Typography>

              <Typography color="gray" mb={3}>
                {t("profile.loginMessage")}
              </Typography>

              <GoogleLogin
                onSuccess={googleLogin}
                onError={() => console.log("Google Error")}
              />
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
