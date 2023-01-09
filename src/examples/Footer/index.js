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

// prop-types is a library for typechecking of props
import { useAsyncEffect } from "ahooks";
import to from "await-to-js";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAccountFindOne } from "services/account";
import { getCustomerFindOne } from "services/customer";
import { updateAccountInfo } from "slices/accountSlice";
import { updateCustomerInfo } from "slices/customerSlice";

function Footer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useAsyncEffect(async () => {
    if (localStorage.getItem("token")) {
      const [err_1, res_1] = await to(getCustomerFindOne());
      if (err_1) {
        localStorage.clear();
        navigate("/authentication/sign-in");
        return;
      }
      const customer = res_1?.data?.data?.customer || {};
      dispatch(updateCustomerInfo(customer));

      const [, res_2] = await to(getAccountFindOne(customer?.id));
      const accounts = res_2?.data?.data || [];
      dispatch(updateAccountInfo({ data: accounts }));
    }
  }, [localStorage.getItem("token")]);

  return null;
}

// Setting default values for the props of Footer
Footer.defaultProps = {
  company: { href: "https://www.creative-tim.com/", name: "Creative Tim" },
  links: [
    { href: "https://www.creative-tim.com/", name: "Creative Tim" },
    { href: "https://www.creative-tim.com/presentation", name: "About Us" },
    { href: "https://www.creative-tim.com/blog", name: "Blog" },
    { href: "https://www.creative-tim.com/license", name: "License" },
  ],
};

// Typechecking props for the Footer
Footer.propTypes = {
  company: PropTypes.objectOf(PropTypes.string),
  links: PropTypes.arrayOf(PropTypes.object),
};

export default Footer;
