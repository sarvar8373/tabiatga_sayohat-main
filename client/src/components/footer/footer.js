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
                <h3>{t("footer.about")}</h3>
                <p>{t("footer.about_text")}</p>
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
                <h3>{t("footer.menu")}</h3>
                <ul>
                  <li>
                    <a href="#">
                      <i className="fal fa-angle-right"></i>
                      {t("footer.ex")}
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fal fa-angle-right"></i>
                      {t("footer.places")}
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fal fa-angle-right"></i>
                      {t("footer.eco")}
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fal fa-angle-right"></i>
                      {t("footer.routes")}
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fal fa-angle-right"></i>
                      {t("footer.travel")}
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fal fa-angle-right"></i>
                      {t("footer.contact")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-sm-8">
              <div className="widget contact-us">
                <h3>{t("footer.contact")}</h3>
                <ul>
                  <li>
                    <a>
                      <i className="fal fa-paper-plane"></i>{" "}
                      {t("footer.address")}
                    </a>
                  </li>
                  <li>
                    <a>
                      <i className="fal fa-envelope"></i> {t("footer.email")}
                    </a>
                  </li>
                  <li>
                    <a>
                      <i className="fal fa-phone-alt"></i> {t("footer.phone")}
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
                <p>{t("footer.copy")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
