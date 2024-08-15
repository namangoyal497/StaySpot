import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Remove, 
  CloudUpload,
  Save,
  Cancel
} from "@mui/icons-material";
import "../styles/CreateBlog.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiCall } from "../utils/api";

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "travel",
    tags: "",
    readTime: 5,
  });
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { blogId } = useParams();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const isEditMode = !!blogId;

  const fetchBlogForEdit = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiCall(`/blog/${blogId}`, 'GET', null);
      
      if (response) {
        setFormData({
          title: response.title,
          content: response.content,
          category: response.category,
          tags: response.tags ? response.tags.join(', ') : '',
          readTime: response.readTime,
        });
      } else {
        setError("Failed to load blog for editing");
      }
    } catch (error) {
      console.error("Error fetching blog for edit:", error);
      setError("Failed to load blog for editing");
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    if (isEditMode && blogId) {
      fetchBlogForEdit();
    }
  }, [blogId, isEditMode, fetchBlogForEdit]);

  const categories = [
    { value: "travel", label: "Travel Stories" },
    { value: "review", label: "Property Reviews" },
    { value: "guide", label: "Travel Guides" },
    { value: "tips", label: "Travel Tips" },
    { value: "experience", label: "Experiences" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("Please log in to create a blog post");
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const blogForm = new FormData();
      blogForm.append("title", formData.title);
      blogForm.append("content", formData.content);
      blogForm.append("category", formData.category);
      blogForm.append("tags", formData.tags);
      blogForm.append("readTime", formData.readTime);

      // Append images
      images.forEach((image) => {
        blogForm.append("blogImages", image);
      });

      const endpoint = isEditMode ? `/blog/${blogId}` : "/blog/create";
      const method = isEditMode ? "PUT" : "POST";

      const response = await apiCall(endpoint, method, blogForm, {});

      if (response) {
        navigate(isEditMode ? `/blog/user/${user._id}` : "/blog");
      } else {
        setError(`Failed to ${isEditMode ? 'update' : 'create'} blog post`);
      }
    } catch (err) {
      console.error(`${isEditMode ? 'Update' : 'Create'} blog failed:`, err);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} blog post. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(isEditMode ? `/blog/user/${user._id}` : "/blog");
  };

  return (
    <>
      <Navbar />
      <div className="create-blog">
        <div className="create-blog-header">
          <h1>{isEditMode ? 'Edit Your Travel Story' : 'Write Your Travel Story'}</h1>
          <p>{isEditMode ? 'Update your story and share it with our community' : 'Share your experiences, tips, and adventures with our community'}</p>
        </div>

      <form onSubmit={handleSubmit} className="blog-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Story Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter your story title..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">Your Story *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Share your travel experience, tips, or review..."
            rows={12}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="travel, adventure, tips, etc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="readTime">Estimated Read Time (minutes)</label>
          <input
            type="number"
            id="readTime"
            name="readTime"
            value={formData.readTime}
            onChange={handleInputChange}
            min="1"
            max="60"
          />
        </div>

        <div className="form-group">
          <label>Images (optional)</label>
          <div className="image-upload">
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <label htmlFor="images" className="upload-btn">
              <CloudUpload />
              <span>Upload Images</span>
            </label>
          </div>
          
          {images.length > 0 && (
            <div className="image-preview">
              {images.map((image, index) => (
                <div key={index} className="image-item">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt={`Preview ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image"
                  >
                    <Remove />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleCancel}
            className="cancel-btn"
            disabled={loading}
          >
            <Cancel />
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            <Save />
            {loading ? (isEditMode ? "Updating..." : "Publishing...") : (isEditMode ? "Update Story" : "Publish Story")}
          </button>
        </div>
      </form>
    </div>
    <Footer />
    </>
  );
};

export default CreateBlog; 