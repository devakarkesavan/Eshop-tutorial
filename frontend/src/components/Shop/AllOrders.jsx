import React, { useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { Link } from "react-router-dom";
import axios from "axios";
import { AiOutlineArrowRight } from "react-icons/ai";
import Loader from "../Layout/Loader";
import { Button } from "@material-ui/core";

const AllOrders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const shopId = localStorage.getItem('sellerid');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrdersByShopId = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/orders/shop/${shopId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrdersByShopId();
  }, [shopId]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    { field: "status", headerName: "Status", minWidth: 130, flex: 0.7 },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 130, flex: 0.7 },
    { field: "total", headerName: "Total", type: "number", minWidth: 130, flex: 0.8 },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/order/${params.row.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  // Prepare rows data based on fetched orders
  const rows = orders.map((order) => ({
    id: order._id,
    status: order.status,
    itemsQty: order.product ? 1 : 0, // Assuming one product per order
    total: order.totalPrice.toFixed(2), // Format total price to 2 decimal places
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllOrders;
