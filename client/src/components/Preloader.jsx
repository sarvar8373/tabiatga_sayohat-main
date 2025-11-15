import React, { useEffect } from "react";
import $ from "jquery";

export default function Preloader() {
  useEffect(() => {
    $(window).on("load", function () {
      $(".preloader-wrap").fadeOut(2000);
    });
  }, []);

  return (
    <div className="preloader-wrap">
      <div className="cube-wrapper">
        <div className="cube-folding">
          <span className="leaf1"></span>
          <span className="leaf2"></span>
          <span className="leaf3"></span>
          <span className="leaf4"></span>
        </div>
        <span className="loading" data-name="Loading"></span>
      </div>
    </div>
  );
}
