import React from "react";

// Define Props Type
interface CategoriesDropdownProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({ selectedCategory, onCategoryChange }) => {
  const categories: string[] = [
    "Food and Drink",
    "Beauty and Spa",
    "Health and Fitness",
    "Fun and Leisure",
    "Room Nights",
    "Services and Retail",
  ];

  return (
    <select
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value)}
      className="border p-3 w-full rounded-lg"
    >
      <option value="">Select Category</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default CategoriesDropdown;
