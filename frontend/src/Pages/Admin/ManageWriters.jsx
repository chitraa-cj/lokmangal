import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const ManageWriters = () => {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // New state for delete confirmation
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });

  // Fetch all users
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get("/api/users/", {
        withCredentials: true,
      });
      return response.data;
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (newUser) =>
      axios.post("/api/users/", newUser, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setFormData({ name: "", username: "", password: "" });
      toast.success("Writer created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error creating writer");
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, updatedUser }) =>
      axios.put(`/api/users/${id}`, updatedUser, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setIsEditModalOpen(false);
      toast.success("Writer updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error updating writer");
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id) =>
      axios.delete(`/api/users/${id}`, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setIsDeleteModalOpen(false); // Close the confirmation modal
      toast.success("Writer deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error deleting writer");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserMutation.mutate(formData);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateUserMutation.mutate({ id: selectedUser._id, updatedUser: formData });
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: "",
    });
    setIsEditModalOpen(true);
  };

  // New function to open the delete confirmation modal
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // New function to handle the actual deletion after confirmation
  const confirmDelete = () => {
    deleteUserMutation.mutate(selectedUser._id);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Manage Writers</h1>

      {/* Create Writer Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded bg-white p-6 shadow"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block font-semibold">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded border p-2"
              required
            />
          </div>
          <div>
            <label className="mb-2 block font-semibold">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full rounded border p-2"
              required
            />
          </div>
          <div>
            <label className="mb-2 block font-semibold">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full rounded border p-2"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          disabled={createUserMutation.isLoading}
        >
          {createUserMutation.isLoading ? "Creating..." : "Add Writer"}
        </button>
      </form>

      {/* Writers List */}
      {isLoading ? (
        <p>Loading writers...</p>
      ) : (
        <div className="overflow-x-auto rounded bg-white shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.isAdmin ? "Admin" : "Writer"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => openEditModal(user)}
                      className={`mr-4 ${
                        user.isAdmin
                          ? "cursor-not-allowed text-gray-400"
                          : "text-blue-600 hover:underline"
                      }`}
                      disabled={user.isAdmin}
                      aria-disabled={user.isAdmin}
                    >
                      Edit
                    </button>
                    {!user.isAdmin && (
                      <button
                        onClick={() => openDeleteModal(user)} // Changed to open confirmation modal
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Edit Writer</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="mb-2 block font-semibold">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded border p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-semibold">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full rounded border p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-semibold">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded border p-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded border px-4 py-2 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  disabled={updateUserMutation.isLoading}
                >
                  {updateUserMutation.isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-red-600">
              Confirm Deletion
            </h2>
            <p className="mb-6">
              Are you sure you want to delete the writer{" "}
              <strong>{selectedUser.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded border px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                disabled={deleteUserMutation.isLoading}
              >
                {deleteUserMutation.isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageWriters;
