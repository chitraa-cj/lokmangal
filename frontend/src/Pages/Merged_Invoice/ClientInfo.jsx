import React, { useCallback, useState } from "react";
import AsyncSelect from "react-select/async";
import { debounce } from "lodash";

const ClientInfoSelect = ({
  endpoint = "release-order",
  value,
  onChange,
  noPrint = "false",
}) => {
  // Keep internal state just for the select component
  const [selectedOption, setSelectedOption] = useState(null);

  // Function to load options from the server
  const loadOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return [];

    try {
      const response = await fetch(
        `/api/${endpoint}/client-info?query=${encodeURIComponent(inputValue)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      return data.map((client) => ({
        value: client,
        label: client.split("\n")[0],
      }));
    } catch (error) {
      console.error("Error fetching client info:", error);
      return [];
    }
  };

  const debouncedLoadOptions = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then(callback);
    }, 300),
    []
  );

  // Handle selection change
  const handleSelectChange = (selected) => {
    setSelectedOption(selected);
    const fakeEvent = {
      target: {
        name: "clientInfo",
        value: selected ? selected.value : "",
      },
    };
    onChange(fakeEvent);
  };

  // Handle manual textarea changes
  const handleTextareaChange = (e) => {
    setSelectedOption(null); // Clear select when manually editing
    onChange(e);
  };

  return (
    <div className="flex flex-col gap-4">
      <AsyncSelect
        cacheOptions
        defaultOptions
        value={selectedOption}
        loadOptions={(inputValue, callback) =>
          debouncedLoadOptions(inputValue, callback)
        }
        onChange={handleSelectChange}
        placeholder="Search for existing client..."
        noOptionsMessage={({ inputValue }) =>
          inputValue.length < 2
            ? "Type at least 2 characters to search"
            : "No clients found"
        }
        className={`w-full ${noPrint ? "noPrint" : ""}`}
        isClearable
      />

      <textarea
        name="clientInfo"
        value={value}
        onChange={handleTextareaChange}
        rows={6}
        className="w-full uppercase px-2 p-2 border border-gray-300 focus:border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter Client Name
Enter GST Number
Enter Contact Number
Enter Address"
      />
    </div>
  );
};

export default ClientInfoSelect;
