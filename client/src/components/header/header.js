import React, { useEffect, useRef, useState } from "react";
import Navbar from "../navbar/navbar";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
    setOpen(false); // dropdownni yopish
  };

  // Dropdown tashqarisiga bosilganda yopish
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { key: "uz", label: "UZ 🇺🇿" },
    { key: "ru", label: "RU 🇷🇺" },
    { key: "oz", label: "O‘Z 🇺🇿" },
  ];
  return (
    <div>
      <div className="col-lg-12 col-sm-12">
        {/* <div
          className="header-top-contact lh-0 p-0 bg-white"
          style={{ width: "100%", height: "25px" }}
        >
          <marquee
            className="p-0 m-0 lh-0"
            style={{
              position: "relative",
              color: "red",
              background: "transparent",
              fontWeight: "bold",
              fontSize: "15px",
              height: "auto",
              color: "#ad0000",
            }}
          >
            Platforma sinov tariqasida ishga tushirilgan
          </marquee>
        </div> */}
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-sm-9">
            <div className="header-top-contact float-start">
              <ul>
                <li>
                  <a href="mailto:info@uznature.uz">
                    <i className="fal fa-envelope"></i>info@uznature.uz
                  </a>
                </li>
                <li>
                  <a href="tel:+008012345678">
                    <i className="fal fa-phone-alt"></i>71 207 07 70
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-6 col-sm-3">
            <div className="header-top-left float-end">
              <ul>
                <li className="has-dropdown">
                  <a href="#">{i18n.language.toUpperCase()}</a>
                  <ul>
                    <li>
                      <a href="#" onClick={() => changeLanguage("uz")}>
                        UZ
                      </a>
                    </li>
                    <li>
                      <a href="#" onClick={() => changeLanguage("ru")}>
                        RU
                      </a>
                    </li>
                    <li>
                      <a href="#" onClick={() => changeLanguage("oz")}>
                        OZ
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
}
