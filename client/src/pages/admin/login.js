import { useEffect, useState } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { useNavigate } from "react-router-dom";
import AuthService from "../../service/usersApi";
import { HelmetProvider, Helmet } from "react-helmet-async";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDispatch, useSelector } from "react-redux";
import { authFailure, authStart, authSuccess } from "../../slice/auth";

export default function Login() {
  const { loggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [logPhone_number, setPhone_number] = useState("+998");
  const [logPassword, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem("rememberedUserName");
    const storedPassword = localStorage.getItem("rememberedPassword");

    if (storedUserName && storedPassword) {
      setPhone_number(storedUserName);
      setPassword(storedPassword);
      setRememberMe(true);
    }
    if (loggedIn) {
      navigate("/dashboard");
    }
  }, [loggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      phone_number: logPhone_number,
      password: logPassword,
    };
    dispatch(authStart());
    try {
      const response = await AuthService.userLogin(user);
      console.log(response);

      dispatch(authSuccess(response));
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data.errors;

      dispatch(authFailure(errorMessage));

      console.error(
        "Xatolik tafsiloti:",
        error.response?.data.errors || error.message,
      );
    }
  };

  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>Login</title>
        </Helmet>
      </HelmetProvider>
      <header
        id="header"
        className="header-area style-2 header-border absulate-header"
      >
        <Header />
      </header>
      <div className="bradcumb-area cart overlay-bg-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col">
              <div className="bradcumb text-center">
                <h3>Login</h3>
                <ul>
                  <li>
                    <a href="/">Bosh sahifa</a>
                  </li>
                  <li>Login</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="login-area pt-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-5 col-md-5">
              <img className="mb-5" src="img/about/2.png" alt="" />
            </div>
            <div className="col-xl-6 col-lg-7 col-md-7">
              <div className="section-title font-s30">
                <h2>Akkauntingizni kiriting</h2>
              </div>
              <div className="login-form">
                <form onSubmit={handleSubmit} className="gane-form">
                  <div className="form-left">
                    <div className="single-field">
                      <label htmlFor="phoneNumber">Telefon raqam</label>
                      <PhoneInput
                        defaultCountry="UZ"
                        value={logPhone_number}
                        onChange={setPhone_number}
                        international
                        limitMaxLength
                      />
                    </div>
                    <div className="single-field">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        placeholder="Parol"
                        onChange={(e) => setPassword(e.target.value)}
                        value={logPassword}
                        required
                      />
                    </div>
                    <div className="password">
                      <p>
                        <input
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Parolni eslab qoling
                      </p>
                      <p>
                        Parolingizni <a href="/">unutdingizmi?</a>
                      </p>
                    </div>
                    <div className="password">
                      <p>
                        <a href="/register">Roʻyxatdan oʻtish</a>
                      </p>
                    </div>
                    <button className="btn btn-theme" type="submit">
                      Kirish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="partner-area pt-85 pb-220">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10"></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
