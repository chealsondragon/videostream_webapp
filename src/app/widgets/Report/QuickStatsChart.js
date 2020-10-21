import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { useSelector } from "react-redux";

export default function QuickStatsChart({
  value,
  desc,

  // array of numbers
  data,
  // chart line color
  color,
  // chart line size
  border
}) {
  
  return (
    <div className="kt-widget26">
      <div className="kt-widget26__content">
        <span className="kt-widget26__number">{value}</span>
        <span className="kt-widget26__desc">{desc}</span>
      </div>
    </div>
  );
}
