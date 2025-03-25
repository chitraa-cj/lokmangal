import React, { useState } from "react";
import { ChevronDown, X, Tag, Layers, FileText } from "lucide-react";

// Article Type Selector
const ArticleTypeSelector = ({ value, onChange, errors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const articleTypes = [
    {
      value: "breakingNews",
      label: "Breaking News",
      icon: <Tag className="mr-2 text-red-500" />,
    },
    {
      value: "main",
      label: "Main Story",
      icon: <Layers className="mr-2 text-blue-500" />,
    },
    {
      value: "left",
      label: "Left Column",
      icon: <FileText className="mr-2 text-green-500" />,
    },
    {
      value: "right",
      label: "Right Column",
      icon: <FileText className="mr-2 text-purple-500" />,
    },
    {
      value: "grid",
      label: "Grid Layout",
      icon: <Layers className="mr-2 text-orange-500" />,
    },
  ];

  const selectedType = articleTypes.find((type) => type.value === value);

  return (
    <div className="relative w-full pt-8">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-2 ${errors ? "border-red-500" : "border-gray-300"} ${isOpen ? "ring-2 ring-blue-500" : ""}`}
      >
        <div className="flex items-center">
          {selectedType?.icon}
          {selectedType?.label || "Select Article Type"}
        </div>
        <ChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
          {articleTypes.map((type) => (
            <div
              key={type.value}
              onClick={() => {
                onChange(type.value);
                setIsOpen(false);
              }}
              className={`flex cursor-pointer items-center px-4 py-2 hover:bg-gray-50 ${value === type.value ? "bg-blue-50 font-medium text-blue-600" : ""}`}
            >
              {type.icon}
              {type.label}
            </div>
          ))}
        </div>
      )}
      {errors && <p className="mt-1 text-sm text-red-500">{errors}</p>}
    </div>
  );
};

// Categories Selector
const CategoriesSelector = ({
  categories,
  selectedCategories,
  onSelect,
  errors,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {selectedCategories.map((category) => (
          <span
            key={category}
            className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
          >
            {category}
            <X
              className="ml-2 cursor-pointer"
              size={16}
              onClick={() => onSelect(category)}
            />
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2 w-full rounded-lg border border-gray-300 px-4 py-2"
      />
      <div
        className={`max-h-48 overflow-y-auto rounded-lg border ${errors ? "border-red-500" : "border-gray-300"}`}
      >
        {filteredCategories.map((category) => (
          <div
            key={category}
            onClick={() => onSelect(category)}
            className={`cursor-pointer px-4 py-2 hover:bg-gray-50 ${selectedCategories.includes(category) ? "bg-blue-50 text-blue-600" : ""}`}
          >
            {category}
          </div>
        ))}
      </div>
      {errors && <p className="mt-1 text-sm text-red-500">{errors}</p>}
    </div>
  );
};

// Tagging Component
const TagInput = ({ label, tags, onTagsChange, errors }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
        setInputValue("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
          >
            #{tag}
            <X
              className="ml-2 cursor-pointer"
              size={16}
              onClick={() => removeTag(tag)}
            />
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder={`Enter ${label.toLowerCase()} (press Enter or , to add)`}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`w-full rounded-lg border px-4 py-2 ${errors ? "border-red-500" : "border-gray-300"}`}
      />
      {errors && <p className="mt-1 text-sm text-red-500">{errors}</p>}
    </div>
  );
};

// Improved Conclusion Input
const ConclusionInput = ({ value, onChange, errors }) => {
  return (
    <div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder="Write a concise summary or concluding statement..."
        rows={4}
        className={`w-full resize-y rounded-lg border px-4 py-2 ${errors ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      <div className="mt-1 text-sm text-gray-500">
        {value.length} / 300 characters
      </div>
      {errors && <p className="mt-1 text-sm text-red-500">{errors}</p>}
    </div>
  );
};

export { ArticleTypeSelector, CategoriesSelector, TagInput, ConclusionInput };
