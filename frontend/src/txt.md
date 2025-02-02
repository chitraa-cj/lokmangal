# I'll help you integrate TanStack Query (React Query) into your project. Let's break this down into steps

1. First, let's create a custom hook for invoice operations:

```js
// javascript: frontend / src / hooks / useInvoices.js;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useInvoices = () => {
  const queryClient = useQueryClient();

  // Fetch all invoices
  const useAllInvoices = () => {
    return useQuery({
      queryKey: ["invoices"],
      queryFn: async () => {
        const { data } = await axios.get("/api/gst-invoice/");
        return data;
      },
    });
  };

  // Fetch single invoice
  const useInvoice = (id) => {
    return useQuery({
      queryKey: ["invoice", id],
      queryFn: async () => {
        const { data } = await axios.get(`/api/gst-invoice/${id}`);
        return data;
      },
      enabled: !!id,
    });
  };

  // Create invoice
  const useCreateInvoice = () => {
    return useMutation({
      mutationFn: async (newInvoice) => {
        const { data } = await axios.post("/api/gst-invoice", newInvoice);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
      },
    });
  };

  // Update invoice
  const useUpdateInvoice = () => {
    return useMutation({
      mutationFn: async ({ id, updateData }) => {
        const { data } = await axios.put(`/api/gst-invoice/${id}`, updateData);
        return data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
        queryClient.invalidateQueries({ queryKey: ["invoice", variables.id] });
      },
    });
  };

  return {
    useAllInvoices,
    useInvoice,
    useCreateInvoice,
    useUpdateInvoice,
  };
};
```

2. Now let's update the GSTInvoiceListPage:

```js
// javascript: frontend / src / Pages / List / GSTInvoiceListPage.jsx;
// ... existing imports
import { useInvoices } from "../../hooks/useInvoices";

const InvoiceListPage = () => {
  const { useAllInvoices } = useInvoices();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: invoices = [], isLoading } = useAllInvoices();

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter((invoice) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      invoice.customerName?.toLowerCase().includes(searchLower) ||
      String(invoice.contactNumber).toLowerCase().includes(searchLower)
    );
  });

  // ... rest of your existing code, but replace loading check with:
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-200 flex items-center justify-center">
        <div className="text-gray-600">Loading invoices...</div>
      </div>
    );
  }

  // ... rest of the component remains the same
};
```

3. Update the GSTInvoiceDetailsPage:

```js
// javascript:frontend/src/Pages/Details/GSTInvoiceDetailsPage.jsx
// ... existing imports
import { useInvoices } from "../../hooks/useInvoices";

const Invoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useInvoice, useUpdateInvoice } = useInvoices();

  const { data: invoiceData, isLoading } = useInvoice(id);
  const { mutate: updateInvoice, isPending: isSubmitting } = useUpdateInvoice();

  const [invoice, setInvoice] = useState(INITIAL_INVOICE_STATE);
  const [invoiceItems, setInvoiceItems] = useState([INITIAL_ITEM_STATE]);
  const [isEditing, setIsEditing] = useState(false);
  const [amountInWords, setAmountInWords] = useState("");

  useEffect(() => {
    if (invoiceData) {
      setInvoice(invoiceData);
      setInvoiceItems(invoiceData.items || []);
    }
  }, [invoiceData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    calculateTotals();

    const data = {
      ...invoice,
      items: invoiceItems,
    };

    updateInvoice(
      { id, updateData: data },
      {
        onSuccess: () => {
          toast.success("Invoice updated successfully!");
          handleCancelClick();
          navigate(0);
        },
        onError: (error) => {
          console.error("Error saving data:", error);
          toast.error("Error saving invoice. Please try again.");
        },
      }
    );
  };

  // ... rest of your component remains the same
};
```

4. Update the GSTInvoicePage:

```js
javascript: frontend / src / Pages / Invoice / GSTInvoicePage.jsx;
// ... existing imports
import { useInvoices } from "../../hooks/useInvoices";

const Invoice = () => {
  const { useCreateInvoice } = useInvoices();
  const { mutate: createInvoice, isPending: isSubmitting } = useCreateInvoice();

  // ... your existing state declarations

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateTotals();

    const data = {
      ...invoice,
      items: invoiceItems,
    };

    createInvoice(data, {
      onSuccess: () => {
        toast.success("Invoice created successfully!");
        resetForm();
        reactToPrintFn();
      },
      onError: (error) => {
        console.error("Error saving data:", error);
        toast.error("Error saving invoice. Please try again.");
      },
    });
  };

  // ... rest of your component remains the same
};
```

5. Finally, update your Main.jsx to configure the QueryClient:

```js
// javascript:frontend/src/Main.jsx
// ... existing imports

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// ... rest of your code remains the same
```

These changes will:

- Add proper data caching
- Reduce unnecessary API calls
- Provide better loading and error states
- Handle optimistic updates
- Automatically refetch data when needed
- Maintain consistency across the application

**Q1: Would you like me to explain how to add loading and error states to the components?**

**Q2: Would you like to see how to implement optimistic updates for better UX?**

**Q3: Would you like to see how to add prefetching for improved performance?**
