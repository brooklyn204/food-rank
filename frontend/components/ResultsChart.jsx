import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

export default function ResultsChart(data) {
    console.log('data:', data.data);
    console.log('is array?', Array.isArray(data.data));

    return (
    <div style={{ width: 500, height: 400, padding: '2rem' }}> {/* TODO: make this dynamic sizing; move CSS to styles file; mess with colors */}
      <ResponsiveContainer>
        <BarChart
          data={data.data.map((location) => ({ label: location.name, value: location.votes}))}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          barSize={50}
        >
          <CartesianGrid strokeDasharray="3 0" stroke="#e0e0e0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 14 }}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 14 }}
            label={{
              value: 'Votes',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' },
            }}
          />
          {/* TODO: decide whether to leave this in or not: <Tooltip /> */}
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            fill="#3b82f6" // TODO: change this color
            animationDuration={500}
          >
            <LabelList
              dataKey="value"
              position="top"
              style={{
                fill: '#5b5b5b',
                fontWeight: 'bold',
                fontSize: 14,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}