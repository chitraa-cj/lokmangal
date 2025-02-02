import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGSTInvoices = () => {
  const queryClient = useQueryClient();

  // Fetch all gst-invoices
  const useAllInvoices = () => {
    return useQuery({
      queryKey: ["gst-invoices"],
      queryFn: async () => {
        const { data } = await axios.get("/api/gst-invoice/");
        return data.reverse();
      },
    });
  };

  // Fetch single invoice
  const useInvoice = (id) => {
    return useQuery({
      queryKey: ["gst-invoice", id],
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
        queryClient.invalidateQueries({ queryKey: ["gst-invoices"] });
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
        queryClient.invalidateQueries({ queryKey: ["gst-invoices"] });
        queryClient.invalidateQueries({
          queryKey: ["gst-invoice", variables.id],
        });
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
