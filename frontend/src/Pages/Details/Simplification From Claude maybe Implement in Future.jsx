import { useState, useEffect } from "react";
import { ArrowLeft, Pencil, PlusCircle, MinusCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const InvoiceDetailsPage = () => {
  const { id: invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [editedInvoice, setEditedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data } = await axios.get(`/api/invoices/${invoiceId}`);
        setInvoice(data);
        setEditedInvoice(data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const calculateTotals = (currentInvoice) => {
    if (!currentInvoice?.items?.length) return {};

    // Calculate items total
    const itemsTotal = currentInvoice.items.reduce((sum, item) => {
      const area = parseFloat(item.sizeW) * parseFloat(item.sizeH);
      const rate = parseFloat(item.ratePerSqCM);
      return sum + (area * rate || 0);
    }, 0);

    const discount = parseFloat(currentInvoice.discount) || 0;
    const netAmount = itemsTotal - discount;
    const gstRate = parseFloat(currentInvoice.gstSlab) / 100;
    const gstAmount = netAmount * gstRate;

    const gstTotals =
      currentInvoice.gstType === "local"
        ? { cgst: gstAmount / 2, sgst: gstAmount / 2, igst: 0 }
        : { cgst: 0, sgst: 0, igst: gstAmount };

    return {
      itemsTotal: itemsTotal.toFixed(2),
      netAmount: netAmount.toFixed(2),
      ...gstTotals,
      total: (netAmount + gstAmount).toFixed(2),
    };
  };

  const handleInputChange = (field, value) => {
    setEditedInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setEditedInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setEditedInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          particulars: "",
          insertionDate: "",
          sizeW: "",
          sizeH: "",
          ratePerSqCM: "",
        },
      ],
    }));
  };

  const removeItem = (index) => {
    if (editedInvoice.items.length <= 1) {
      toast.error("At least one item is required");
      return;
    }

    setEditedInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const totals = calculateTotals(editedInvoice);
      const updatedInvoice = {
        ...editedInvoice,
        ...totals,
      };

      const { data } = await axios.put(
        `/api/invoices/${invoiceId}`,
        updatedInvoice
      );
      setInvoice(updatedInvoice);
      setIsEditing(false);
      toast.success("Invoice updated successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update invoice");
      toast.error("Failed to update invoice");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!invoice) return <div>No invoice found</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/invoices" className="flex items-center text-gray-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </Link>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-blue-600"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Invoice
          </button>
        )}
      </div>

      {/* Invoice Form */}
      <div className="space-y-6">
        {/* Basic Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Client Name</label>
            <input
              type="text"
              value={editedInvoice.clientName}
              onChange={(e) => handleInputChange("clientName", e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Add other invoice fields similarly */}
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {editedInvoice.items.map((item, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 items-center">
              <input
                type="text"
                value={item.particulars}
                onChange={(e) =>
                  handleItemChange(index, "particulars", e.target.value)
                }
                disabled={!isEditing}
                className="col-span-2 p-2 border rounded"
                placeholder="Particulars"
              />
              {/* Add other item fields */}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500"
                >
                  <MinusCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {isEditing && (
            <button
              type="button"
              onClick={addItem}
              className="flex items-center text-blue-600"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Item
            </button>
          )}
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t pt-4">
          {Object.entries(calculateTotals(editedInvoice)).map(
            ([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium">{key}</span>
                <span>₹{value}</span>
              </div>
            )
          )}
        </div>

        {/* Actions */}
        {isEditing && (
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={
                isSaving ||
                JSON.stringify(invoice) === JSON.stringify(editedInvoice)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => {
                setEditedInvoice(invoice);
                setIsEditing(false);
              }}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetailsPage;
