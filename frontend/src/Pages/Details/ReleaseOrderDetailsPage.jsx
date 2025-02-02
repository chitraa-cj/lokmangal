import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { PlusCircle, MinusCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import {
  ReleaseOrderHeaderStatic,
  ReleaseOrderTHeadStatic,
} from "../../Utils/ReleaseOrder/Static";

const INITIAL_RELEASE_ORDER_STATE = {
  clientInfo: "",
  clientName: "",
  publication: "",
  edition: "",
  roNo: "0000",
  date: new Date().toISOString().split("T")[0],
  gstType: "local",
  gstSlab: "5",
  AllItemAmountTotal: "",
  I_GST: "",
  C_GST: "",
  S_GST: "",
  TotalAmount: "",
  remark: "",
};

const INITIAL_ITEM_STATE = {
  sno: "0",
  AdCaption: "",
  insertionDate: new Date().toISOString().split("T")[0],
  sizeW: "",
  sizeH: "",
  page: "",
  ratePerSqCM: "",
  tradeDis: "",
  ItemAmount: "",
};

const ReleaseOrder = () => {
  const [releaseOrder, setReleaseOrder] = useState(INITIAL_RELEASE_ORDER_STATE);
  const [releaseOrderItems, setReleaseOrderItems] = useState([
    INITIAL_ITEM_STATE,
  ]);

  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialReleaseOrderState, setInitialReleaseOrderState] = useState({});
  const [initialReleaseOrderItems, setInitialReleaseOrderItems] = useState([]);

  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

  const fetchInvoice = async () => {
    try {
      const { data } = await axios.get(`/api/release-order/${id}`);

      // Extract first line from clientInfo if it exists
      const clientName = data.clientInfo ? data.clientInfo.split("\n")[0] : "";

      // Update state with processed clientInfo and clientName
      setReleaseOrder({
        ...data,
        clientName, // Add extracted first line
      });

      // Create new variables to store deep copies of the arrays
      const newInvoiceItems = data.items.map((item) => ({ ...item }));
      const newInitialInvoiceItems = data.items.map((item) => ({ ...item }));

      // Now set these new variables to the state
      setReleaseOrderItems(newInvoiceItems);
      setInitialReleaseOrderState(data);
      setInitialReleaseOrderItems(newInitialInvoiceItems);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Error fetching invoice data.");
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const handleReleaseOrderChange = (e) => {
    const { name, value } = e.target;

    setReleaseOrder((prev) => {
      if (name === "clientInfo") {
        const firstLine = value.split("\n")[0]; // Get the first line of the input
        return {
          ...prev,
          clientInfo: value,
          clientName: firstLine,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleChange = (index, field, value) => {
    const newItems = [...releaseOrderItems];
    newItems[index][field] = value;

    if (["sizeW", "sizeH", "ratePerSqCM", "tradeDis"].includes(field)) {
      const width = parseFloat(newItems[index].sizeW) || 0;
      const height = parseFloat(newItems[index].sizeH) || 0;
      const rate = parseFloat(newItems[index].ratePerSqCM) || 0;
      let itemTotal = width * height * rate;

      const tradeDis = newItems[index].tradeDis;
      if (tradeDis) {
        if (tradeDis.includes("%")) {
          let percent = parseFloat(tradeDis) / 100 || 0;
          percent = Math.min(percent, 0.5); // Cap the discount at 50%
          itemTotal -= itemTotal * percent;
        } else {
          const discount = parseFloat(tradeDis) || 0;
          itemTotal -= discount;
        }
      }

      newItems[index].ItemAmount = itemTotal.toFixed(2);
    }

    setReleaseOrderItems(newItems);
  };

  const addRow = () => {
    setReleaseOrderItems((prevItems) => [
      ...prevItems,
      {
        ...INITIAL_ITEM_STATE,
        sno: prevItems.length + 1,
      },
    ]);
  };

  const removeRow = () => {
    const items = Object.values(releaseOrderItems);
    if (items.length > 1) {
      setReleaseOrderItems(
        items.filter((item, index) => index !== items.length - 1)
      );
    } else {
      toast.error("At least one row is required.");
    }
  };

  const calculateTotals = () => {
    // console.log("Calculating totals...");

    // Calculate total amount from all items
    const itemTotal = releaseOrderItems.reduce(
      (sum, item) => sum + (parseFloat(item.ItemAmount) || 0),
      0
    );
    // console.log("Item total calculated: ", itemTotal);

    // Get GST rate from selected slab
    const gstRate = parseFloat(releaseOrder?.gstSlab) / 100;
    // console.log("GST rate: ", gstRate);

    // Initialize GST values
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    // Calculate GST based on type and slab
    if (releaseOrder?.gstType === "local") {
      // For local: Split the GST rate equally between CGST and SGST
      const halfGstRate = gstRate / 2;
      cgst = itemTotal * halfGstRate;
      sgst = itemTotal * halfGstRate;
    } else {
      // For interstate: Apply full GST rate as IGST
      igst = itemTotal * gstRate;
    }
    // console.log("CGST: ", cgst, "SGST: ", sgst, "IGST: ", igst);

    // Calculate final total
    const totalAmount = itemTotal + cgst + sgst + igst;
    // console.log("Total amount: ", totalAmount);

    // Update all values in releaseOrder state
    setReleaseOrder((prev) => ({
      ...prev,
      AllItemAmountTotal: itemTotal.toFixed(2),
      C_GST: cgst.toFixed(2),
      S_GST: sgst.toFixed(2),
      I_GST: igst.toFixed(2),
      TotalAmount: totalAmount.toFixed(2),
    }));
    // console.log("Release order state updated.");
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setReleaseOrder(initialReleaseOrderState);
    setReleaseOrderItems(initialReleaseOrderItems);
    setIsEditing(false);
  };

  const navigate = useNavigate();

  const refreshPage = () => {
    navigate(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    calculateTotals();
    setIsSubmitting(true);

    // If all fields are filled, prepare the data for submission
    const data = {
      ...releaseOrder,
      items: releaseOrderItems,
    };

    // console.log("Submitting");
    // console.log("Invoice Data:", data);

    try {
      // Update existing invoice
      const response = await axios.put(`/api/release-order/${id}`, data);
      // console.log(response);
      if (response.status === 200) {
        refreshPage();
        toast.success("Invoice updated successfully!");
        handleCancelClick();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    calculateTotals();
  }, [
    JSON.stringify(releaseOrderItems),
    JSON.stringify(releaseOrder?.gstType),
    JSON.stringify(releaseOrder?.gstSlab),
  ]);

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col items-center">
      <div className="max-w-6xl m-auto p-4 py-20 margin0" ref={contentRef}>
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 rounded-lg print:p-4 margin0">
            <ReleaseOrderHeaderStatic />
            <div className="grid grid-cols-[63%_37%] border px-4 border-b-0 border-gray-300">
              <div className="flex flex-col pr-4 border-r border-gray-300">
                <div className="flex flex-col mb-4 noPrint margin0">
                  <label className="block text-sm font-medium py-4">To,</label>
                  <textarea
                    name="clientInfo"
                    value={releaseOrder.clientInfo}
                    onChange={handleReleaseOrderChange}
                    rows={6}
                    className="w-full uppercase px-2 p-2 border border-gray-300 focus:border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 noPrint"
                    placeholder="Enter Client Name
Enter GST Number
Enter Contact Number
Enter Address"
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between mb-4 print:pt-4">
                  <label className="block text-sm font-medium mr-2">
                    Client_Name
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={releaseOrder?.clientName?.toUpperCase()}
                    disabled
                    readOnly
                    className="bg-white w-[400px] print:w-[350px] p-2 border rounded uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Client Name"
                  />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium mr-2">
                    Publication
                  </label>
                  <input
                    type="text"
                    name="publication"
                    value={releaseOrder?.publication.toUpperCase()}
                    onChange={handleReleaseOrderChange}
                    className="w-[400px] print:w-[350px] p-2 border rounded uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Publication name"
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium mr-2">
                    Edition
                  </label>
                  <input
                    type="text"
                    name="edition"
                    value={releaseOrder?.edition.toUpperCase()}
                    onChange={handleReleaseOrderChange}
                    className="w-[400px] print:w-[350px] p-2 border rounded uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Edition"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="flex flex-col ml-4 justify-center">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium">R.O._NO</label>
                  <input
                    name="roNo"
                    value={releaseOrder?.roNo}
                    readOnly
                    disabled
                    className="w-48 p-2 text-xl font-bold bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={releaseOrder?.date}
                    onChange={handleReleaseOrderChange}
                    className="w-60 ml2 p-2 text-xl text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
            <div className="w-full rounded-lg">
              <table className="w-full border-collapse">
                <ReleaseOrderTHeadStatic />
                <tbody>
                  {releaseOrderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-1 text-center">
                        {item.sno}
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          type="text"
                          disabled={!isEditing}
                          value={item.AdCaption}
                          onChange={(e) =>
                            handleChange(index, "AdCaption", e.target.value)
                          }
                          className="w-full focus:outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          type="date"
                          disabled={!isEditing}
                          value={item.insertionDate}
                          onChange={(e) =>
                            handleChange(index, "insertionDate", e.target.value)
                          }
                          className="w-full text-center focus:outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          type="text"
                          disabled={!isEditing}
                          value={item.sizeW}
                          onChange={(e) =>
                            handleChange(index, "sizeW", e.target.value)
                          }
                          className="w-full focus:outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          type="text"
                          disabled={!isEditing}
                          value={item.sizeH}
                          onChange={(e) =>
                            handleChange(index, "sizeH", e.target.value)
                          }
                          className="w-full focus:outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          type="text"
                          disabled={!isEditing}
                          value={item.page}
                          onChange={(e) =>
                            handleChange(index, "page", e.target.value)
                          }
                          className="w-full focus:outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          type="number"
                          disabled={!isEditing}
                          value={item.ratePerSqCM}
                          onChange={(e) =>
                            handleChange(index, "ratePerSqCM", e.target.value)
                          }
                          className="w-full focus:outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          type="text"
                          disabled={!isEditing}
                          value={item.tradeDis}
                          onChange={(e) =>
                            handleChange(index, "tradeDis", e.target.value)
                          }
                          className="w-full focus:outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input
                          required
                          type="number"
                          value={item.ItemAmount}
                          readOnly
                          disabled
                          className="w-full p-1 font-bold text-center bg-white"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="py-4 space-x-4 flex items-center justify-start noPrint">
                <button
                  type="button"
                  onClick={addRow}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Row
                </button>
                {releaseOrderItems?.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeRow()}
                    className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center space-x-2"
                  >
                    <MinusCircle className="w-4 h-4 mr-2" />
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 px-4 printMargin">
              <div>
                <div
                  className={`flex flex-col ${
                    releaseOrder?.remark ? "" : "print:hidden"
                  }`}
                >
                  <label className="block text-sm font-medium my-2">
                    <h2 className="text-lg font-semibold">Remark :</h2>
                  </label>
                  <textarea
                    type="text"
                    name="remark"
                    rows={6}
                    value={releaseOrder?.remark}
                    onChange={handleReleaseOrderChange}
                    className="uppercase w-full p-2 print:border-none border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div className="mt-4 pr-2">
                  <h2 className="text-lg font-semibold mb-2">Note :</h2>
                  <ol className="space-y-2 uppercase font-light leading-normal text-xs w-[400px]">
                    <li>
                      Forward voucher copies to our client and this office on
                      the insertion date.
                    </li>
                    <li>Inform us immediately of any missed insertions.</li>
                    <li>
                      Send the bill with the voucher copy within 15 days of
                      insertion
                    </li>
                  </ol>
                </div>
              </div>
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
            </div>
          </div>

          <div className="flex gap-4 mt-10 mb-20 noPrint">
            {/* Edit Button */}
            {!isEditing && id && (
              <button
                type="button"
                onClick={handleEditClick}
                className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200 text-lg font-bold"
              >
                Edit
              </button>
            )}

            {/* Submit Button (only shows after Edit) */}
            {isEditing && id && (
              <>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed text-lg font-bold"
                >
                  {isSubmitting ? "Submitting..." : "Update & Save"}
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 text-lg font-bold"
                >
                  Cancel
                </button>
              </>
            )}

            {id && (
              <button
                type="button"
                onClick={reactToPrintFn}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 text-lg font-bold"
              >
                Print Invoice
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReleaseOrder;
