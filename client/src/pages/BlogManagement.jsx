import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import { apiCall } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogImagesUpdate from '../components/BlogImagesUpdate';
import '../styles/BlogManagement.scss';

const BlogManagement = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { blogId } = useParams();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiCall(`/blog/${blogId}`);
      setBlog(data);
    } catch (err) {
      setError('Failed to load blog details');
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  const handleImagesUpdate = (updatedBlog) => {
    setBlog(updatedBlog);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await apiCall(`/blog/${blogId}`, 'DELETE');
        navigate('/blog');
      } catch (err) {
        setError('Failed to delete blog post');
        console.error('Error deleting blog:', err);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="blog-management">
          <div className="loading">Loading blog details...</div>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="blog-management">
          <div className="error">Blog post not found</div>
        </div>
      </>
    );
  }

  // Check if user is the author
  if (blog.author._id !== user._id) {
    return (
      <>
        <Navbar />
        <div className="blog-management">
          <div className="error">You can only manage your own blog posts</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="blog-management">
        <div className="header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowBack />
            Back
          </button>
          <h1>Manage Blog Post</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="blog-content">
          <div className="blog-info">
            <h2>{blog.title}</h2>
            <p className="category">{blog.category}</p>
            <p className="date">
              {new Date(blog.createdAt).toLocaleDateString()}
            </p>
            <p className="content">{blog.content.substring(0, 200)}...</p>
          </div>

          <div className="blog-images">
            <h3>Blog Images</h3>
            <BlogImagesUpdate 
              blogId={blog._id}
              currentImages={blog.images}
              onUpdate={handleImagesUpdate}
            />
          </div>

          <div className="blog-actions">
            <button className="edit-btn" onClick={() => navigate(`/blog/edit/${blog._id}`)}>
              <Edit />
              Edit Content
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              <Delete />
              Delete Blog Post
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogManagement; 