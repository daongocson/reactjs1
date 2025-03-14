import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Loại A', value1: 400, value2: 240, value3: 100 },
  { name: 'Loại B', value1: 300, value2: 139, value3: 221 },
  { name: 'Loại C', value1: 500, value2: 980, value3: 229 },
  { name: 'Loại D', value1: 200, value2: 390, value3: 100 },
  { name: 'Loại E', value1: 350, value2: 480, value3: 300 },
];

export default function BarChart({dataX}) {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="knm" fill="#8884d8" barSize={50} />
          <Bar dataKey="hl" fill="#82ca9d" barSize={50} />
          <Bar dataKey="khl" fill="#ffc658" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}