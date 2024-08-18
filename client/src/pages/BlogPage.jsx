import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  FilterList, 
  Add,
  Favorite,
  FavoriteBorder,
  Comment,
  Visibility,
  AccessTime
} from "@mui/icons-material";
import "../styles/BlogPage.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiCall, getImageUrl } from "../utils/api";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const categories = [
    { value: "all", label: "All Stories" },
    { value: "travel", label: "Travel Stories" },
    { value: "review", label: "Property Reviews" },
    { value: "guide", label: "Travel Guides" },
    { value: "tips", label: "Travel Tips" },
    { value: "experience", label: "Experiences" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "featured", label: "Featured Stories" },
  ];

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({
        category,
        sort,
        ...(search && { search }),
      });

      const data = await apiCall(`/blog?${params}`);
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [category, sort, search]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleLike = async (blogId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const updatedBlog = await apiCall(`/blog/${blogId}/like`, "PATCH", { userId: user._id });
      // Update the blog in the list
      setBlogs(blogs.map(blog => 
        blog._id === blogId 
          ? { ...blog, likes: updatedBlog.likes }
          : blog
      ));
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleComment = async (blogId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const commentContent = prompt("Write your comment:");
    if (!commentContent || commentContent.trim() === "") return;

    try {
      const updatedBlog = await apiCall(`/blog/${blogId}/comment`, "POST", { 
        userId: user._id,
        content: commentContent.trim()
      });
      // Update the blog in the list
      setBlogs(blogs.map(blog => 
        blog._id === blogId 
          ? { ...blog, comments: updatedBlog.comments }
          : blog
      ));
    } catch (error) {
      console.error("Error commenting on blog:", error);
    }
  };

  const handleReadMore = (blogId) => {
    navigate(`/blog/${blogId}`);
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
      <div className="blog-page">
        <div className="loading">Loading stories...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="blog-page">
        <div className="blog-header">
          <div className="header-content">
            <h1>Travel Stories & Experiences</h1>
            <p>Discover amazing travel stories, property reviews, and local insights from our community</p>
          </div>
          
          <div className="header-actions">
            {user ? (
              <button 
                className="write-story-btn"
                onClick={() => navigate("/blog/create")}
              >
                <Add />
                Write a Story
              </button>
            ) : (
              <button 
                className="write-story-btn"
                onClick={() => navigate("/login")}
              >
                <Add />
                Login to Write a Story
              </button>
            )}
          </div>
        </div>

        <div className="blog-filters">
          <div className="search-section">
            <div className="search-box">
              <Search />
              <input
                type="text"
                placeholder="Search stories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-section">
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterList />
              Filters
            </button>

            {showFilters && (
              <div className="filter-options">
                <div className="filter-group">
                  <label>Category:</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Sort by:</label>
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        <div className="blog-grid">
          {blogs.length === 0 && !error ? (
            <div className="no-blogs">
              <h3>No stories found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                {blog.images && blog.images.length > 0 && (
                  <div className="blog-image">
                    <img 
                      src={getImageUrl(blog.images[0])} 
                      alt={blog.title}
                    />
                    <div className="category-badge">{blog.category}</div>
                  </div>
                )}
                
                <div className="blog-content">
                  <div className="blog-meta">
                    <div className="author">
                      <img 
                        src={getImageUrl(blog.author.profileImagePath) || "/assets/phucmai.png"} 
                        alt={blog.author.firstName}
                      />
                      <span>{blog.author.firstName} {blog.author.lastName}</span>
                    </div>
                    <div className="date">{formatDate(blog.createdAt)}</div>
                  </div>

                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-excerpt">{truncateText(blog.content)}</p>

                  <div className="blog-tags">
                    {blog.tags && blog.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>

                  <div className="blog-stats">
                    <div className="stat">
                      <AccessTime />
                      <span>{blog.readTime} min read</span>
                    </div>
                    <div className="stat">
                      <Visibility />
                      <span>{blog.likes?.length || 0} views</span>
                    </div>
                  </div>

                  <div className="blog-actions">
                    <button 
                      className={`like-btn ${blog.likes?.includes(user?._id) ? 'liked' : ''}`}
                      onClick={() => handleLike(blog._id)}
                    >
                      {blog.likes?.includes(user?._id) ? <Favorite /> : <FavoriteBorder />}
                      <span>{blog.likes?.length || 0}</span>
                    </button>
                    
                    <button 
                      className="comment-btn"
                      onClick={() => handleComment(blog._id)}
                    >
                      <Comment />
                      <span>{blog.comments?.length || 0}</span>
                    </button>

                    <button 
                      className="read-more-btn"
                      onClick={() => handleReadMore(blog._id)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage; 