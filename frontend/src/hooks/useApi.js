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
    // Remove staleTime and cacheTime to keep data until explicitly invalidated
  });
};

export const useAdminNewsPosts = ({ page = 1, limit } = {}) => {
  return useQuery({
    queryKey: ["newsPosts", page],
    queryFn: async () => {
      const params = { page };
      if (limit) params.limit = limit;

      const response = await axios.get("/api/news/all", { params });
      return response.data;
    },
    keepPreviousData: true, // Still useful for pagination
  });
};

export const useNewsPostDetails = (type, newsId, initialData) => {
  return useQuery({
    queryKey: ["news", newsId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/news/${type}/${newsId}`);
      return data;
    },
    initialData,
    enabled: newsId && !initialData,
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
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["newsPosts"] });
    },
  });
};

// 1. Optimistic Updates
// Instead of invalidating and refetching, you could update the cache directly with the new data in the onSuccess callback. This avoids extra network requests:

// https://grok.com/chat/c9dc16a3-e312-4a6e-b96d-27396a494041

// export const useCreateNewsPostMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (data) => {
//       const response = await axios.post("/api/news", data);
//       return response.data;
//     },
//     onSuccess: (newPost) => {
//       // Update the cache directly
//       queryClient.setQueryData(["news"], (oldData) => [...oldData, newPost]);
//       queryClient.invalidateQueries({ queryKey: ["newsPosts"] }); // Still invalidate admin list
//     },
//   });
// };

export const useUpdateNewsPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData) => {
      const { id, ...data } = updateData;
      const response = await axios.put(`/api/news/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["newsPosts"] });
      queryClient.invalidateQueries({ queryKey: ["news", data.id] }); // Invalidate specific post
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
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["newsPosts"] });
    },
  });
};

export const useNewsPostsByCategory = (category) => {
  return useQuery({
    queryKey: ["news", category],
    queryFn: async () => {
      const { data } = await axios.get(`/api/news/category/${category}`);
      return data;
    },
    enabled: !!category,
  });
};
