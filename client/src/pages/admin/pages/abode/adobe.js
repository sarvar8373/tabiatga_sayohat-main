import { useEffect, useState } from "react";
import { getRegions, getSelectRegion } from "../../../../service/usersApi";
import { postTour } from "../../../../service/adobeApi";
import { getTourService } from "../../../../service/tourServices";
import { postNotification } from "../../../../service/notificationApi";
import Select from "react-select";
import { getOrganizations } from "../../../../service/organizationApi";
import MapLocationPicker from "../../../../components/MapLocationPicker";
import { useSelector } from "react-redux";
const Adobe = () => {
  const [tourServices, setTourServices] = useState([]);
  const [regions, setRegions] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [optionss, setOptionss] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    price_description: "",
    status: "1",
    country: "",
    location: "",
    notification_id: "",
    tourism_service_id: [],
    start_date: "",
    end_date: "",
    age_limit: "",
    people_count: "",
    season: "",
    accommodation_type: "",
    meal_type: "",
    transport_type: "",
    risk_level: "",
    coordinates: "",
    max_booking: "0",
  });
  const [images, setImages] = useState([]); // Change to handle multiple images
  const { user } = useSelector((state) => state.auth);

  // Fetch regions
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

  useEffect(() => {
    if (user?.role === "admin") {
      getOrganizations()
        .then((res) => {
          if (res.data.Status) {
            const orgOptions = res.data.Result.map((org) => ({
              value: org.id,
              label: org.org_name,
            }));
            setOptionss(orgOptions);
          }
        })
        .catch((err) => console.error("Tashkilotlar yuklanmadi:", err));
    }
  }, [user]);

  // Fetch tour services
  useEffect(() => {
    getTourService()
      .then((response) => {
        if (response.data.Status) {
          setTourServices(response.data.Result);
        } else {
          setError(response.data.Error);
        }
      })
      .catch((err) => {
        setError("Error fetching tour services.");
        console.error(err);
      });
  }, []);

  // Filter regions and set districts based on user role
  useEffect(() => {
    if (user.role === "region" && user.region_id) {
      setFilteredRegions(
        regions.filter((region) => region.id === user.region_id),
      );

      setDistricts([]);
      setSelectedRegion("");
      setSelectedDistrict("");
    } else if (user.role === "district" && user.region_id && user.district_id) {
      setFilteredRegions(
        regions.filter((region) => region.id === user.region_id),
      );

      if (regions.length > 0) {
        getSelectRegion(user.region_id)
          .then((response) => {
            if (response.data.Status) {
              // Filter to show only the district that matches the user's district_id
              const filteredDistricts = response.data.Result.filter(
                (district) => district.id === user.district_id,
              );
              setDistricts(filteredDistricts);
              setSelectedRegion(user.region_id);
              setSelectedDistrict(user.district_id);
            } else {
              setError(response.data.Error);
            }
          })
          .catch((err) => {
            setError("Error fetching districts.");
            console.error(err);
          });
      }
    } else {
      setFilteredRegions(regions);
      setDistricts([]);
      setSelectedRegion("");
      setSelectedDistrict("");
    }
  }, [regions, user]);

  // Fetch districts based on selected region
  useEffect(() => {
    if (selectedRegion) {
      getSelectRegion(selectedRegion)
        .then((response) => {
          if (response.data.Status) {
            setDistricts(response.data.Result);
          } else {
            setError(response.data.Error);
          }
        })
        .catch((err) => {
          setError("Error fetching districts.");
          console.error(err);
        });
    } else {
      setDistricts([]);
    }
  }, [selectedRegion]);

  const handleChange = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((opt) => opt.value);
    setFormData({
      ...formData,
      organization_id: selectedIds,
    });
    setFormData((prevData) => ({
      ...prevData,
      tourism_service_id: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };
  const handleOrganizationChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((opt) => opt.value);
    setFormData((prev) => ({
      ...prev,
      organization_id: selectedIds,
    }));
  };

  // Faoliyat turi uchun
  const handleServiceChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((opt) => opt.value);
    setFormData((prev) => ({
      ...prev,
      tourism_service_id: selectedIds,
    }));
  };
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
    setMainImageIndex(0); // birinchi rasmni avtomatik asosiy qilamiz
  };
  const handleSetMain = (index) => {
    setMainImageIndex(index);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user?.id) {
      setError("Foydalanuvchi ma'lumotlari topilmadi");
      return;
    }

    const notification = {
      user_id: user.id,
      message: `Maskan: ${formData.title}`,
      type: formData.status,
    };

    postNotification(notification)
      .then((notificationResponse) => {
        const notificationId = notificationResponse.data.Result;
        if (!notificationId) throw new Error("Notification ID topilmadi");

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        images.forEach((file) => data.append("images", file));
        data.append("price", formData.price);
        data.append("price_description", formData.price_description);
        data.append(
          "region_id",
          selectedRegion ? parseInt(selectedRegion) : "",
        );
        data.append(
          "district_id",
          selectedDistrict ? parseInt(selectedDistrict) : "",
        );
        data.append("user_id", user.id);
        data.append(
          "tourism_service_id",
          formData.tourism_service_id.join(","),
        );
        data.append(
          "organization_id",
          formData.organization_id ? String(formData.organization_id) : "",
        );
        // ✅ bitta ID
        data.append("notification_id", notificationId);
        data.append("country", formData.country || "");
        data.append("location", formData.location || "");

        data.append("start_date", formData.start_date);
        data.append("end_date", formData.end_date);
        data.append("age_limit", formData.age_limit);
        data.append("people_count", formData.people_count);
        data.append("season", formData.season);
        data.append("accommodation_type", formData.accommodation_type);
        data.append("meal_type", formData.meal_type);
        data.append("transport_type", formData.transport_type);
        data.append("risk_level", formData.risk_level);
        data.append("coordinates", formData.coordinates || "");
        data.append("max_booking", formData.max_booking || 0);

        for (let pair of data.entries()) {
          console.log(pair[0], pair[1]);
        }

        return postTour(data);
      })
      .then((response) => {
        if (response.data.Status) {
          alert("Maskan muvaffaqiyatli qo'shildi!");
        } else {
          setError(response.data.Error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Xatolik yuz berdi");
      });
  };

  const formatOptions = (services) => {
    return services.map((service) => ({
      value: service.id,
      label: service.name,
    }));
  };

  const options = formatOptions(tourServices);

  return (
    <div className="container-fluid px-4">
      <h2 className="mt-4">Maskan qo'shish</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="login-form">
        <form className="gane-form" onSubmit={handleSubmit}>
          {/* Form fields remain unchanged */}
          <div className="single-field">
            <label htmlFor="title">Sarlavha</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="single-field">
            <label htmlFor="description">Ma'lumot</label>
            <textarea
              rows="10"
              cols="500"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          {user?.role === "admin" ? (
            <div className="single-field">
              <label htmlFor="organization_id">Tashkilotni tanlang</label>
              <Select
                id="organization_id"
                name="organization_id"
                placeholder="Tashkilotni tanlang"
                value={optionss.find(
                  (option) => option.value === formData.organization_id,
                )}
                onChange={(option) =>
                  setFormData((prev) => ({
                    ...prev,
                    organization_id: option ? option.value : "",
                  }))
                }
                options={optionss}
                className="form-control"
              />
            </div>
          ) : (
            <input
              type="hidden"
              name="organization_id"
              value={formData.organization_id || ""}
            />
          )}

          <div className="single-field">
            <label htmlFor="tourism_service_id">Faoliyat turi</label>
            <Select
              id="tourism_service_id"
              name="tourism_service_id"
              placeholder="Faoliyatni tanlang"
              value={options.filter((option) =>
                formData.tourism_service_id.includes(option.value),
              )}
              onChange={handleServiceChange}
              options={options}
              isMulti
              className="form-control"
            />
          </div>
          <div className="d-flex justify-content-between gap-5">
            {" "}
            <div className="single-field">
              <label htmlFor="price">Narxi</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="single-field">
              <label htmlFor="price_description">Necha kishi</label>
              <input
                type="text"
                name="price_description"
                value={formData.price_description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-flex justify-content-between gap-5">
            <div className="single-field">
              <label htmlFor="region">Viloyat</label>
              <select
                id="region"
                name="region_id"
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  handleChange(e);
                }}
                className="form-control"
              >
                <option value="">Viloyatni tanlang</option>
                {filteredRegions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="single-field">
              <label htmlFor="district">Tuman</label>
              <select
                id="district"
                name="district_id"
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  handleChange(e);
                }}
                className="form-control"
                disabled={user.role === "district" ? true : !selectedRegion}
              >
                <option value="">Tumanni tanlang</option>
                {districts.length > 0 ? (
                  districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))
                ) : (
                  <option value="">Tumman topilmadi</option>
                )}
              </select>
            </div>
          </div>

          {/* {user.role === "admin" && (
            <div className="single-field">
              <label htmlFor="status">Tashkilot</label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="0">Jarayonda</option>
                <option value="2">Bekor qilish</option>
                <option value="3">Qayta yuborish</option>
                <option value="1">Tasdiqlangan</option>
              </select>
            </div>
          )} */}
          <div className="d-flex justify-content-between gap-5">
            {" "}
            <div className="single-field">
              <label>Boshlanish sanasi</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>
            <div className="single-field">
              <label>Tugash sanasi</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between gap-5">
            {" "}
            <div className="single-field">
              <label>Yosh chegarasi</label>
              <input
                type="number"
                name="age_limit"
                value={formData.age_limit}
                onChange={handleChange}
              />
            </div>
            <div className="single-field">
              <label>Odamlar soni</label>
              <input
                type="number"
                name="people_count"
                value={formData.people_count}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between gap-5">
            <div className="single-field">
              <label>Mavsum</label>
              <select
                name="season"
                value={formData.season}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Tanlang</option>
                <option value="Yoz">Yoz</option>
                <option value="Qish">Qish</option>
                <option value="Bahor">Bahor</option>
                <option value="Kuz">Kuz</option>
              </select>
            </div>
            <div className="single-field">
              <label>Turar joy</label>
              <input
                type="text"
                name="accommodation_type"
                value={formData.accommodation_type}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between gap-5">
            {" "}
            <div className="single-field">
              <label>Ovqatlar</label>
              <select
                name="meal_type"
                value={formData.meal_type}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Tanlang</option>
                <option value="3 Mahal (Tushlik, Obed, Ujin)">
                  3 Mahal (Tushlik, Obed, Ujin)
                </option>
                <option value="2 Mahal (Tushlik, Ujin)">
                  2 Mahal (Tushlik, Ujin)
                </option>
                <option value="1 Mahal (Obed)">1 Mahal (Obed)</option>
              </select>
            </div>
            <div className="single-field">
              <label>Transport</label>
              <input
                type="text"
                name="transport_type"
                value={formData.transport_type}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between gap-5">
            <div className="single-field">
              <label>Lokatsiya (karta orqali belgilang)</label>

              <MapLocationPicker
                coordinates={formData.coordinates}
                setCoordinates={(value) =>
                  setFormData((prev) => ({ ...prev, coordinates: value }))
                }
              />

              <input
                type="text"
                name="coordinates"
                value={formData.coordinates}
                onChange={handleChange}
                placeholder="lat,long avtomatik yoziladi"
                readOnly
              />
            </div>
            <div className="single-field">
              <label>Xavflilik darajasi</label>
              <select
                name="risk_level"
                value={formData.risk_level}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Tanlang</option>
                <option value="Normal">Normal</option>
                <option value="O'rta">O'rta</option>
                <option value="Yuqori xavflilik">Yuqori xavflilik</option>
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-between gap-5">
            <div className="single-field">
              <label>Maksimal bron qilish soni</label>
              <input
                type="number"
                name="max_booking"
                value={formData.max_booking}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between gap-5">
            <div className="single-field">
              <label>Mamlakat</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Mamlakat"
              />
            </div>

            <div className="single-field">
              <label>Manzil (location)</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Masalan: Chimgan, Samarqand Registon"
              />
            </div>
          </div>
          <div className="my-3">
            <h4>Rasmlar yuklash</h4>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleFileChange}
              className="form-control my-3"
            />

            {/* Rasmlar preview */}
            {images.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {images.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      border:
                        index === mainImageIndex
                          ? "3px solid #28a745"
                          : "1px solid #ccc",
                      borderRadius: "8px",
                      overflow: "hidden",
                      width: "100px",
                      height: "100px",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`rasm-${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleSetMain(index)}
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "100%",
                        background:
                          index === mainImageIndex ? "#28a745" : "#00000080",
                        color: "white",
                        fontSize: "12px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {index === mainImageIndex
                        ? "Asosiy rasm ✅"
                        : "Asosiy qilish"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button className="btn btn-success mt-3" type="submit">
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Adobe;
