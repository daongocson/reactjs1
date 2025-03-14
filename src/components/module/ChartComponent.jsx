import { Card, Layout, Typography } from "antd";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ChartComponent = ({data}) => {
  const { Title } = Typography;
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042","#FF8142","#F08042"];
  const { Header, Content } = Layout;
  const total = data.reduce((acc, entry) => acc + entry.value, 0);
  return (
    <Content style={{ padding: "20px" }}>
    <div style={{ marginTop: 40 }}>
          <Title level={4}>Tổng Bệnh nhân khảo sát ({total})</Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name={"Số lượng"} />
            </BarChart>
          </ResponsiveContainer>
        </div>       
    <Card title="Thống kê tỉ lệ">
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d"
               label={({ payload }) => {
                  const percentage = ((payload.value / total) * 100).toFixed(2) + '%';
                  return `${payload.name}: ${percentage}`;
                }}
               >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    </Card>
    </Content>
  );
};

export default ChartComponent;
