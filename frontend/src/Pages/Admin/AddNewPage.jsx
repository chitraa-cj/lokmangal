import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useCreateNewsPostMutation,
  useUpdateNewsPostMutation,
} from "../../hooks/useApi";

const AddNewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingNews = location.state?.news;

  const createNewsMutation = useCreateNewsPostMutation();
  const updateNewsMutation = useUpdateNewsPostMutation();

  const categories = [
    "देश",
    "दुनिया",
    "प्रदेशक खबरे",
    "राजनीति",
    "अप्राध",
    "खेल",
    "हमारा शहर Bhopal",
    "हमारा शहर Jabalpur",
    "हमारा शहर Indore",
    "वीडियो",
    "मनोरंजन",
  ];

  // articleType;
  // navbarCategories;
  // hashtags;
  // footerTags;
  // user;
  // title;
  // conclusion;
  // imgUrl;
  // content;

  const [formData, setFormData] = useState({
    articleType: existingNews ? existingNews.articleType : "main", // Default to "main"
    navbarCategories: existingNews?.navbarCategories || [],
    hashtags: existingNews?.hashtags || [],
    footerTags: existingNews?.footerTags || [],
    title: existingNews ? existingNews.title : "",
    conclusion: existingNews ? existingNews.conclusion : "",
    imgUrl: existingNews ? existingNews.imgUrl : "",
    content: existingNews ? existingNews.content : "",
    _id: existingNews ? existingNews._id : undefined,
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategorySelect = (category) => {
    // console.log("clicked");
    setFormData((prev) => {
      const updatedCategories = prev.navbarCategories.includes(category)
        ? prev.navbarCategories.filter((c) => c !== category)
        : [...prev.navbarCategories, category];

      return {
        ...prev,
        navbarCategories: updatedCategories,
      };
    });
    if (errors.navbarCategories) {
      setErrors((prev) => ({ ...prev, navbarCategories: "" }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, imgUrl: URL.createObjectURL(file) }));
    }
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: "" }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "LOK_MANGAL");
    data.append("cloud_name", "drp32fxif");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/drp32fxif/image/upload",
        {
          method: "POST",
          body: data,
        },
      );

      const uploadedIMGUrl = await res.json();

      // Add error checking
      if (!uploadedIMGUrl?.url) {
        console.error("No URL in response:", uploadedIMGUrl);
        return;
      }

      setFormData((prev) => {
        const newState = { ...prev, imgUrl: uploadedIMGUrl.url };
        console.log("Updated state:", newState); // Log inside setState callback
        return newState;
      });

      // If you need to track changes, use useEffect
      // Add this hook in your component:
      // useEffect(() => {
      //     console.log("formData.imgUrl changed:", formData.imgUrl);
      // }, [formData.imgUrl]);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.conclusion.trim())
      newErrors.conclusion = "Conclusion is required";
    if (!formData.imgUrl) newErrors.image = "Image is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.articleType)
      newErrors.articleType = "Article type is required"; // Validate articleType
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        const dataToSubmit = {
          articleType: formData.articleType,
          navbarCategories: formData.navbarCategories,
          hashtags: formData.hashtags,
          footerTags: formData.footerTags,
          title: formData.title,
          conclusion: formData.conclusion,
          imgUrl: formData.imgUrl,
          content: formData.content,
        };
        // console.log(dataToSubmit);

        if (formData._id) {
          await updateNewsMutation.mutateAsync({
            id: formData._id,
            ...dataToSubmit,
          });
        } else {
          await createNewsMutation.mutateAsync(dataToSubmit);
        }
        navigate("/admin");
      } catch (error) {
        // Extract specific error messages from the error response
        const errorMessages = error.response?.data?.errors || {};
        const formattedErrors = {};
        for (const key in errorMessages) {
          formattedErrors[key] = errorMessages[key].message;
        }
        setErrors((prev) => ({
          ...prev,
          ...formattedErrors,
          submit: "Failed to create or update article",
        }));
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full p-8">
      <h1 className="mb-6 text-2xl font-bold">
        {formData._id ? "Update Article" : "Create New Article"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
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

        {/* Article Type */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Article Type *
          </label>
          <select
            name="articleType"
            value={formData.articleType}
            onChange={handleInputChange}
            className={`w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.articleType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="main">Main</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="grid">Grid</option>
          </select>
          {errors.articleType && (
            <p className="mt-1 text-sm text-red-500">{errors.articleType}</p>
          )}
        </div>

        {/* Categories Multi-Select */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Categories * (Selected: {formData.navbarCategories.length})
          </label>
          <div className="mb-2 flex flex-wrap gap-2">
            {formData.navbarCategories.map((category) => (
              <span
                key={category}
                onClick={() => handleCategorySelect(category)}
                className="cursor-pointer rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 hover:bg-blue-200"
              >
                {category} ×
              </span>
            ))}
          </div>
          <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-300 bg-white">
            {categories.map((category) => (
              <div
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`cursor-pointer border-b border-gray-200 px-4 py-2 last:border-b-0 hover:bg-gray-50 ${
                  formData.navbarCategories.includes(category)
                    ? "bg-blue-50 font-medium text-blue-600"
                    : ""
                }`}
              >
                {category}
              </div>
            ))}
          </div>
          {errors.navbarCategories && (
            <p className="mt-1 text-sm text-red-500">
              {errors.navbarCategories}
            </p>
          )}
        </div>

        {/* Hashtags */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Hashtags *
          </label>
          <input
            type="text"
            name="hashtags"
            value={formData.hashtags.join(", ")} // Join array for display
            onChange={(e) => {
              const hashtagsArray = e.target.value
                .split(",")
                .map((tag) => tag.trim());
              setFormData((prev) => ({ ...prev, hashtags: hashtagsArray }));
            }}
            className={`w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.hashtags ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.hashtags && (
            <p className="mt-1 text-sm text-red-500">{errors.hashtags}</p>
          )}
        </div>

        {/* Footer Tags */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Footer Tags *
          </label>
          <input
            type="text"
            name="footerTags"
            value={formData.footerTags.join(", ")} // Join array for display
            onChange={(e) => {
              const footerTagsArray = e.target.value
                .split(",")
                .map((tag) => tag.trim());
              setFormData((prev) => ({ ...prev, footerTags: footerTagsArray }));
            }}
            className={`w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.footerTags ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.footerTags && (
            <p className="mt-1 text-sm text-red-500">{errors.footerTags}</p>
          )}
        </div>

        {/* Conclusion */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Conclusion *
          </label>
          <textarea
            name="conclusion"
            value={formData.conclusion}
            onChange={handleInputChange}
            rows="3"
            className={`w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.conclusion ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.conclusion && (
            <p className="mt-1 text-sm text-red-500">{errors.conclusion}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Featured Image *
          </label>
          <input
            type="file"
            name="imgUrl"
            onChange={handleFileUpload}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.imgUrl && (
            <div className="flex justify-center">
              <img
                src={formData.imgUrl}
                alt="Preview"
                className="my-4 h-full w-[700px] rounded-lg object-cover"
              />
            </div>
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
            className={`h-96 bg-white ${errors.content ? "border-red-500" : ""}`}
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
              formData._id
                ? updateNewsMutation.isPending
                : createNewsMutation.isPending
            }
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
          >
            {formData._id
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

// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import {
//   useCreateNewsPostMutation,
//   useUpdateNewsPostMutation,
// } from "../hooks/useApi";

// const AddNewPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const existingNews = location.state?.news;

//   const createNewsMutation = useCreateNewsPostMutation();
//   const updateNewsMutation = useUpdateNewsPostMutation();

//   const categories = [
//     "देश",
//     "दुनिया",
//     "प्रदेशक खबरे",
//     "राजनीति",
//     "अप्राध",
//     "खेल",
//     "हमारा शहर Bhopal",
//     "हमारा शहर Jabalpur",
//     "हमारा शहर Indore",
//     "वीडियो",
//     "मनोरंजन",
//   ];

//   const [formData, setFormData] = useState({
//     title: existingNews ? existingNews.title : "",
//     subtitle: existingNews ? existingNews.subtitle : "",
//     excerpt: existingNews ? existingNews.excerpt : "",
//     imgUrl: existingNews ? existingNews.imgUrl : "",
//     content: existingNews ? existingNews.content : "",
//     categories: existingNews?.categories || [], // Ensure categories is initialized
//     _id: existingNews ? existingNews._id : undefined,
//   });

//   console.log("Initial formData:", formData); // Debug log

//   const [imagePreview, setImagePreview] = useState(
//     existingNews ? existingNews.imgUrl : null,
//   );
//   const [errors, setErrors] = useState({});

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleCategorySelect = (category) => {
//     setFormData((prev) => {
//       // Create a new array with the updated categories
//       const updatedCategories = prev.categories.includes(category)
//         ? prev.categories.filter((c) => c !== category)
//         : [...prev.categories, category];

//       console.log("Updated categories:", updatedCategories); // Debug log

//       return {
//         ...prev,
//         categories: updatedCategories,
//       };
//     });
//     if (errors.categories) {
//       setErrors((prev) => ({ ...prev, categories: "" }));
//     }
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);

//       try {
//         setFormData((prev) => ({ ...prev, imgUrl: URL.createObjectURL(file) }));
//       } catch (error) {
//         setErrors((prev) => ({ ...prev, image: "Failed to upload image" }));
//       }
//     }
//   };

//   const handleEditorChange = (content) => {
//     setFormData((prev) => ({ ...prev, content }));
//     if (errors.content) {
//       setErrors((prev) => ({ ...prev, content: "" }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.title.trim()) newErrors.title = "Title is required";
//     if (!formData.excerpt.trim()) newErrors.excerpt = "Excerpt is required";
//     if (!formData.imgUrl) newErrors.image = "Image is required";
//     if (!formData.content.trim()) newErrors.content = "Content is required";
//     if (!formData.categories || formData.categories.length === 0)
//       newErrors.categories = "At least one category is required";
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = validateForm();

//     // Debug log before submission
//     console.log("Submitting formData:", formData);

//     if (Object.keys(newErrors).length === 0) {
//       try {
//         const dataToSubmit = {
//           title: formData.title,
//           subtitle: formData.subtitle,
//           excerpt: formData.excerpt,
//           imgUrl: formData.imgUrl,
//           content: formData.content,
//           categories: formData.categories, // Ensure categories is included
//         };

//         if (formData._id) {
//           // Update existing post
//           await updateNewsMutation.mutateAsync({
//             id: formData._id,
//             ...dataToSubmit,
//           });
//         } else {
//           // Create new post
//           await createNewsMutation.mutateAsync(dataToSubmit);
//         }
//         navigate("/admin");
//       } catch (error) {
//         console.error("Submission error:", error); // Debug log
//         setErrors({
//           submit: formData._id
//             ? "Failed to update news article"
//             : "Failed to create news article",
//         });
//       }
//     } else {
//       setErrors(newErrors);
//     }
//   };

//   return (
//     <div className="mx-auto min-h-screen w-full p-8">
//       <h1 className="mb-6 text-2xl font-bold">
//         {formData._id ? "Update Article" : "Create New Article"}
//       </h1>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Title */}
//         <div>
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Title *
//           </label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleInputChange}
//             className={`w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
//               errors.title ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors.title && (
//             <p className="mt-1 text-sm text-red-500">{errors.title}</p>
//           )}
//         </div>

//         {/* Categories Multi-Select */}
//         <div>
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Categories * (Selected: {formData.categories.length})
//           </label>
//           {/* Selected Categories */}
//           <div className="mb-2 flex flex-wrap gap-2">
//             {formData.categories.map((category) => (
//               <span
//                 key={category}
//                 onClick={() => handleCategorySelect(category)}
//                 className="cursor-pointer rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 hover:bg-blue-200"
//               >
//                 {category} ×
//               </span>
//             ))}
//           </div>
//           {/* Categories Selection */}
//           <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-300 bg-white">
//             {categories.map((category) => (
//               <div
//                 key={category}
//                 onClick={() => handleCategorySelect(category)}
//                 className={`cursor-pointer border-b border-gray-200 px-4 py-2 last:border-b-0 hover:bg-gray-50 ${
//                   formData.categories.includes(category)
//                     ? "bg-blue-50 font-medium text-blue-600"
//                     : ""
//                 }`}
//               >
//                 {category}
//               </div>
//             ))}
//           </div>
//           {errors.categories && (
//             <p className="mt-1 text-sm text-red-500">{errors.categories}</p>
//           )}
//         </div>

//         {/* Rest of your form fields... */}
//         {/* Subtitle */}
//         <div>
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Subtitle
//           </label>
//           <input
//             type="text"
//             name="subtitle"
//             value={formData.subtitle}
//             onChange={handleInputChange}
//             className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Excerpt */}
//         <div>
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Excerpt *
//           </label>
//           <textarea
//             name="excerpt"
//             value={formData.excerpt}
//             onChange={handleInputChange}
//             rows="3"
//             className={`w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
//               errors.excerpt ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors.excerpt && (
//             <p className="mt-1 text-sm text-red-500">{errors.excerpt}</p>
//           )}
//         </div>

//         {/* Image Upload */}
//         <div>
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Featured Image *
//           </label>
//           <input
//             type="text"
//             name="imgUrl"
//             value={formData.imgUrl}
//             onChange={handleInputChange}
//             className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {imagePreview && (
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="mt-2 max-h-48 w-full rounded-lg object-cover"
//             />
//           )}
//           {errors.image && (
//             <p className="mt-1 text-sm text-red-500">{errors.image}</p>
//           )}
//         </div>

//         {/* Content Editor */}
//         <div className="h-[460px]">
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Content *
//           </label>
//           <ReactQuill
//             value={formData.content}
//             onChange={handleEditorChange}
//             className={`h-96 bg-white ${errors.content ? "border-red-500" : ""}`}
//           />
//           {errors.content && (
//             <p className="mt-1 text-sm text-red-500">{errors.content}</p>
//           )}
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end gap-4">
//           <button
//             type="button"
//             onClick={() => navigate("/admin")}
//             className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={
//               formData._id
//                 ? updateNewsMutation.isPending
//                 : createNewsMutation.isPending
//             }
//             className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
//           >
//             {formData._id
//               ? updateNewsMutation.isPending
//                 ? "Updating..."
//                 : "Update Article"
//               : createNewsMutation.isPending
//                 ? "Creating..."
//                 : "Create Article"}
//           </button>
//         </div>

//         {errors.submit && (
//           <p className="text-center text-sm text-red-500">{errors.submit}</p>
//         )}
//       </form>
//     </div>
//   );
// };

// export default AddNewPage;
