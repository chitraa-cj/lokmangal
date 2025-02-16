import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Queries
export const useNewsPosts = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data } = await axios.get("/api/news/");
      return data;
    },
  });
};

export const useNewsPostDetails = (newsId, isAdminPath) => {
  return useQuery({
    queryKey: ["news", newsId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/news/${newsId}`);
      return data;
    },
  });
};

// Mutations
export const useCreateNewsPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/news", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

export const useUpdateNewsPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData) => {
      const { id, ...data } = updateData;
      const response = await axios.put(`/api/news/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

export const useDeleteNewsPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newsId) => {
      const response = await axios.delete(`/api/news/${newsId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};
