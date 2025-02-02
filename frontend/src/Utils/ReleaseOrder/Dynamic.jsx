export const ReleaseOrderItemsTable = ({ releaseOrderItems, handleChange }) => {
  return (
    <>
      {releaseOrderItems?.map((item, index) => (
        <tr key={index}>
          <td className="border border-gray-300 text-center">{item?.sno}</td>
          <td className="border border-gray-300">
            <input
              // {...(index > 0 ? "required" : "")}
              required={index === 0 ? true : false}
              type="text"
              value={item?.AdCaption}
              onChange={(e) => handleChange(index, "AdCaption", e.target.value)}
              className="w-full p-2 focus:outline-none uppercase"
            />
          </td>
          <td className="border border-gray-300">
            <input
              required={index === 0 ? true : false}
              type="date"
              value={item?.insertionDate}
              onChange={(e) =>
                handleChange(index, "insertionDate", e.target.value)
              }
              className="w-full p-2 text-center focus:outline-none"
            />
          </td>
          <td className="border border-gray-300">
            <input
              required={index === 0 ? true : false}
              type="text"
              value={item?.sizeW}
              onChange={(e) => handleChange(index, "sizeW", e.target.value)}
              className="w-full p-2 focus:outline-none"
            />
          </td>
          <td className="border border-gray-300">
            <input
              required={index === 0 ? true : false}
              type="text"
              value={item?.sizeH}
              onChange={(e) => handleChange(index, "sizeH", e.target.value)}
              className="w-full p-2 focus:outline-none"
            />
          </td>
          <td className="border border-gray-300">
            <input
              required={index === 0 ? true : false}
              type="text"
              value={item?.page}
              onChange={(e) => handleChange(index, "page", e.target.value)}
              className="w-full p-2 focus:outline-none"
            />
          </td>
          <td className="border border-gray-300">
            <input
              required={index === 0 ? true : false}
              type="number"
              value={item?.ratePerSqCM}
              onChange={(e) =>
                handleChange(index, "ratePerSqCM", e.target.value)
              }
              className="w-full p-2 focus:outline-none"
            />
          </td>
          <td className="border border-gray-300">
            <input
              type="text"
              value={item?.tradeDis}
              onChange={(e) => handleChange(index, "tradeDis", e.target.value)}
              className="w-full p-2 focus:outline-none"
            />
          </td>
          <td className="border border-gray-300">
            <input
              required={index === 0 ? true : false}
              type="number"
              value={item?.ItemAmount}
              readOnly
              disabled
              className="w-full p-2 font-bold text-center bg-white"
            />
          </td>
        </tr>
      ))}
    </>
  );
};

export const ReleaseOrderMoney = ({ releaseOrder, setReleaseOrder }) => {
  return (
    <div className="flex flex-col">
      <div className="rounded flex justify-end">
        <div className="w-64 space-y-2">
          <div className="noPrint margin0">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                GST Type:
              </label>
              <select
                value={releaseOrder?.gstType}
                onChange={(e) => {
                  const value = e.target.value;
                  setReleaseOrder((prev) => ({
                    ...prev,
                    gstType: value,
                  }));
                }}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="local">Local (CGST + SGST)</option>
                <option value="interstate">Interstate (IGST)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                GST Slab:
              </label>
              <select
                value={releaseOrder?.gstSlab}
                onChange={(e) => {
                  const value = e.target.value;
                  setReleaseOrder((prev) => ({
                    ...prev,
                    gstSlab: value,
                  }));
                }}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <span>All Item Amount Total:</span>
            <span>₹ {releaseOrder?.AllItemAmountTotal}</span>
          </div>

          {releaseOrder?.gstType === "interstate" ? (
            <div className="flex justify-between">
              <span>(+) IGST ({releaseOrder?.gstSlab}%):</span>
              <span>₹ {releaseOrder?.I_GST}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                <span>(+) CGST ({releaseOrder?.gstSlab / 2}%):</span>
                <span>₹ {releaseOrder?.C_GST}</span>
              </div>
              <div className="flex justify-between">
                <span>(+) SGST ({releaseOrder?.gstSlab / 2}%):</span>
                <span>₹ {releaseOrder?.S_GST}</span>
              </div>
            </>
          )}

          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total Amount:</span>
            <span>₹ {releaseOrder?.TotalAmount}</span>
          </div>
        </div>
      </div>

      <div className="text-right mt-4 pt-4">
        <div>For : Business Culture</div>
        <div className="mt-16">Authorised Signatory</div>
      </div>
    </div>
  );
};
