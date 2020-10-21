/* eslint-disable jsx-a11y/anchor-has-content,no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import PortletHeaderDropdown from "../../partials/content/CustomDropdowns/PortletHeaderDropdown";

export default function NewUsers({ profiles }) {
  return (
    <>
      <div className="kt-portlet kt-portlet--height-fluid">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">Recently Created</h3>
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
                <a className="btn-label-dark">{profile.created_at}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
