export const InvoiceItemsTable = ({ invoiceItems, handleChange }) => {
  return (
    <>
      {invoiceItems.map((item, index) => (
        <tr key={index}>
          {/* Serial Number */}
          <td className="border border-gray-300 text-center">{item.sno}</td>

          {/* Particulars */}
          <td className="border border-gray-300">
            <input
              required={index === 0 ? true : false}
              type="text"
              value={item.particulars}
              onChange={(e) =>
                handleChange(index, "particulars", e.target.value)
              }
              className="w-full p-2 focus:outline-none"
            />
          </td>

          {/* Insertion Date */}
          <td className="border border-gray-300">
            <input
              required={index === 0 ? true : false}
              type="date"
              value={item.insertionDate}
              onChange={(e) =>
                handleChange(index, "insertionDate", e.target.value)
              }
              className="w-full text-center p-2 focus:outline-none"
            />
          </td>

          {/* Size Width */}
          <td className="border border-gray-300">
            <input
              required={index === 0 ? true : false}
              type="text"
              value={item.sizeW}
              onChange={(e) => handleChange(index, "sizeW", e.target.value)}
              className="w-full p-2 focus:outline-none"
            />
          </td>

          {/* Size Height */}
          <td className="border border-gray-300">
            <input
              required={index === 0 ? true : false}
              type="text"
              value={item.sizeH}
              onChange={(e) => handleChange(index, "sizeH", e.target.value)}
              className="w-full p-2 focus:outline-none"
            />
          </td>

          {/* Rate per SqCM */}
          <td className="border border-gray-300">
            <input
              required={index === 0 ? true : false}
              type="number"
              value={item.ratePerSqCM}
              onChange={(e) =>
                handleChange(index, "ratePerSqCM", e.target.value)
              }
              className="w-full p-2 focus:outline-none"
            />
          </td>

          {/* Item Amount */}
          <td className="border border-gray-300">
            <input
              required={index === 0 ? true : false}
              type="number"
              value={item.ItemAmount}
              readOnly
              disabled
              className="w-full p-2 bg-white font-bold text-center"
            />
          </td>
        </tr>
      ))}
    </>
  );
};

export const Money = ({ invoice, setInvoice }) => {
  const handleGSTTypeChange = (e) => {
    const value = e.target.value;
    setInvoice((prev) => ({
      ...prev,
      gstType: value,
    }));
  };

  const handleGSTSlabChange = (e) => {
    const value = e.target.value;
    setInvoice((prev) => ({
      ...prev,
      gstSlab: value,
    }));
  };

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    setInvoice((prev) => ({
      ...prev,
      discount: value,
    }));
  };

  return (
    <div className="flex flex-col">
      <div className="rounded flex justify-end">
        <div className="w-64 space-y-2">
          <div className="noPrint margin0">
            {/* GST Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                GST Type:
              </label>
              <select
                value={invoice.gstType}
                onChange={handleGSTTypeChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="local">Local (CGST + SGST)</option>
                <option value="interstate">Interstate (IGST)</option>
              </select>
            </div>

            {/* GST Slab */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                GST Slab:
              </label>
              <select
                value={invoice.gstSlab}
                onChange={handleGSTSlabChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-between pt-2">
            <span>All Item Amount Total:</span>
            <span>₹ {invoice.AllItemAmountTotal}</span>
          </div>

          {/* Discount */}
          <div
            className={`flex justify-between items-center ${
              !invoice.discount && "noPrint margin0"
            }`}
          >
            <span>(-) Less:</span>
            <div className="flex items-center">
              <span>₹</span>
              <input
                type="number"
                min="0"
                value={invoice.discount}
                onChange={handleDiscountChange}
                className="w-12 ml-1 focus:outline-none"
              />
            </div>
          </div>

          {/* Net Amount */}
          <div className="flex justify-between">
            <span>Net Amount:</span>
            <span>₹ {invoice.NetAmount}</span>
          </div>

          {/* GST Calculations */}
          {invoice.gstType === "interstate" ? (
            <div className="flex justify-between">
              <span>(+) IGST ({invoice.gstSlab}%):</span>
              <span>₹ {invoice.I_GST}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                <span>(+) CGST ({invoice.gstSlab / 2}%):</span>
                <span>₹ {invoice.C_GST}</span>
              </div>
              <div className="flex justify-between">
                <span>(+) SGST ({invoice.gstSlab / 2}%):</span>
                <span>₹ {invoice.S_GST}</span>
              </div>
            </>
          )}

          {/* Total Amount */}
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total Amount:</span>
            <span>₹ {invoice.TotalAmount}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-right mt-4 pt-4">
        <div>For : Business Culture</div>
        <div className="mt-16">Authorised Signatory</div>
      </div>
    </div>
  );
};
