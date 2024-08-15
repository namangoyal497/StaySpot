import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  Favorite,
  FavoriteBorder,
  Comment,
  Edit,
  Delete,
  Add
} from "@mui/icons-material";
import "../styles/MyStories.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiCall, getImageUrl } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Settings } from "@mui/icons-material";

const MyStories = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { userId } = useParams();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchMyStories();
    }
  }, [userId]);

  const fetchMyStories = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await apiCall(`/blog/user/${userId}`);
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching my stories:", error);
      setError("Failed to load your stories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (blogId) => {
    try {
      const updatedBlog = await apiCall(`/blog/${blogId}/like`, "PATCH", { userId: user._id });
      setBlogs(blogs.map(blog => 
        blog._id === blogId 
          ? { ...blog, likes: updatedBlog.likes }
          : blog
      ));
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleEdit = (blogId) => {
    navigate(`/blog/edit/${blogId}`);
  };

  const handleManage = (blogId) => {
    navigate(`/blog/manage/${blogId}`);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        await apiCall(`/blog/${blogId}`, "DELETE");
        setBlogs(blogs.filter(blog => blog._id !== blogId));
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete story");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="my-stories-page">
        <div className="loading">Loading your stories...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="my-stories-page">
        <div className="my-stories-header">
          <div className="header-content">
            <h1>My Stories</h1>
            <p>Manage and view your published travel stories</p>
          </div>
          
          <div className="header-actions">
            <button 
              className="write-story-btn"
              onClick={() => navigate("/blog/create")}
            >
              <Add />
              Write New Story
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="my-stories-content">
          {blogs.length === 0 ? (
            <div className="no-stories">
              <h3>No stories yet</h3>
              <p>Start sharing your travel experiences with the community!</p>
              <button 
                className="write-first-story-btn"
                onClick={() => navigate("/blog/create")}
              >
                <Add />
                Write Your First Story
              </button>
            </div>
          ) : (
            <div className="stories-grid">
              {blogs.map((blog) => (
                <div key={blog._id} className="story-card">
                  <div className="story-image">
                    {blog.images && blog.images.length > 0 ? (
                                              <img 
                          src={getImageUrl(blog.images[0])} 
                          alt={blog.title}
                        />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                    <div className="story-actions">
                      <button 
                        className="manage-btn"
                        onClick={() => handleManage(blog._id)}
                        title="Manage Images"
                      >
                        <Settings />
                      </button>
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(blog._id)}
                        title="Edit Content"
                      >
                        <Edit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(blog._id)}
                        title="Delete Story"
                      >
                        <Delete />
                      </button>
                    </div>
                  </div>

                  <div className="story-content">
                    <div className="story-meta">
                      <span className="category">{blog.category}</span>
                      <span className="date">{formatDate(blog.createdAt)}</span>
                    </div>

                    <h3 className="story-title">{blog.title}</h3>
                    <p className="story-excerpt">{truncateText(blog.content)}</p>

                    <div className="story-tags">
                      {blog.tags && blog.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>

                    <div className="story-stats">
                      <button 
                        className={`like-btn ${blog.likes?.includes(user?._id) ? 'liked' : ''}`}
                        onClick={() => handleLike(blog._id)}
                      >
                        {blog.likes?.includes(user?._id) ? <Favorite /> : <FavoriteBorder />}
                        <span>{blog.likes?.length || 0}</span>
                      </button>
                      
                      <div className="comment-count">
                        <Comment />
                        <span>{blog.comments?.length || 0}</span>
                      </div>

                      <div className="read-time">
                        {blog.readTime} min read
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyStories; 