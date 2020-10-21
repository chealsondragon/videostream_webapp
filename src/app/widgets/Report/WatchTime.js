import React, { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { Chart } from "chart.js";
import * as api from "../../crud/report.crud";

export default function WatchTime({ title, desc }) {
  const ref = useRef();
 
  var myChart = null;

  const initChart = (data) => {
    return new Chart(ref.current, {
      data,
      type: "bar",
      options: {
        title: { display: false },
        tooltips: {
          intersect: false,
          mode: "nearest",
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10
        },
        legend: { display: false },
        responsive: true,
        maintainAspectRatio: false,
        barRadius: 4,
        scales: {
          xAxes: [{ display: false, gridLines: false, stacked: true }],
          yAxes: [{ display: true, stacked: true, gridLines: true }]
        },
        layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } }
      }
    });
  }

  useEffect(() => {
    api.getWatchHours()
      .then(result => {
        if(result.data){
          var chartdata = { labels: [], datasets: [{ backgroundColor: "#c3c3cb", data: [] }] };
          result.data.map((item, index) => {
            chartdata.labels.push(item.title);
            chartdata.datasets[0].data.push((item.time/60).toFixed(2));
          })
          myChart = initChart(chartdata);
        }
      })
      .catch(error => {
        console.log(error)
      })

    return () => {
      if(myChart)
        myChart.destroy();
    };
  }, []);

  return (
    <div className="kt-widget14">
      <div className="kt-widget14__header kt-margin-b-30">
        <h3 className="kt-widget14__title">{title}</h3>
        <span className="kt-widget14__desc">{desc}</span>
      </div>
      <div className="kt-widget14__chart" style={{ height: "240px" }}>
        <canvas ref={ref} />
      </div>
    </div>
  );
}
