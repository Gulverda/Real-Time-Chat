import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import PropTypes from "prop-types";

import ProfileIcon from "../../assets/Profile.svg";
import ExitIcon from "../../assets/Exit.svg";
import logo from "../../assets/LogoL.png";


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex justify-center w-full items-center bg-[#5D5FEF]">
      <div className="container flex justify-center max-w-[1440px]">
        <div className="relative z-10 flex items-center justify-between w-full">
          {/* Logo */}
          <div className="px-4">
            <Link to="/" className="w-full py-5 flex gap-3 items-center">
              <img
                // src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-white.svg"
                src={logo}
                alt="logo"
                className="block w-15 h-10"
              />
                <h1 className="w-[130px] font-semibold text-[#E1E2FF] text-[18px]">
                Online Chat
                </h1>
            </Link>
          </div>

          <div className="flex w-full items-center justify-between px-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className={`absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden ${
                open ? "navbarTogglerActive" : ""
              }`}
            >
              <span className="block h-[2px] w-[30px] bg-[#f5f5f5] my-[6px]"></span>
              <span className="block h-[2px] w-[30px] bg-[#f5f5f5] my-[6px]"></span>
              <span className="block h-[2px] w-[30px] bg-[#f5f5f5] my-[6px]"></span>
            </button>

            {/* Navigation */}
            <nav
              className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none lg:bg-transparent ${
                open ? "text-black" : "text-white hidden"
              }`}
            >
              <ul className="block lg:flex">
            
              </ul>

              {/* Authentication Buttons for Mobile */}
              <div className="mt-4 flex flex-col gap-3 lg:hidden">
              {user && (
                  <Link to="/profile">
                    <h2 className="px-7 py-3 text-center text-base w-full font-medium text-[#5D5FEF] border border-[#A5A6F6] bg-[#FDFDFF] hover:bg-[#A5A6F6] hover:text-[#FDFDFF] rounded-md transition-all duration-200">Profile</h2>
                    {/* <img src={ProfileIcon} alt="Profile Icon" className="w-6 h-6 items-center flex justify-center" /> */}
                  </Link>
              )}
                {user ? (
                  <button
                    onClick={logout}
                    className="px-7 py-3 text-base font-medium border border-red-600 text-red-600 bg-[#FDFDFF] hover:bg-red-600 hover:text-[#FDFDFF] rounded-md transition-all duration-200"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="py-3 text-center text-base font-medium text-black hover:text-white border rounded-[8px] border-solid border-[#5D5FEF] hover:bg-[#5D5FEF]"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-primary py-3 text-center text-base font-medium text-black hover:text-white hover:bg-[#5D5FEF] border rounded-[8px] border-solid border-[#5D5FEF]"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>

            {/* Authentication Buttons for Desktop */}
            <div className="hidden lg:flex justify-end">
            {user && (
                <div className="flex w-[80px] items-center gap-[12px]">
                  <Link to="/profile">
                    <img src={ProfileIcon} alt="Profile Icon" className="w-6 h-6 items-center flex justify-center" />
                  </Link>
                </div>
              )}

              {user ? (
                <button
                  onClick={logout}
                  className="px-7 py-3 text-base font-medium rounded-md transition-all duration-200"
                  >
                    <img src={ExitIcon} alt="Exit Icon" className="w-8 h-8 items-center flex justify-center" />
                    </button>
              ) : (
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="py-3 w-[70px] text-base font-medium text-white hover:text-blue-200"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-md w-[70px] bg-primary py-3 text-base font-medium text-white hover:text-blue-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

// List Item Component
const ListItem = ({ children, to }) => {
  return (
    <li>
      <Link
        to={to}
        className="flex py-2 text-base font-medium hover:text-blue-500 lg:ml-12 lg:inline-flex"
      >
        {children}
      </Link>
    </li>
  );
};

// PropTypes for ListItem
ListItem.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};
