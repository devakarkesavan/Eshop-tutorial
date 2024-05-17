import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import axios from 'axios'
const ItemList = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedItem, setEditedItem] = useState({});

  useEffect(() => {
    fetch('http://localhost:8000/allitems')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/deleteitem/${productId}`);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditedItem({ ...item });
    setEditDialogOpen(true);
  };
  const fetchProducts = async () => {
    fetch('http://localhost:8000/allitems')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching data:', error));
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleSaveEdit = async() => {
    // Implement save edit logic here
    console.log('Edited item:', editedItem);
    
    try {
      const response = await axios.put(`http://localhost:8000/edititem/${editedItem._id}`, editedItem);
      
   
      
      setEditDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
    // Close the edit dialog
    setEditDialogOpen(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'tags', headerName: 'Tags', width: 200 },
    { field: 'originalPrice', headerName: 'Original Price', width: 150 },
    { field: 'discountPrice', headerName: 'Discount Price', width: 150 },
    { field: 'stock', headerName: 'Stock', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            startIcon={<AiOutlineEdit />}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            startIcon={<AiOutlineDelete />}
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={items.map(item => ({ ...item, id: item._id }))}
        columns={columns}
        pageSize={5}
        checkboxSelection
        disableSelectionOnClick
      />
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editedItem.name || ''}
            onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Description"
            value={editedItem.description || ''}
            onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
            fullWidth
          />
          <TextField
            label="Category"
            value={editedItem.category || ''}
            onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
            fullWidth
          />
          <TextField
            label="Tags"
            value={editedItem.tags || ''}
            onChange={(e) => setEditedItem({ ...editedItem, tags: e.target.value })}
            fullWidth
          />
          <TextField
            label="Original Price"
            value={editedItem.originalPrice || ''}
            onChange={(e) => setEditedItem({ ...editedItem, originalPrice: e.target.value })}
            fullWidth
          />
          <TextField
            label="Discount Price"
            value={editedItem.discountPrice || ''}
            onChange={(e) => setEditedItem({ ...editedItem, discountPrice: e.target.value })}
            fullWidth
          />
          <TextField
            label="Stock"
            value={editedItem.stock || ''}
            onChange={(e) => setEditedItem({ ...editedItem, stock: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ItemList;
