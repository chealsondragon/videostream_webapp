import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Title,
  Legend,
} from '@devexpress/dx-react-chart-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { Stack, Animation } from '@devexpress/dx-react-chart';

const legendStyles = () => ({
  root: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
  },
});
const legendRootBase = ({ classes, ...restProps }) => (
  <Legend.Root {...restProps} className={classes.root} />
);
const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase);
const legendLabelStyles = () => ({
  label: {
    whiteSpace: 'nowrap',
  },
});
const legendLabelBase = ({ classes, ...restProps }) => (
  <Legend.Label className={classes.label} {...restProps} />
);
const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase);

export default class Demo extends React.PureComponent {
  render() {
    const { data } = this.props;

    const chartData = [];
    const stackGroup = [];

    if(data && data.label){
      for(var i = 0; i < data.label.length; i ++){
        const item = {
          date: data.label[i]
        };

        for(var key in data.data)
        {
          item[key] = data.data[key][i];
          if(i === 0) stackGroup.push(key);
        }

        chartData.push(item);
      }
    }

    return (
      <Paper>
        <Chart
          data={chartData}
        >
          <ArgumentAxis />
          <ValueAxis
            max={2400}
          />

          {stackGroup.map((game, index) => (
            <BarSeries
              key={game}
              name={game}
              valueField={game}
              argumentField="date"
            />
          ))}
          <Animation />
          <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
          <Title text={`Game Amount ( ${(data && data.currency) || "$"} )`}/>
          <Stack
            stacks={[
              { series: stackGroup },
            ]}
          />
        </Chart>
      </Paper>
    );
  }
}
