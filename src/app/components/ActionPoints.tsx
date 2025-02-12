"use client";

import { useState, useEffect } from "react";

export default function ActionPoints() {
  const [actionPoints, setActionPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActionPoints();
  }, []);

  const fetchActionPoints = async () => {
    try {
      const res = await fetch("/api/action-points");
      if (!res.ok) {
        console.error("Failed to fetch action points");
        setActionPoints(0);
        return;
      }

      const data = await res.json();
      setActionPoints(data.actionPoints);
    } catch (error) {
      console.error("Error fetching action points:", error);
      setActionPoints(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <span style={{ marginRight: "10px", fontWeight: "bold" }}>
      {loading ? "AP: ..." : `AP: ${actionPoints ?? 0}`}
    </span>
  );
}
