import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import api from "../api/api";
import '../App.css';

const Input = styled("input")({
  display: "none",
});

//for alert message
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Client = () => {
  const initialClientData = {
    clientId: "",
    clientName: "",
    clientFatherName: "",
    clientAddress: "",
    clientContactPrimary: "",
    clientContactSecondary: "",
    clientProof: "", // File input
    clientPicture: "", // File input
    clientCreatedAt: "",
    clientUpdatedAt: "",
    clientRecords: ""
  };

  const [clientData, setClientData] = useState(initialClientData);
  const [clientList, setClientList] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // useEffect(() => {
  //   const fetchClients = async () => {
  //     try {
  //       const response = await api.get("/getClients");
  //       setClientList(response.data);
  //     } catch (err) {
  //       console.error("Error fetching client list:", err);
  //     }
  //   };

  //   fetchClients();
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: files[0] })); // Save file object
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    for (const key in clientData) {
      if (!clientData[key] && key !== "clientProof" && key !== "clientPicture") {
        setSnackbar({
          open: true,
          message: `Please fill out the ${key.replace("client", "").toLowerCase()} field.`,
          severity: "error",
        });
        return;
      }
    }
  
    try {
      const formattedData = {
        ...clientData,
        clientCreatedAt: clientData.clientCreatedAt
          ? new Date(clientData.clientCreatedAt).toISOString().split("T")[0]
          : null,
        clientUpdatedAt: clientData.clientUpdatedAt
          ? new Date(clientData.clientUpdatedAt).toISOString().split("T")[0]
          : null,
      };
  
      if (clientData.clientProof) {
        formattedData.clientProof = clientData.clientProof.name;
      }
  
      if (clientData.clientPicture) {
        formattedData.clientPicture = clientData.clientPicture.name;
      }
  
      const formData = new FormData();
      formData.append("clientDetails", JSON.stringify(formattedData));  

      if (clientData.clientPicture) {
        formData.append("clientPicture", clientData.clientPicture);
      }

      if (clientData.clientProof) {
        formData.append("clientProof", clientData.clientProof);
      }

      console.log(...formData); 

  
      const response = await api.post("/client/addNewClient", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    
      setClientList((prevList) => [...prevList, response.data]);
      setSnackbar({ open: true, message: "Client added successfully.", severity: "success"});
      setClientData(initialClientData);  
  
    } catch (error) {
      console.error("Error submitting data:", error);
      setSnackbar({ open: true, message: "Failed to add client.", severity: "error" });
    }
  };

  const deleteClient = async (id) => {
    try {
      const response = await api.delete(`client/removeClient/${id}`);
      if (response.status === 200) {
        setClientList((prevList) => prevList.filter((client) => client.clientId !== id));
        setSnackbar({ open: true, message: "Client deleted successfully.", severity: "success" });
      }
    } catch (err) {
      console.error("Error deleting client:", err);
      setSnackbar({ open: true, message: "Failed to delete client.", severity: "error" });
    }
  };

  const updateClient = async (id) => {
    // Find the client to be updated
    const updatedClient = clientList.find((client) => client.clientId === id);
  
    // Check if the client exists
    if (!updatedClient) {
      setSnackbar({
        open: true,
        message: "Client not found.",
        severity: "error",
      });
      return;
    }
  
    try {
      // Create a FormData object to handle file and text data
      const formData = new FormData();
      for (const key in updatedClient) {
        if (updatedClient[key] !== null) {
          formData.append(key, updatedClient[key]);
        }
      }
  
      // API call to update the client details
      const response = await api.put(`/client/editClient/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const updatedClientData = response.data;
  
      // Update the clientList with the new details
      setClientList((prevList) =>
        prevList.map((client) => (client.clientId === id ? updatedClientData : client))
      );
  
      // Show success notification
      setSnackbar({
        open: true,
        message: "Client updated successfully.",
        severity: "success",
      });
    } catch (err) {
      console.error("Error updating client:", err);
  
      // Show error notification
      setSnackbar({
        open: true,
        message: "Failed to update client.",
        severity: "error",
      });
    }
  };
  
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <form onSubmit={handleSubmit}>
        <h2>Client Registration</h2>

        {/* Form Inputs */}
        <TextField
          label="Client ID"
          name="clientId"
          value={clientData.clientId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Name"
          name="clientName"
          value={clientData.clientName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Father's Name"
          name="clientFatherName"
          value={clientData.clientFatherName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          name="clientAddress"
          value={clientData.clientAddress}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Primary Contact"
          name="clientContactPrimary"
          value={clientData.clientContactPrimary}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Secondary Contact"
          name="clientContactSecondary"
          value={clientData.clientContactSecondary}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
          <Button
            variant="contained"
            component="label"
            color="primary"
            sx={{ margin: "10px 0", textTransform: "none" }}
          >
            Upload Proof
            <Input
              type="file"
              name="clientProof"
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.pdf" // Adjust file types as needed
            />
          </Button>
          {clientData.clientProof && (
            <span style={{ marginLeft: "10px" }}>
              {clientData.clientProof.name}
            </span>
          )}

          <Button
            variant="contained"
            component="label"
            color="secondary"
            sx={{ margin: "10px 0", marginLeft:"20px", textTransform: "none" }}
          >
            Upload Picture
            <Input
              type="file"
              name="clientPicture"
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg" // Adjust file types as needed
            />
          </Button>
          {clientData.clientPicture && (
            <span style={{ marginLeft: "10px" }}>
              {clientData.clientPicture.name}
            </span>
          )}

        <TextField
          label="Created At"
          name="clientCreatedAt"
          type="date"
          value={clientData.clientCreatedAt}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Updated At"
          name="clientUpdatedAt"
          type="date"
          value={clientData.clientUpdatedAt}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Records"
          name="clientRecords"
          value={clientData.clientRecords}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>

      <h2>Client List</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Father's Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Primary Contact</TableCell>
              <TableCell>Secondary Contact</TableCell>
              <TableCell>Proof</TableCell>
              <TableCell>Picture</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell>Records</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientList.map((client) => (
              <TableRow key={client.clientId}>
                <TableCell>{client.clientId}</TableCell>
                <TableCell>{client.clientName}</TableCell>
                <TableCell>{client.clientFatherName}</TableCell>
                <TableCell>{client.clientAddress}</TableCell>
                <TableCell>{client.clientContactPrimary}</TableCell>
                <TableCell>{client.clientContactSecondary}</TableCell>
                <TableCell>
                  {client.clientProof && <img src={client.clientProof} alt="Proof" style={{ width: "50px" }} />}
                </TableCell>
                <TableCell>
                  {client.clientPicture && <img src={client.clientPicture} alt="Picture" style={{ width: "50px" }} />}
                </TableCell>
                <TableCell>{client.clientCreatedAt}</TableCell>
                <TableCell>{client.clientUpdatedAt}</TableCell>
                <TableCell>{client.clientRecords}</TableCell>
                <TableCell>
                <Button color="secondary" onClick={() => updateClient(client.clientId)}>Edit</Button>
                <Button color="secondary" onClick={() => deleteClient(client.clientId)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for Notifications */}
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

export default Client;
