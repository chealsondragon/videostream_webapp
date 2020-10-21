/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import PortletHeaderDropdown from "../../partials/content/CustomDropdowns/PortletHeaderDropdown";
import * as api from "../../crud/report.crud";

export default function LatestWatch() {
  const [movies, setMovies] = React.useState([])
  React.useEffect(() => {
    api.getLatestWatch()
      .then(result => {
        result.data && setMovies(result.data.splice(0, 20))
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <div className="kt-portlet kt-portlet--height-fluid">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">Latest Watch</h3>
          </div>
          <PortletHeaderDropdown />
        </div>
        <div className="kt-portlet__body">
          <div className="kt-widget4">
            {movies && movies.map((movie, index) => (
              <div key={index} className="kt-widget4__item">
                <span className="kt-widget4__icon">
                  <i className="fa fa-video" />
                </span>
                <span
                  className="kt-widget4__title"
                  href="https://keenthemes.com.my/metronic"
                >
                  {`${movie.name}(${movie.username}) saw ${movie.title}`}
                </span>
                <span className="kt-widget4__number kt-font-success">{movie.created_at}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
