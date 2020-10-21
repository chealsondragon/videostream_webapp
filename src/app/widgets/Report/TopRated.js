/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import PortletHeaderDropdown from "../../partials/content/CustomDropdowns/PortletHeaderDropdown";
import * as api from "../../crud/report.crud";

export default function TopRated() {
  const [movies, setMovies] = React.useState([])
  React.useEffect(() => {
    api.getTopRated()
      .then(result => {
        result.data && setMovies(result.data.splice(0, 10))
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
            <h3 className="kt-portlet__head-title">Top Rated Movies</h3>
          </div>
          <PortletHeaderDropdown />
        </div>
        <div className="kt-portlet__body">
          <div className="kt-widget5">
            {movies && movies.map((movie, index) => (
              <div key={index} className="kt-widget5__item ">
                <div className="kt-widget5__content">
                  <div className="kt-widget5__pic">
                    <img
                      alt=""
                      className="kt-widget7__img"
                      src={movie.title_logo}
                    />
                  </div>
                  <div className="kt-widget5__section">
                    <a className="kt-widget5__title">{movie.title}</a>
                    <div className="kt-widget5__info">
                      <span>Rate:</span>
                      <span className="kt-font-info">{parseFloat(movie.rate).toFixed(2)}%</span>
                      <span>Released:</span>
                      <span className="kt-font-info">{movie.activate_at}</span>
                    </div>
                  </div>
                </div>
                <div className="kt-widget5__content">
                  <div className="kt-widget5__stats">
                    <span className="kt-widget5__number">{movie.up}</span>
                    <span className="fa fa-thumbs-up"></span>
                  </div>
                  <div className="kt-widget5__stats">
                    <span className="kt-widget5__number">{movie.down}</span>
                    <span className="fa fa-thumbs-down"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
