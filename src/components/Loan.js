import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  InputLabel,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import api from "../api/api";
import { DataGrid } from "@mui/x-data-grid";

const Input = styled("input")({
  display: "none",
});

const Loan = () => {
  const [clientId, setClientId] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerContactNumber, setOwnerContactNumber] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [itemPicture, setItemPicture] = useState(null); 
  const [itemValue, setItemValue] = useState("");
  const [itemLoanValue, setItemLoanValue] = useState("");
  const [itemInterestPercentage, setItemInterestPercentage] = useState("");
  const [itemInterestPeriod, setItemInterestPeriod] = useState("");
  const [itemInterestValue, setItemInterestValue] = useState("");
  const [itemLoanDate, setItemLoanDate] = useState("");
  const [itemReturnDate, setItemReturnDate] = useState("");
  const [loanPendingInterestAmount, setLoanPendingInterestAmount] = useState("");
  const [loanPendingPrincipalAmount, setLoanPendingPrincipalAmount] = useState("");
  const [loanPendingTotalAmount, setLoanPendingTotalAmount] = useState("");
  const [itemStatus, setItemStatus] = useState("NEW");
  const [loanList, setLoanList] = useState([])

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await api.get("/loan/getLoans");
        setLoanList(response.data);
      } catch (err) {
        console.error("Error fetching loan list:", err);
      }
    };
    fetchLoans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedCreatedDate = createdDate ? new Date(createdDate).toISOString().split("T")[0] : null;
    const formattedItemLoanDate = itemLoanDate ? new Date(itemLoanDate).toISOString().split("T")[0] : null;
    const formattedItemReturnDate = itemReturnDate ? new Date(itemReturnDate).toISOString().split("T")[0] : null;
  
    const formData = new FormData();
    formData.append("loanDetails", JSON.stringify({
      ownerName,
      ownerContactNumber,
      createdDate: formattedCreatedDate,
      itemValue,
      itemLoanValue,
      itemInterestPercentage,
      itemInterestPeriod,
      itemInterestValue,
      itemLoanDate: formattedItemLoanDate,
      itemReturnDate: formattedItemReturnDate,
      loanPendingInterestAmount,
      loanPendingPrincipalAmount,
      loanPendingTotalAmount,
      itemStatus,
    }));
  
    if (itemPicture) {
      formData.append("itemPicture", itemPicture);
    }
  
    try {
      const response = await api.post(`/loan/addNewLoan/${clientId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setClientId('');
      setOwnerName('');
      setOwnerContactNumber('');
      setCreatedDate('');
      setItemPicture(null);
      setItemValue('');
      setItemLoanValue('');
      setItemInterestPercentage('');
      setItemInterestPeriod('');
      setItemInterestValue('');
      setItemLoanDate('');
      setItemReturnDate('');
      setLoanPendingInterestAmount('');
      setLoanPendingPrincipalAmount('');
      setLoanPendingTotalAmount('');
      setItemStatus('NEW');

      console.log("Data submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  
  const columns = [
    { field: 'loanId', headerName: 'Loan_ID', width: 90 },
    { field: 'clientId', headerName: 'Client_ID', width: 90 },
    { field: 'ownerName', headerName: 'Name', width: 150 },
    { field: 'ownerContactNumber', headerName: 'ownerContactNumber', width: 150 },
    { field: 'createdAt', headerName: 'createdAt', width: 180 },
    { field: 'itemPicture', headerName: 'itemPicture', width: 150 },
    { field: 'itemValue', headerName: 'itemValue', width: 150 },
    { field: 'itemLoanValue', headerName: 'itemLoanValue', width: 120 },
    { field: 'itemInterestPercentage', headerName: 'itemInterestPercentage', width: 120 },
    { field: 'itemInterestPeriod', headerName: 'itemInterestPeriod', width: 150 },
    { field: 'itemInterestValue', headerName: 'itemInterestValue', width: 150 },
    { field: 'itemLoanDate', headerName: 'itemLoanDate', width: 180 },
    { field: 'itemReturnDate', headerName: 'itemReturnDate', width: 180 },
    { field: 'loanPendingInterestAmount', headerName: 'loanPendingInterestAmount', width: 180 },
    { field: 'loanPendingPrincipalAmount', headerName: 'loanPendingPrincipalAmount', width: 180 },
    { field: 'loanPendingTotalAmount', headerName: 'loanPendingTotalAmount', width: 180 },
    { field: 'itemStatus', headerName: 'itemStatus', width: 180 },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box display="flex" flexDirection="column" gap={1}>
          <Button color="secondary" >Edit</Button>
          <Button color="secondary">Delete</Button>
        </Box>
      ),
    },
  ];
  
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <form onSubmit={handleSubmit}>
        <h2>Loan Details</h2>
        <TextField
          label="Client ID"
          name="clientId"
          fullWidth
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Owner Name"
          name="ownerName"
          fullWidth
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Owner Contact Number"
          name="ownerContactNumber"
          fullWidth
          value={ownerContactNumber}
          onChange={(e) => setOwnerContactNumber(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Created Date"
          name="createdDate"
          type="date"
          fullWidth
          value={createdDate}
          onChange={(e) => setCreatedDate(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          component="label"
          color="primary"
          sx={{ margin: "10px 0", textTransform: "none" }}
        >
          Upload Item Picture
          <Input
            type="file"
            name="itemPicture"
            accept=".png,.jpg,.jpeg"
            onChange={(e) => setItemPicture(e.target.files[0])}
          />
        </Button>
        <TextField
          label="Item Value"
          name="itemValue"
          type="number"
          fullWidth
          value={itemValue}
          onChange={(e) => setItemValue(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Item Loan Value"
          name="itemLoanValue"
          type="number"
          fullWidth
          value={itemLoanValue}
          onChange={(e) => setItemLoanValue(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Item Interest Percentage"
          name="itemInterestPercentage"
          type="number"
          fullWidth
          value={itemInterestPercentage}
          onChange={(e) => setItemInterestPercentage(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Item Interest Period"
          name="itemInterestPeriod"
          type="number"
          fullWidth
          value={itemInterestPeriod}
          onChange={(e) => setItemInterestPeriod(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Item Interest Value"
          name="itemInterestValue"
          type="number"
          fullWidth
          value={itemInterestValue}
          onChange={(e) => setItemInterestValue(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Item Loan Date"
          name="itemLoanDate"
          type="date"
          fullWidth
          value={itemLoanDate}
          onChange={(e) => setItemLoanDate(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Item Return Date"
          name="itemReturnDate"
          type="date"
          fullWidth
          value={itemReturnDate}
          onChange={(e) => setItemReturnDate(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Loan Pending Interest Amount"
          name="loanPendingInterestAmount"
          type="number"
          fullWidth
          value={loanPendingInterestAmount}
          onChange={(e) => setLoanPendingInterestAmount(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Loan Pending Principal Amount"
          name="loanPendingPrincipalAmount"
          type="number"
          fullWidth
          value={loanPendingPrincipalAmount}
          onChange={(e) => setLoanPendingPrincipalAmount(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Loan Pending Total Amount"
          name="loanPendingTotalAmount"
          type="number"
          fullWidth
          value={loanPendingTotalAmount}
          onChange={(e) => setLoanPendingTotalAmount(e.target.value)}
          margin="normal"
        />
        <TextField
          select
          label="Item Status"
          name="itemStatus"
          fullWidth
          value={itemStatus}
          onChange={(e) => setItemStatus(e.target.value)}
          margin="normal"
        >
          <MenuItem value="NEW">New</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
        </TextField>
        <Button variant="contained" type="submit" color="primary" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>

      <h2>Loan List</h2>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={loanList}
          columns={columns}
          disableSelectionOnClick
          getRowId={(row) => row.loanId}
          rowHeight={75}
        />
      </div>

    </div>
  );
};

export default Loan;
