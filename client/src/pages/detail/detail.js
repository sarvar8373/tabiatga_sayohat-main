import React, { useEffect, useState } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../api/host/host";
import axios from "axios";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Button } from "react-bootstrap";
import AdventureModal from "../adventure/Modal";
import CustomCarousel from "../../components/carousel/carousel";
import { getRegions } from "../../http/usersApi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCart } from "../../context/CartContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Detail() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regions, setRegions] = useState([]);
  const [tours, setTours] = useState({});
  const [selectedAdventure, setSelectedAdventure] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const riskMap = {
    Normal: { icon: "/img/icon/n1.png", text: "Normal" },
    "O'rta": { icon: "/img/icon/n2.png", text: "O'rta" },
    "Yuqori xavflilik": { icon: "/img/icon/n3.png", text: "Yuqori xavflilik" },
  };

  const risk = riskMap[tour?.risk_level] || riskMap["Normal"];
  const [lat, lng] = tour?.coordinates
    ? tour?.coordinates.split(",").map(Number)
    : [41.3111, 69.2797]; // default Tashkent

  useEffect(() => {
    getRegions()
      .then((response) => {
        if (response.data.Status) {
          setRegions(response.data.Result);
        } else {
          setError(response.data.Error);
        }
      })
      .catch((err) => {
        setError("Error fetching regions.");
        console.error(err);
      });
  }, []);
  const { addToCart } = useCart();

  const handleBook = () => {
    // Agar joylar tugagan bo‘lsa
    if (tour.max_booking <= 0) {
      alert("Bu tur uchun bo‘sh joy qolmagan!");
      return;
    }

    const result = addToCart(tour);

    if (result === "max") {
      alert("Siz maksimal bron limitiga yetdingiz!");
    } else if (result === "added") {
      alert("Tur savatga qo‘shildi!");
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tours/tour/${id}`);
        if (response.data.Status) {
          const tourData = response.data.Result;
          setTour(tourData);

          // Tourism service IDlarini stringdan massivga aylantiramiz
          const serviceIds = tourData.tourism_service_id
            .split(",")
            .map((id) => Number(id.trim()));

          // Hammasiga axios so‘rov yuborish
          const tourPromises = serviceIds.map((serviceId) =>
            axios.get(`${BASE_URL}/services/tour_services/${serviceId}`)
          );

          const tourResponses = await Promise.all(tourPromises);

          const tList = tourResponses
            .filter((res) => res.data.Status)
            .map((res) => ({
              id: res.data.Result.id,
              name: res.data.Result.name,
            }));

          setTours(tList);
        } else {
          setError("Tour not found");
        }
      } catch (err) {
        setError("Error fetching Tour data");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  function formatDate(dateString) {
    if (!dateString) return "Noma'lum";

    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();

    return `${day}.${month}.${year}`;
  }

  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{tour?.title}</title>
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
                <h3>{tour?.title}</h3>
                <ul>
                  <li>
                    <a href="/">Bosh sahifa</a>
                  </li>
                  <li>{tour?.title}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="adventure-details-area pt-90 pb-110">
        <div className="container">
          <div className="row">
            <div className="col"></div>
          </div>
          <div className="row justify-content-center pb-50 pt-50">
            <div className="col-lg-12">
              <div className="dis-alpine section-title text-center">
                <h2>{tour?.title}</h2>

                <div className="sin-sis-alpine-wrap">
                  <div className="row">
                    <div className="col-sm-4">
                      <div className="single-alpine">
                        <h4>Narxi</h4>
                        <h3>{tour?.price}</h3>
                        <p>{tour?.price_description}</p>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="single-alpine">
                        <h4>Reytingi</h4>
                        <ul>
                          <li>
                            <i className="fas fa-star"></i>
                          </li>
                          <li>
                            <i className="fas fa-star"></i>
                          </li>
                          <li>
                            <i className="fas fa-star"></i>
                          </li>
                          <li>
                            <i className="fas fa-star"></i>
                          </li>
                          <li>
                            <i className="fas fa-star"></i>
                          </li>
                        </ul>
                        <p>15 Sharhlar</p>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="single-alpine">
                        <h4>Davomiyligi</h4>
                        <h3>1 kun</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <CustomCarousel
                images={tour?.images}
                width="100%"
                height="600px"
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-6">
                <div className="alpine-left-content mb-40">
                  {tour?.description}

                  <br />

                  <Button
                    className="btn btn-theme mt-3 border-0"
                    onClick={handleBook}
                  >
                    Bron qiling
                  </Button>

                  <br />
                  <h6 className="mt-3">
                    Qolgan joylar soni: {tour?.max_booking}
                  </h6>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="appline-right ">
                  <div className="alpine-info-wrap">
                    {" "}
                    <h4>Sayohat haqida ma'lumot</h4>
                    <div className="trip-info-wrap">
                      <div className="trip-info-one">
                        <div className="trip-content-one">
                          <p>Boshlanish sanasi</p>
                          <p>Tugash sanasi</p>
                          <p>Mamlakat</p>
                        </div>
                        <div className="trip-content-two">
                          <p>{formatDate(tour?.start_date)}</p>
                          <p>{formatDate(tour?.end_date)}</p>
                          <p>{tour?.country}</p>
                        </div>
                      </div>

                      <div className="trip-fifo-tow">
                        <div className="trip-content-one">
                          <p>Yosh chegarasi</p>
                          <p>Odamlar soni</p>
                          <p>Mavsum</p>
                        </div>
                        <div className="trip-content-two">
                          <p>{tour?.age_limit}+</p>
                          <p>{tour?.people_count} Odam</p>
                          <p>{tour?.season}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="acivement-wrap">
                    <div className="single-acivement">
                      <h4>Xizmat turlari</h4>
                      <ul className="d-flex text-center">
                        {tour?.tourism_service_id
                          ?.split(",")
                          .map((id) => Number(id.trim()))
                          .map((id) => {
                            const t = tours?.find?.((item) => item.id === id);
                            if (!t) return null;
                            return (
                              <li key={id}>
                                <img
                                  src={`/img/icon/a${id}.png`}
                                  alt={t.name}
                                />
                                <span>{t.name}</span>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                    <div className="single-acivement">
                      <div className="single-acivement">
                        <h4>Xavflilik darajasi</h4>
                        <ul className="text-center">
                          <li>
                            <img src={risk.icon} alt={risk.text} />
                            <span>{risk.text}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="inclution-area">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="section-title text-center">
                <p className="title">Muhim sayohat ma'lumotlari</p>
                <h2>Qo'shimcha ma'lumotlar</h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 col-sm-6">
              <div className="inclution-wrap">
                <div className="single-inclution">
                  <div className="inclution-thumb">
                    <img src="/img/icon/i1.png" alt="" />
                  </div>
                  <div className="inclution-content">
                    <h4>Turar joy</h4>
                    <p>{tour.accommodation_type || "Ma'lumot yo'q"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-6">
              <div className="inclution-wrap">
                <div className="single-inclution">
                  <div className="inclution-thumb">
                    <img src="/img/icon/i2.png" alt="" />
                  </div>
                  <div className="inclution-content">
                    <h4>Ovqatlar</h4>
                    <p>{tour.meal_type || "Ma'lumot yo'q"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-6">
              <div className="inclution-wrap">
                <div className="single-inclution">
                  <div className="inclution-thumb">
                    <img src="/img/icon/i3.png" alt="" />
                  </div>
                  <div className="inclution-content">
                    <h4>Transport</h4>
                    <p>{tour.transport_type || "Ma'lumot yo'q"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-lg-12">
              <h4>Lokatsiya</h4>

              <div
                style={{
                  height: "400px",
                  width: "100%",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <MapContainer
                  center={[lat, lng]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  <Marker position={[lat, lng]}>
                    <Popup>
                      {tour.title} <br /> {tour.location}
                    </Popup>
                  </Marker>
                </MapContainer>
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
      </div>{" "}
      <Footer />
      {selectedAdventure && (
        <AdventureModal
          adventure={selectedAdventure}
          showModal={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
