import { useEffect, useState } from "react";
import { putTour } from "../../../../service/adobeApi";
import { BASE_URL } from "../../../../api/host/host";
import { getSelectRegion } from "../../../../service/usersApi";
import { getOrganizations } from "../../../../service/organizationApi";
import MapLocationPicker from "../../../../components/MapLocationPicker";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdobeEdit({
  adobe,
  regions,
  tourServices,
  districts,
  onCancel,
}) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [editData, setEditData] = useState({
    ...adobe,
    tourism_service_id: adobe.tourism_service_id
      ? adobe.tourism_service_id.split(",").map((n) => Number(n))
      : [],
  });

  const [filteredRegions, setFilteredRegions] = useState(regions);
  const [filteredDistricts, setFilteredDistricts] = useState(districts);
  const [organizations, setOrganizations] = useState([]);

  // Rasm va previewlar
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // 🔵 tashkilotlar load
  useEffect(() => {
    if (user.role === "admin") {
      getOrganizations().then((res) => {
        if (res.data.Status) setOrganizations(res.data.Result);
      });
    }
  }, []);

  // 🔵 eski rasmlar
  useEffect(() => {
    if (adobe.images) {
      const arr = adobe.images
        .split(",")
        .map((img) => `${BASE_URL}/uploads/${img}`);
      setImagePreviews(arr);
    }
  }, [adobe]);

  // 🔵 region & district filter
  useEffect(() => {
    if (user.role === "region") {
      setFilteredRegions(regions.filter((r) => r.id === user.region_id));
    } else {
      setFilteredRegions(regions);
    }
  }, [regions]);

  useEffect(() => {
    if (editData.region_id) {
      getSelectRegion(editData.region_id).then((res) => {
        if (res.data.Status) setFilteredDistricts(res.data.Result);
      });
    }
  }, [editData.region_id]);

  // 🔵 input change
  const handleChange = (name, value) => {
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔵 image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
    setMainImageIndex(0);
  };

  const handleUpdate = () => {
    const form = new FormData();

    Object.keys(editData).forEach((key) => {
      if (key !== "tourism_service_id") form.append(key, editData[key]);
    });

    form.append("tourism_service_id", editData.tourism_service_id.join(","));

    // 📸 rasm biriktirish
    images.forEach((file) => form.append("images", file));

    // 📌 asosiy rasm nomi
    if (imagePreviews[mainImageIndex]) {
      const fileName = imagePreviews[mainImageIndex].split("/").pop();
      form.append("main_image", fileName);
    }

    putTour(adobe.id, form)
      .then((res) => {
        if (res.data.Status) {
          alert("Muvaffaqiyatli yangilandi!");
          navigate("/adventure");
          window.location.reload();
        } else alert(res.data.Error);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h3>Tahrirlash</h3>

      {/* Sarlavha */}
      <div className="form-group">
        <label>Sarlavha</label>
        <input
          className="form-control"
          value={editData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label>Ma’lumot</label>
        <textarea
          className="form-control"
          value={editData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      {/* Tashkilot */}
      {user.role === "admin" && (
        <div className="form-group">
          <label>Tashkilot</label>
          <select
            className="form-control"
            value={editData.organization_id || ""}
            onChange={(e) => handleChange("organization_id", e.target.value)}
          >
            <option value="">Tanlang</option>
            {organizations.map((o) => (
              <option value={o.id} key={o.id}>
                {o.org_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tourism services */}
      <div className="form-group">
        <label>Faoliyat turi</label>
        <Select
          isMulti
          options={tourServices.map((t) => ({
            value: t.id,
            label: t.name,
          }))}
          value={tourServices
            .filter((t) => editData.tourism_service_id.includes(Number(t.id)))
            .map((t) => ({ value: t.id, label: t.name }))}
          onChange={(vals) =>
            handleChange(
              "tourism_service_id",
              vals.map((v) => v.value),
            )
          }
        />
      </div>

      {/* price */}
      <div className="form-group">
        <label>Narxi</label>
        <input
          className="form-control"
          value={editData.price}
          onChange={(e) => handleChange("price", e.target.value)}
        />
      </div>

      {/* price description */}
      <div className="form-group">
        <label>Necha kishi</label>
        <input
          className="form-control"
          value={editData.price_description}
          onChange={(e) => handleChange("price_description", e.target.value)}
        />
      </div>

      {/* Region */}
      <div className="form-group">
        <label>Viloyat</label>
        <select
          className="form-control"
          value={editData.region_id}
          onChange={(e) => handleChange("region_id", e.target.value)}
        >
          <option value="">Tanlang</option>
          {filteredRegions.map((r) => (
            <option value={r.id} key={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div className="form-group">
        <label>Tuman</label>
        <select
          className="form-control"
          value={editData.district_id}
          onChange={(e) => handleChange("district_id", e.target.value)}
        >
          <option value="">Tanlang</option>
          {filteredDistricts.map((d) => (
            <option value={d.id} key={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="form-group">
        <label>Boshlanish sanasi</label>
        <input
          type="date"
          className="form-control"
          value={editData.start_date?.substr(0, 10)}
          onChange={(e) => handleChange("start_date", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Tugash sanasi</label>
        <input
          type="date"
          className="form-control"
          value={editData.end_date?.substr(0, 10)}
          onChange={(e) => handleChange("end_date", e.target.value)}
        />
      </div>

      {/* Age */}
      <div className="form-group">
        <label>Yosh chegarasi</label>
        <input
          className="form-control"
          type="number"
          value={editData.age_limit}
          onChange={(e) => handleChange("age_limit", e.target.value)}
        />
      </div>

      {/* People count */}
      <div className="form-group">
        <label>Odamlar soni</label>
        <input
          className="form-control"
          type="number"
          value={editData.people_count}
          onChange={(e) => handleChange("people_count", e.target.value)}
        />
      </div>

      {/* Season */}
      <div className="form-group">
        <label>Mavsum</label>
        <select
          className="form-control"
          value={editData.season}
          onChange={(e) => handleChange("season", e.target.value)}
        >
          <option value="">Tanlang</option>
          <option value="Yoz">Yoz</option>
          <option value="Qish">Qish</option>
          <option value="Bahor">Bahor</option>
          <option value="Kuz">Kuz</option>
        </select>
      </div>

      {/* Accommodation */}
      <div className="form-group">
        <label>Turar joy</label>
        <input
          className="form-control"
          value={editData.accommodation_type}
          onChange={(e) => handleChange("accommodation_type", e.target.value)}
        />
      </div>

      {/* Meal type */}
      <div className="form-group">
        <label>Ovqat</label>
        <input
          className="form-control"
          value={editData.meal_type}
          onChange={(e) => handleChange("meal_type", e.target.value)}
        />
      </div>

      {/* Transport */}
      <div className="form-group">
        <label>Transport</label>
        <input
          className="form-control"
          value={editData.transport_type}
          onChange={(e) => handleChange("transport_type", e.target.value)}
        />
      </div>

      {/* Risk level */}
      <div className="form-group">
        <label>Xavf darajasi</label>
        <select
          className="form-control"
          value={editData.risk_level}
          onChange={(e) => handleChange("risk_level", e.target.value)}
        >
          <option value="">Tanlang</option>
          <option value="Normal">Normal</option>
          <option value="O'rta">O'rta</option>
          <option value="Yuqori xavflilik">Yuqori xavflilik</option>
        </select>
      </div>

      {/* Coordinates + Map */}
      <div className="form-group">
        <label>Koordinatalar</label>

        <MapLocationPicker
          setCoordinates={(coords) => handleChange("coordinates", coords)}
        />

        <input
          className="form-control mt-2"
          value={editData.coordinates}
          readOnly
        />
      </div>

      {/* Country */}
      <div className="form-group">
        <label>Mamlakat</label>
        <input
          className="form-control"
          value={editData.country}
          onChange={(e) => handleChange("country", e.target.value)}
        />
      </div>

      {/* Location */}
      <div className="form-group">
        <label>Location</label>
        <input
          className="form-control"
          value={editData.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
      </div>

      {/* Max booking */}
      <div className="form-group">
        <label>Maksimal bron soni</label>
        <input
          className="form-control"
          type="number"
          value={editData.max_booking}
          onChange={(e) => handleChange("max_booking", e.target.value)}
        />
      </div>

      {/* Images */}
      <div className="form-group">
        <label>Rasmlar</label>
        <input
          type="file"
          multiple
          className="form-control"
          onChange={handleImageChange}
        />

        <div className="d-flex flex-wrap mt-2">
          {imagePreviews.map((img, i) => (
            <div
              key={i}
              style={{
                border:
                  i === mainImageIndex ? "3px solid green" : "1px solid #ccc",
                width: "100px",
                height: "100px",
                marginRight: "10px",
                position: "relative",
              }}
            >
              <img
                src={img}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                className="btn btn-sm btn-success"
                style={{ width: "100%" }}
                onClick={() => setMainImageIndex(i)}
              >
                Asosiy
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <button className="btn btn-primary mt-3" onClick={handleUpdate}>
        Yangilash
      </button>

      <button className="btn btn-secondary mt-3 mx-2" onClick={onCancel}>
        Bekor qilish
      </button>
    </div>
  );
}
