import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../partials/content/Portlet";
import { metronic } from "../../../../_metronic";

import WatchTime from "../../../widgets/Report/WatchTime";
import LatestWatch from "../../../widgets/Report/LatestWatch";
import TopRated from "../../../widgets/Report/TopRated";

export default function Dashboard() {
  const { brandColor, dangerColor, successColor, primaryColor } = useSelector(
    state => ({
      brandColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.brand"
      ),
      dangerColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.danger"
      ),
      successColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.success"
      ),
      primaryColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.primary"
      )
    })
  );

  const chartOptions = useMemo(
    () => ({
      chart1: {
        data: [10, 14, 18, 11, 9, 12, 14, 17, 18, 14],
        color: brandColor,
        border: 3
      },

      chart2: {
        data: [11, 12, 18, 13, 11, 12, 15, 13, 19, 15],
        color: dangerColor,
        border: 3
      },

      chart3: {
        data: [12, 12, 18, 11, 15, 12, 13, 16, 11, 18],
        color: successColor,
        border: 3
      },

      chart4: {
        data: [11, 9, 13, 18, 13, 15, 14, 13, 18, 15],
        color: primaryColor,
        border: 3
      }
    }),
    [brandColor, dangerColor, primaryColor, successColor]
  );

  return (
    <>
      <Portlet>
        <PortletBody fit={true}>
          <div className="row row-no-padding row-col-separator-xl">
            <div className="col-xl-12">
              <WatchTime
                title="Watch Time(min)"
                desc=""
              />
            </div>
          </div>
        </PortletBody>
      </Portlet>

      <div className="row">
        <div className="col-xl-6">
          <TopRated />
        </div>
        <div className="col-xl-6">
          <LatestWatch />
        </div>
      </div>
    </>
  );
}
