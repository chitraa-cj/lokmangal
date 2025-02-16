import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useCreateNewsPostMutation,
  useUpdateNewsPostMutation,
} from "../hooks/useApi";

const AddNewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingNews = location.state?.news;

  const createNewsMutation = useCreateNewsPostMutation();
  const updateNewsMutation = useUpdateNewsPostMutation();

  const [formData, setFormData] = useState({
    title: existingNews ? existingNews.title : "",
    subtitle: existingNews ? existingNews.subtitle : "",
    excerpt: existingNews ? existingNews.excerpt : "",
    imgUrl: existingNews ? existingNews.imgUrl : "",
    content: existingNews ? existingNews.content : "",
    id: existingNews ? existingNews.id : undefined,
  });
  const [imagePreview, setImagePreview] = useState(
    existingNews ? existingNews.imgUrl : null,
  );
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
        if (formData.id) {
          await updateNewsMutation.mutateAsync(formData);
        } else {
          await createNewsMutation.mutateAsync(formData);
        }
        navigate("/admin");
      } catch (error) {
        setErrors({
          submit: formData.id
            ? "Failed to update news article"
            : "Failed to create news article",
        });
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full p-8">
      <h1 className="mb-6 text-2xl font-bold">
        {formData.id ? "Update Article" : "Create New Article"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Subtitle */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Subtitle
          </label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Excerpt *
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows="3"
            className={`w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.excerpt ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.excerpt && (
            <p className="mt-1 text-sm text-red-500">{errors.excerpt}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Featured Image *
          </label>
          {/* <input type="text" onChange={handleInputChange} className="mb-2" /> */}
          <input
            type="text"
            name="imgUrl"
            value={formData.imgUrl}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-48 w-full rounded-lg object-cover"
            />
          )}
          {errors.image && (
            <p className="mt-1 text-sm text-red-500">{errors.image}</p>
          )}
        </div>

        {/* Content Editor */}
        <div className="h-[460px]">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Content *
          </label>
          <ReactQuill
            value={formData.content}
            onChange={handleEditorChange}
            className={`h-96 bg-white ${
              errors.content ? "border-red-500" : ""
            }`}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              formData.id
                ? updateNewsMutation.isPending
                : createNewsMutation.isPending
            }
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
          >
            {formData.id
              ? updateNewsMutation.isPending
                ? "Updating..."
                : "Update Article"
              : createNewsMutation.isPending
                ? "Creating..."
                : "Create Article"}
          </button>
        </div>

        {errors.submit && (
          <p className="text-center text-sm text-red-500">{errors.submit}</p>
        )}
      </form>
    </div>
  );
};

export default AddNewPage;
