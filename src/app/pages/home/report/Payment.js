import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../partials/content/Portlet";
import QuickStatsChart from "../../../widgets/Report/QuickStatsChart";
import BestSellingMovies from "../../../widgets/Report/BestSellingMovies";
import TopBuyers from "../../../widgets/Report/TopBuyers";
import * as api from "../../../crud/report.crud";

export default function Payment() {
  const [data, setData] = React.useState([])
  React.useEffect(() => {
    api.getPaymentData()
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
                    value={data && data.revenue || 0}
                    desc="Revenue"
                  />
                </PortletBody>
              </Portlet>

            </div>

            <div className="col-sm-4 col-md-4 col-lg-4">

              <Portlet className=" kt-portlet--border-bottom-brand">
                <PortletBody fluid={true}>
                  <QuickStatsChart
                    value={data && data.transaction || 0}
                    desc="Transactions"
                  />
                </PortletBody>
              </Portlet>
            </div>

            <div className="col-sm-4 col-md-4 col-lg-4">
              <Portlet className=" kt-portlet--border-bottom-brand">
                <PortletBody fluid={true}>
                  <QuickStatsChart
                    value={data && data.total_products || 0}
                    desc="Sold Products"
                  />
                </PortletBody>
              </Portlet>

            </div>

          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-6">
          <BestSellingMovies profiles={data && data.best_selling_movies || []}/>
        </div>
        <div className="col-xl-6">
          <TopBuyers profiles={data && data.top_buyers || []}/>
        </div>
      </div>
    </>
  );
}
