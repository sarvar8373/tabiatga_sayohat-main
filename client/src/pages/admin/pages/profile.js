import { useSelector } from "react-redux";
import { useLocation } from "../../../hooks/useLocations";

const roleLabels = {
  customer: "Foydalanuvchi",
  admin: "Admin",
  user: "Tadbirkor",
  region: "Viloyat",
  district: "Tuman",
};

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const { regions, districts } = useLocation(); // Hookdan tayyor ma'lumotlarni olamiz

  // Agar user hali yuklanmagan bo'lsa
  if (!user) return <div className="text-center mt-5">Yuklanmoqda...</div>;

  // Helper funksiyalar (memoization ishlatish ham mumkin, lekin hozirgi holatda shartmas)
  const regionName =
    regions.find((r) => r.id === user.region_id)?.name || "Yuklanmoqda...";
  const districtName =
    districts.find((d) => d.id === user.district_id)?.name || "Yuklanmoqda...";
  const roleLabel = roleLabels[user.role] || "Noma'lum";

  return (
    <div className="container-fluid">
      <div className="profile-card js-profile-card">
        <div className="profile-card__img">
          <img
            className="rounded-circle"
            src="/img/guide/1.png"
            alt="Profile"
            width={200}
            height={200}
          />
        </div>

        <div className="profile-card__cnt js-profile-cnt">
          <div className="profile-card__name">{user.full_name}</div>
          <div className="profile-card-loc">
            <span className="profile-card-loc__txt">{roleLabel}</span>
          </div>

          <div className="profile-card-inf">
            <div className="profile-card-inf__item">
              <div className="profile-card-inf__title">{user.phone_number}</div>
              <div className="profile-card-inf__txt">Telefon raqam</div>
            </div>

            <div className="profile-card-inf__item">
              <div className="profile-card-inf__title">{regionName}</div>
              <div className="profile-card-inf__txt">Viloyat</div>
            </div>

            <div className="profile-card-inf__item">
              <div className="profile-card-inf__title">{districtName}</div>
              <div className="profile-card-inf__txt">Tuman</div>
            </div>
          </div>

          <div className="profile-card-ctr">
            <button className="profile-card__button button--blue js-message-btn">
              Tahrirlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
