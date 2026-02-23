import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <div>
      <footer className="footer-area pt-85 pb-60">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-sm-8">
              <div className="widget contact-widget">
                <h3>{t("about")}</h3>
                <p>{t("about_text")}</p>
                <ul>
                  <li>
                    <a href="#">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-sm-8">
              <div className="widget quick-link-categories">
                <h3>{t("menu")}</h3>
                <ul>
                  <li>
                    <a href="#">
                      <i className="fal fa-angle-right"></i>
                      {t("ex")}
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fal fa-angle-right"></i>
                      {t("places")}
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fal fa-angle-right"></i>
                      {t("eco")}
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fal fa-angle-right"></i>
                      {t("routes")}
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fal fa-angle-right"></i>
                      {t("travel")}
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fal fa-angle-right"></i>
                      {t("contact")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-sm-8">
              <div className="widget contact-us">
                <h3>{t("contact")}</h3>
                <ul>
                  <li>
                    <a>
                      <i className="fal fa-paper-plane"></i> {t("address")}
                    </a>
                  </li>
                  <li>
                    <a>
                      <i className="fal fa-envelope"></i> {t("email")}
                    </a>
                  </li>
                  <li>
                    <a>
                      <i className="fal fa-phone-alt"></i> {t("phone")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="copy-right-area">
        <div className="container">
          <div className="row">
            <div className="col-sm-8">
              <div className="copyright-text text-center">
                <p>{t("copy")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
