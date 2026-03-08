import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import config from "../config";

export const useRequirements = ({ tab, page, limit = 30, search = "" }) => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1, limit });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(
          `${config.API_BASE_URL}/api/v1/application/admin`,
          {
            params: { tab, page, limit, search },
            withCredentials: true,
          }
        );

        if (!isMounted) return;

        const reqs = data?.requirements || data?.data?.requirements || [];
        setRows(reqs);

        // totalCount from API
        const totalCount = data?.pagination?.totalCount || data?.total || 0;
        setTotal(totalCount);

        const totalPages = data?.pagination?.totalPages || Math.ceil(totalCount / limit);
        const currentPage = data?.pagination?.currentPage || page;

        setPagination({ totalPages, currentPage, limit });
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to fetch requirements", err);
        setError(err);
        setRows([]);
        setTotal(0);
        setPagination({ totalPages: 1, currentPage: 1, limit });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [tab, page, limit, search]);

  return {
    rows,
    total,
    loading,
    error,
    pagination, // ✅ return pagination now
  };
};

