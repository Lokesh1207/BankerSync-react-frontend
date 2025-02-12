import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import api from "../api/api";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Input = styled("input")({
  display: "none",
});

const Loan = () => {
  const [clients, setClients] = useState([]); 
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
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // Fetch clients when the component mounts
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("client/getClients");
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setSnackbar({ open: true, message: "Failed to fetch clients.", severity: "error" });
      }
    };
    fetchClients();
  }, []);

  // Handle client selection
  const handleClientChange = async (e) => {
    const selectedClientId = e.target.value;
    setClientId(selectedClientId);

    // Fetch client details
    try {
      const response = await api.get(`client/getClient/${selectedClientId}`);
      const client = response.data;
      setOwnerName(client.clientName);
      setOwnerContactNumber(client.clientContactPrimary);
    } catch (error) {
      console.error("Error fetching client details:", error);
      setSnackbar({ open: true, message: "Failed to fetch client details.", severity: "error" });
    }
  };

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
      itemLoanDate: formattedItemLoanDate,
      itemReturnDate: formattedItemReturnDate,
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

      // Reset form fields
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

      setSnackbar({ open: true, message: "Loan added successfully.", severity: "success" });
    } catch (error) {
      console.error("Error submitting data:", error);
      setSnackbar({ open: true, message: "Failed to add Loan.", severity: "error" });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Client</InputLabel>
          <Select
            value={clientId}
            onChange={handleClientChange}
            label="Client"
          >
            {clients.map((client) => (
              <MenuItem key={client.clientId} value={client.clientId}>
                {client.clientName} (ID: {client.clientId})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default Loan;