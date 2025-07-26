// frontend/src/App.js
import React, { useState, useEffect } from 'react';

// Base URL for the backend API.
// When running with Docker Compose, 'backend' is the service name defined in docker-compose.yml.
// When running locally, it would typically be 'localhost'.
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api' // In production (e.g., served by Nginx alongside backend), use relative path
  : 'http://localhost:5000/api'; // In development, use full backend URL

function App() {
  // State to store the list of items fetched from the backend
  const [items, setItems] = useState([]);
  // State for the new item's name input
  const [newItemName, setNewItemName] = useState('');
  // State for the new item's description input
  const [newItemDescription, setNewItemDescription] = useState('');
  // State to manage loading status during API calls
  const [loading, setLoading] = useState(false);
  // State to store any error messages
  const [error, setError] = useState(null);
  // State for showing success messages
  const [successMessage, setSuccessMessage] = useState('');

  // useEffect hook to fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, []); // Empty dependency array means this runs once on mount

  // Function to fetch all items from the backend
  const fetchItems = async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null);   // Clear previous errors
    try {
      const response = await fetch(`${API_BASE_URL}/items`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data); // Update the items state with fetched data
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to fetch items. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetch completes
    }
  };

  // Function to handle adding a new item
  const handleAddItem = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    if (!newItemName.trim()) {
      setError('Item name cannot be empty.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST', // Use POST method to create a new item
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        body: JSON.stringify({ name: newItemName, description: newItemDescription }), // Send item data as JSON string
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // If successful, clear input fields, refetch items, and show success
      setNewItemName('');
      setNewItemDescription('');
      await fetchItems(); // Refresh the list of items
      setSuccessMessage('Item added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (err) {
      console.error('Error adding item:', err);
      setError(`Failed to add item: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle deleting an item
  const handleDeleteItem = async (id) => {
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'DELETE', // Use DELETE method to remove an item
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await fetchItems(); // Refresh the list of items
      setSuccessMessage('Item deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(`Failed to delete item: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 hover:scale-[1.01]">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          My Items
        </h1>

        {/* Add New Item Form */}
        <form onSubmit={handleAddItem} className="mb-8 p-6 bg-blue-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold text-blue-800 mb-5">Add New Item</h2>
          <div className="mb-4">
            <label htmlFor="itemName" className="block text-gray-700 text-sm font-semibold mb-2">
              Item Name:
            </label>
            <input
              type="text"
              id="itemName"
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="e.g., Buy groceries"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="itemDescription" className="block text-gray-700 text-sm font-semibold mb-2">
              Description (Optional):
            </label>
            <textarea
              id="itemDescription"
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 resize-y"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              placeholder="e.g., Milk, eggs, bread"
              rows="3"
            ></textarea>
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </form>

        {/* Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline ml-2">{successMessage}</span>
          </div>
        )}

        {/* Items List */}
        <h2 className="text-2xl font-bold text-gray-800 mb-5">Current Items</h2>
        {loading && !error && (
          <p className="text-center text-gray-600">Loading items...</p>
        )}
        {items.length === 0 && !loading && !error && (
          <p className="text-center text-gray-600">No items found. Add some above!</p>
        )}
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center bg-white p-5 rounded-lg shadow-md border border-gray-200 transition duration-200 ease-in-out hover:shadow-lg"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                {item.description && (
                  <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  Added on: {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteItem(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
                disabled={loading}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
