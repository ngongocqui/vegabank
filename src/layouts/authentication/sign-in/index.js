/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import ReCAPTCHA from "react-google-recaptcha";
import { useReactive } from "ahooks";
import { message } from "antd";
import to from "await-to-js";
import { loginUser } from "services/auth";
import { useEffect } from "react";
import { getCustomerFindOne } from "services/customer";
import { updateCustomerInfo } from "slices/customerSlice";
import { getAccountFindOne } from "services/account";
import { updateAccountInfo } from "slices/accountSlice";
import { useDispatch } from "react-redux";

function Basic() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useReactive({
    email: "",
    password: "",
    captcha: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/transaction");
  }, [localStorage.getItem("token")]);

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ mt: 1, mb: 2 }}
          >
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={state.email}
                onChange={(e) => {
                  state.email = e.target.value;
                }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={state.password}
                onChange={(e) => {
                  state.password = e.target.value;
                }}
              />
            </MDBox>
            <ReCAPTCHA
              sitekey="6LcCJdwjAAAAAK1K7mXSps5QkJLuwn0K3zkdha17"
              onChange={(e) => {
                state.captcha = e;
              }}
            />
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={async () => {
                  if (!state.captcha) {
                    message.error("Bạn chưa chọn captcha!");
                    return;
                  }
                  if (!state.email) {
                    message.error("Bạn chưa nhập email!");
                    return;
                  }
                  if (!state.password) {
                    message.error("Bạn chưa nhập password!");
                    return;
                  }

                  const [err, res] = await to(
                    loginUser({
                      email: state.email,
                      password: state.password,
                    })
                  );
                  if (err) {
                    message.error(err?.response?.data?.message || err.message);
                    return;
                  }

                  const token = res?.data?.data?.token || "";
                  const refreshToken = res?.data?.data?.refreshToken || "";
                  const accessTokenExpires = res?.data?.data?.tokenExp || "";
                  localStorage.setItem("token", token);
                  localStorage.setItem("refreshToken", refreshToken);
                  localStorage.setItem("accessTokenExpires", accessTokenExpires);

                  const [, res_1] = await to(getCustomerFindOne());
                  const customer = res_1?.data?.data?.customer || {};
                  dispatch(updateCustomerInfo(customer));

                  const [, res_2] = await to(getAccountFindOne(customer?.id));
                  const accounts = res_2?.data?.data || [];
                  dispatch(updateAccountInfo({ data: accounts }));

                  message.success("Đăng nhập thành công");
                  navigate("/transaction");
                }}
              >
                sign in
              </MDButton>
            </MDBox>
            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Register
                </MDTypography>
              </MDTypography>
            </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
