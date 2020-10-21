/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { toAbsoluteUrl } from "../../../_metronic/utils/utils";
import PortletHeaderDropdown from "../../partials/content/CustomDropdowns/PortletHeaderDropdown";

export default function BestSellingMovies({ movies }) {
  return (
    <>
      <div className="kt-portlet kt-portlet--height-fluid">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">Best Selling Movies</h3>
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
                      src={toAbsoluteUrl("/media/products/product6.jpg")}
                    />
                  </div>
                  <div className="kt-widget5__section">
                    <a className="kt-widget5__title">Titanic</a>
                    <p className="kt-widget5__desc">Metornic movies.</p>
                    <div className="kt-widget5__info">
                      <span>Author:</span>
                      <span className="kt-font-info">Keenthemes</span>
                      <span>Released:</span>
                      <span className="kt-font-info">23.08.17</span>
                    </div>
                  </div>
                </div>
                <div className="kt-widget5__content">
                  <div className="kt-widget5__stats">
                    <span className="kt-widget5__number">19,200</span>
                    <span className="kt-widget5__sales">sales</span>
                  </div>
                  <div className="kt-widget5__stats">
                    <span className="kt-widget5__number">1046</span>
                    <span className="kt-widget5__votes">votes</span>
                  </div>
                </div>
              </div>
            ))}
              {/* <div key='sample' className="kt-widget5__item ">
                <div className="kt-widget5__content">
                  <div className="kt-widget5__pic">
                    <img
                      alt=""
                      className="kt-widget7__img"
                      src={toAbsoluteUrl("/media/products/product6.jpg")}
                    />
                  </div>
                  <div className="kt-widget5__section">
                    <a className="kt-widget5__title">Titanic</a>
                    <div className="kt-widget5__info">
                      <span>Author:</span>
                      <span className="kt-font-info">Keenthemes</span>
                      <span>Released:</span>
                      <span className="kt-font-info">23.08.17</span>
                    </div>
                  </div>
                </div>
                <div className="kt-widget5__content">
                  <div className="kt-widget5__stats">
                    <span className="kt-widget5__number">19,200</span>
                    <span className="kt-widget5__sales">sales</span>
                  </div>
                  <div className="kt-widget5__stats">
                    <span className="kt-widget5__number">1046</span>
                    <span className="kt-widget5__votes">$</span>
                  </div>
                </div>
              </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
