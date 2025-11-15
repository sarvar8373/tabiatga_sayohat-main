import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../api/host/host";
import { getTours } from "../../http/adobeApi";
import Modal from "../adventure/Modal";

export default function Adventure() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getTours();
        // <- shu orqali ma’lumotni tekshirish
        if (response.data.Status) {
          setPosts(response.data.Result);
        } else {
          setError(response.data.Error);
        }
      } catch (err) {
        console.error("Error fetching tours:", err);
        setError("Xatolik yuz berdi");
      }
    };
    fetchTours();
  }, []);

  return (
    <div className="adventure-area pb-90 pt-10">
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-md-8">
            <div className="section-title text-center">
              <p className="title">Qiziqarli sayohat</p>
              <h2>
                Eng zo'r sayohatlar <span></span> shu yerda
              </h2>
            </div>
          </div>
        </div>
        <div className="row">
          {posts
            .filter((adventure) => adventure.status !== 0)
            .map((adventure) => (
              <div className="col-lg-3 text-start col-sm-6" key={adventure.id}>
                <div className="single-adventure">
                  {(adventure.main_image || adventure.images) && (
                    <img
                      src={`${BASE_URL}/uploads/${
                        adventure.main_image
                          ? adventure.main_image
                          : adventure.images?.split(",")[0]
                      }`}
                      alt={adventure.title}
                      width="100%"
                      style={{
                        height: "220px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  )}
                  <div className="adventure-content">
                    <p className="tour">{adventure.tour}</p>
                    <Link to={`/detail/${adventure.id}`}>
                      <h6>{adventure.title}</h6>
                    </Link>
                    <p className="price">{adventure.price}</p>
                    <p>{adventure.price_description}</p>
                    <Link className="text-white" to={`/detail/${adventure.id}`}>
                      <button type="button" className="btn btn-theme px-5 py-2">
                        Batafsil
                      </button>
                    </Link>
                    <Modal />
                  </div>
                </div>
              </div>
            ))}
          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
        <a href="/adventure" className="btn m-auto btn-theme mt-30">
          Barchasini ko'rish
        </a>
      </div>
    </div>
  );
}
