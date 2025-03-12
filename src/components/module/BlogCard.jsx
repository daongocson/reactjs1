import { Card } from "antd";
import { Link } from "react-router-dom";

const BlogCard = ({ post }) => {
  return (
    <Card title={post.title} bordered={true} style={{ width: "100%" }}>
      <p>{post.excerpt}</p>
      <Link to={`/post/${post.id}`}>Đọc tiếp</Link>
    </Card>
  );
};

export default BlogCard;
