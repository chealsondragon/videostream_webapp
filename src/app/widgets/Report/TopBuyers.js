/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { toAbsoluteUrl } from "../../../_metronic/utils/utils";
import PortletHeaderDropdown from "../../partials/content/CustomDropdowns/PortletHeaderDropdown";

export default function TopBuyers({ profiles }) {
  return (
    <>
      <div className="kt-portlet kt-portlet--height-fluid">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">Top Buyers</h3>
          </div>
          <PortletHeaderDropdown />
        </div>
        <div className="kt-portlet__body">
          <div className="kt-widget4">
            {profiles && profiles.map((profile, index) => (
              <div key={index} className="kt-widget4__item ">
                <div className="kt-widget4__pic kt-widget4__pic--pic ">
                  <img alt="" src={profile && profile.logo_url} />
                </div>
                <div className="kt-widget4__info ">
                  <a
                    className="kt-widget4__username"
                  >
                    {profile.name}
                  </a>
                  <a
                    className="kt-widget4__title"
                  />
                  <p className="kt-widget4__text ">
                    {profile.username}
                  </p>
                </div>
                <a className="btn btn-sm btn-default btn-label-facebook kt-margin-r-10">Spent {parseFloat(profile.spent).toFixed(2)} $</a>
                <a className="btn btn-sm btn-label-info">Bought {profile.products} movies</a>
              </div>
            ))}
              {/* <div className="kt-widget4__item ">
                <div className="kt-widget4__pic kt-widget4__pic--pic ">
                  <img alt="" src="" />
                </div>
                <div className="kt-widget4__info ">
                  <a
                    className="kt-widget4__username"
                  >
                    fqwfeq
                  </a>
                  <a
                    className="kt-widget4__title"
                  />
                  <p className="kt-widget4__text ">
                    vwef
                  </p>
                </div>
                <a className="btn btn-sm btn-default btn-label-facebook kt-margin-r-10">Spent 45$</a>
                <a className="btn btn-sm btn-label-info">Bought 12 movies</a>
              </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
