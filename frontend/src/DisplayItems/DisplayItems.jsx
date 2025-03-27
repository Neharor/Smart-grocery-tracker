import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DisplayItems.css";
import { Link, useNavigate } from "react-router-dom";

function DisplayItems() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getItems");
      setItems(response.data);
      window.dispatchEvent(new Event('itemsUpdated')); 
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const isExpired = (date) => {
    return new Date(date) < new Date(); // Expired if the date is before today
  };

  const isExpiringSoon = (date) => {
    const expirationDate = new Date(date);
    const today = new Date();
    const diffInDays = (expirationDate - today) / (1000 * 3600 * 24);
    return diffInDays <= 2 && diffInDays >= 0; // Expiring in the next 2 days
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:5000/deleteItem/${id}`);
        fetchItems(); // Refresh the item list after deletion
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  return (
    <div>
    <div className="item-list-container">
    <div className="header-container"> {/* New container for header and button */}
        <h2 className="text">🌿 Pantry Preview</h2>
        <Link to="/edititem">
          <button className="add-button">Add New Item</button>
        </Link>
        </div>
      <table className="item-list-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Date of Purchase</th>
            <th>Date of Expiration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item._id}
              style={{
                backgroundColor: isExpired(item.dateOfExpiration)
                  ? "#ffcccc" // Light red for expired
                  : isExpiringSoon(item.dateOfExpiration)
                  ? "#fff0b3" // Light yellow for expiring soon
                  : "transparent",
              }}
            >
              <td>{item.itemName}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>{item.dateOfPurchase}</td>
              <td>{item.dateOfExpiration}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(`/edititem/${item._id}`, { state: { item } })
                  }
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item._id)}
                  style={{ marginLeft: "5px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default DisplayItems;
