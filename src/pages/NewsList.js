import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagementPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:9000/articles");
        setArticles(response.data);
      } catch (err) {
        setError("Error fetching articles");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await axios.delete(`http://localhost:9000/articles/${id}`);
        setArticles(articles.filter((article) => article._id !== id));
        alert("Article deleted successfully");
      } catch (err) {
        setError("Error deleting article");
        console.error(err);
      }
    }
  };

  const getExcerpt = (content) => {
    const words = content.split(" ");
    return words.slice(0, 20).join(" ") + (words.length > 20 ? "..." : "");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">News List</h2>
      <ul className="mt-4">
        {articles.map((article) => (
          <li key={article._id} className="border-b py-2">
            <h3 className="font-semibold">{article.title}</h3>
            <p>{getExcerpt(article.content)}</p>
            <p className="text-gray-500">
              {new Date(article.date).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleDelete(article._id)}
              className="bg-red-500 text-white p-1 rounded mt-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagementPage;
