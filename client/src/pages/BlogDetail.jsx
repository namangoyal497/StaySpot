import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  Favorite,
  FavoriteBorder,
  Comment,
  ArrowBack,
  AccessTime,
  Visibility
} from "@mui/icons-material";
import "../styles/BlogDetail.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiCall, getProfileImageUrl, getBlogImageUrl } from "../utils/api";

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentContent, setCommentContent] = useState("");
  
  const { blogId } = useParams();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchBlogDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await apiCall(`/blog/${blogId}`, 'GET', null);
      setBlog(data);
    } catch (error) {
      console.error("Error fetching blog detail:", error);
      setError("Failed to load blog post. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    fetchBlogDetail();
  }, [fetchBlogDetail]);

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const updatedBlog = await apiCall(`/blog/${blogId}/like`, 'PATCH', { userId: user._id });
      setBlog(updatedBlog);
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate("/login");
      return;
    }

    if (!commentContent.trim()) return;

    try {
      const updatedBlog = await apiCall(`/blog/${blogId}/comment`, 'POST', { 
        userId: user._id,
        content: commentContent.trim()
      });
      setBlog(updatedBlog);
      setCommentContent("");
    } catch (error) {
      console.error("Error commenting on blog:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="loading">Loading blog post...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-page">
        <div className="error-message">
          <p>{error || "Blog post not found"}</p>
          <button onClick={() => navigate("/blog")}>Back to Blog</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="blog-detail-page">
        <div className="blog-detail-header">
          <button 
            className="back-btn"
            onClick={() => navigate("/blog")}
          >
            <ArrowBack />
            Back to Blog
          </button>
        </div>

        <div className="blog-detail-content">
          <div className="blog-header">
            <div className="blog-meta">
              <div className="author">
                <img 
                  src={blog.author?.profileImage ? getProfileImageUrl(blog.author._id) : "/assets/phucmai.png"} 
                  alt={blog.author?.firstName || "Author"}
                />
                <div>
                  <span className="author-name">{blog.author?.firstName || ""} {blog.author?.lastName || ""}</span>
                  <span className="publish-date">{formatDate(blog.createdAt)}</span>
                </div>
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
            </div>

            <h1 className="blog-title">{blog.title || "Untitled Blog Post"}</h1>
            
            <div className="blog-tags">
              {blog.tags && blog.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          </div>

          {blog.images && blog.images.length > 0 && (
            <div className="blog-images">
              {blog.images.map((image, index) => (
                <img 
                  key={index}
                  src={getBlogImageUrl(blog._id, index)} 
                  alt={`${index + 1}`}
                />
              ))}
            </div>
          )}

          <div className="blog-body">
            <div className="content">
              {blog.content ? blog.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              )) : <p>Content unavailable</p>}
            </div>
          </div>

          <div className="blog-actions">
            <button 
              className={`like-btn ${blog.likes?.includes(user?._id) ? 'liked' : ''}`}
              onClick={handleLike}
            >
              {blog.likes?.includes(user?._id) ? <Favorite /> : <FavoriteBorder />}
              <span>{blog.likes?.length || 0} likes</span>
            </button>
          </div>

          <div className="comments-section">
            <h3>Comments ({blog.comments?.length || 0})</h3>
            
            {user && (
              <form onSubmit={handleComment} className="comment-form">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                />
                <button type="submit" disabled={!commentContent.trim()}>
                  <Comment />
                  Post Comment
                </button>
              </form>
            )}

            <div className="comments-list">
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <div className="comment-author">
                      <img 
                        src={comment.user?.profileImage ? getProfileImageUrl(comment.user._id) : "/assets/phucmai.png"} 
                        alt={comment.user?.firstName || "User"}
                      />
                      <div>
                        <span className="author-name">
                          {comment.user?.firstName || ""} {comment.user?.lastName || ""}
                        </span>
                        <span className="comment-date">
                          {formatDate(comment.date)}
                        </span>
                      </div>
                    </div>
                    <p className="comment-content">{comment.content || "Comment content unavailable"}</p>
                  </div>
                ))
              ) : (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetail; 