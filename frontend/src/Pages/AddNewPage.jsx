import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCreateNewsPostMutation } from "../hooks/useApi";

const AddNewPage = () => {
  const navigate = useNavigate();
  const createNewsMutation = useCreateNewsPostMutation();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    excerpt: "",
    imgUrl: "",
    content: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // const handleImageChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     // Create preview
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);

  //     // Here you would typically upload to your server/cloud storage
  //     // This is a placeholder for the actual upload logic
  //     try {
  //       // const formData = new FormData();
  //       // formData.append('image', file);
  //       // const response = await axios.post('/api/upload', formData);
  //       // setFormData(prev => ({ ...prev, imgUrl: response.data.url }));

  //       // Temporary: just store the preview URL
  //       setFormData((prev) => ({ ...prev, imgUrl: URL.createObjectURL(file) }));
  //     } catch (error) {
  //       setErrors((prev) => ({ ...prev, image: "Failed to upload image" }));
  //     }
  //   }
  // };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.excerpt.trim()) newErrors.excerpt = "Excerpt is required";
    if (!formData.imgUrl) newErrors.image = "Image is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        await createNewsMutation.mutateAsync(formData);
        navigate("/admin");
      } catch (error) {
        setErrors({ submit: "Failed to create news article" });
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="p-8 w-full mx-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Create New Article</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtitle
          </label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt *
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows="3"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors.excerpt ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.excerpt && (
            <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image *
          </label>
          {/* <input type="text" onChange={handleInputChange} className="mb-2" /> */}
          <input
            type="text"
            name="imgUrl"
            value={formData.imgUrl}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-48 object-cover rounded-lg"
            />
          )}
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>

        {/* Content Editor */}
        <div className="h-[460px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content *
          </label>
          <ReactQuill
            value={formData.content}
            onChange={handleEditorChange}
            className={`bg-white h-96 ${
              errors.content ? "border-red-500" : ""
            }`}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createNewsMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            {createNewsMutation.isPending ? "Creating..." : "Create Article"}
          </button>
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm text-center">{errors.submit}</p>
        )}
      </form>
    </div>
  );
};

export default AddNewPage;
