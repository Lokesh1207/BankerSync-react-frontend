import React, { useState } from "react";
import {
  Button,
  TextField,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import api from "../api/api";
import '../App.css';

const Input = styled("input")({
  display: "none",
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ClientPage = () => {
  const initialClientData = {
    clientName: "",
    clientFatherName: "",
    clientAddress: "",
    clientContactPrimary: "",
    clientContactSecondary: "",
    clientProof: "", 
    clientPicture: "", 
    clientCreatedAt: "",
    clientUpdatedAt: "",
    clientRecords: ""
  };

  const [clientData, setClientData] = useState(initialClientData)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: files[0] })); 
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
  
      await api.post("/client/addNewClient", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
      });
      
      setSnackbar({ open: true, message: "Client added successfully.", severity: "success" });
      setClientData(initialClientData);  
      
      } catch (error) {
      console.error("Error submitting data:", error);
      setSnackbar({ open: true, message: "Failed to add client.", severity: "error" });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <form onSubmit={handleSubmit}>
        {/* <h2>Client Registration</h2> */}
        
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
            accept=".png,.jpg,.jpeg,.pdf"
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
            accept=".png,.jpg,.jpeg"
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

export default ClientPage;
