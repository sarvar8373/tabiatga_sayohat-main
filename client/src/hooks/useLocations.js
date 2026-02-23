import { useState, useEffect } from "react";
import AuthService from "../service/usersApi";

export const useLocation = () => {
  const [data, setData] = useState({ regions: [], districts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocations = async () => {
      try {
        const [r, d] = await Promise.all([
          AuthService.getRegions(),
          AuthService.getDistricts(),
        ]);
        setData({
          regions: r.Status ? r.Result : [],
          districts: d.Status ? d.Result : [],
        });
      } finally {
        setLoading(false);
      }
    };
    getLocations();
  }, []);

  return { ...data, loading };
};
