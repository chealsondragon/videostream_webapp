import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../partials/content/Portlet";
import QuickStatsChart from "../../../widgets/Report/QuickStatsChart";
import NewUsers from "../../../widgets/Report/NewUsers";
import TopActiveUsers from "../../../widgets/Report/TopActiveUsers";
import TopWatchingUsers from "../../../widgets/Report/TopWatchingUsers";
import * as api from "../../../crud/report.crud";

export default function Dashboard() {
  const [data, setData] = React.useState([])
  React.useEffect(() => {
    api.getUserData()
      .then(result => {
        result.data && setData(result.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="row row-full-height">
            <div className="col-sm-4 col-md-4 col-lg-4">
              <Portlet className=" kt-portlet--border-bottom-brand">
                <PortletBody fluid={true}>
                  <QuickStatsChart
                    value={data && data.total_user || 0}
                    desc="Total Users"
                  />
                </PortletBody>
              </Portlet>

            </div>

            <div className="col-sm-4 col-md-4 col-lg-4">

              <Portlet className=" kt-portlet--border-bottom-brand">
                <PortletBody fluid={true}>
                  <QuickStatsChart
                    value={data && data.total_profile || 0}
                    desc="Profile Created"
                  />
                </PortletBody>
              </Portlet>
            </div>

            <div className="col-sm-4 col-md-4 col-lg-4">
              <Portlet className=" kt-portlet--border-bottom-brand">
                <PortletBody fluid={true}>
                  <QuickStatsChart
                    value={data && data.subscribers || 0}
                    desc="Subscribers"
                  />
                </PortletBody>
              </Portlet>

            </div>

          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-4">
          <TopActiveUsers profiles={data && data.active_profiles || []}/>
        </div>
        <div className="col-xl-4">
          <NewUsers profiles={data && data.recent_created_profiles || []}/>
        </div>
        <div className="col-xl-4">
          <TopWatchingUsers profiles={data && data.top_watching_profiles || []}/>
        </div>
      </div>
    </>
  );
}
