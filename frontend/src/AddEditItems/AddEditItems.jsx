import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./AddEditItems.css";
function AddEditItems() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: "",
    dateOfPurchase: "",
    dateOfExpiration: "",
  });

  useEffect(() => {
    if (location.state?.item) {
      setFormData(location.state.item);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:5000/updateItem/${id}`, formData);
        alert("Item updated successfully!");
      } else {
        await axios.post("http://localhost:5000/addItem", formData);
        alert("Item added successfully!");
      }
      navigate("/getitem");
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit item");
    }
  };

  return (
    <div className="container">
      <h2>{id ? "Edit Item" : "💡 Quick Fix"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="itemName"
            placeholder="Item Name"
            value={formData.itemName}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Date of Purchase:</label>
          <input
            type="date"
            name="dateOfPurchase"
            value={formData.dateOfPurchase}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Date of Expiration:</label>
          <input
            type="date"
            name="dateOfExpiration"
            value={formData.dateOfExpiration}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {id ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEditItems;
