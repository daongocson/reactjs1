import { Card } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Tháng 1", views: 400 },
  { name: "Tháng 2", views: 600 },
  { name: "Tháng 3", views: 800 },
  { name: "Tháng 4", views: 1200 },
];

const ChartComponent = () => {
  return (
    <Card title="Số lượng cuộc gọi">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ChartComponent;
