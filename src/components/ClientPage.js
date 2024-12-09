import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Snackbar,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid";
import api from "../api/api";
import '../App.css';
import EditModal from '../EditModal'


const Input = styled("input")({
  display: "none",
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ClientPage = () => {
  const initialClientData = {
    clientId: "",
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
  const [clientList, setClientList] = useState([])
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [selectedClient, setSelectedClient] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  //GetMapping
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/client/getClients"); 
        setClientList(response.data);
      } catch (err) {
        console.error("Error fetching client list:", err);
      }
    };
  
    fetchClients();
  }, []); 
 
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
  
      const response = await api.post("/client/addNewClient", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    
      setClientList((prevList) => [...prevList, response.data]);
      setSnackbar({ open: true, message: "Client added successfully.", severity: "success" });
      setClientData(initialClientData);  
    } catch (error) {
      console.error("Error submitting data:", error);
      setSnackbar({ open: true, message: "Failed to add client.", severity: "error" });
    }
  };

  const deleteClient = async (id) => {
    try {
      const response = await api.delete(`client/removeclient/${id}`);
      if (response.status === 200) {
        setClientList((prevList) => prevList.filter((client) => client.clientId !== id));
        setSnackbar({ open: true, message: "Client deleted successfully.", severity: "success" });
      }
    } catch (err) {
      console.error("Error deleting client:", err);
      setSnackbar({ open: true, message: "Failed to delete client.", severity: "error" });
    }
  };

  const updateClientDetails = async (updatedClient) => {
    try {
      const formData = new FormData();
      formData.append("clientDetails", JSON.stringify(updatedClient));
      if (updatedClient.clientProof instanceof File) {
        formData.append("clientProof", updatedClient.clientProof);
      }
      if (updatedClient.clientPicture instanceof File) {
        formData.append("clientPicture", updatedClient.clientPicture);
      }
      console.log(JSON.stringify(updatedClient))
  
      await api.put(`/client/editClient/${updatedClient.clientId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setIsEditModalOpen(false);
      setClientList((prevList) =>
        prevList.map((client) =>
          client.clientId === updatedClient.clientId ? updatedClient : client
        )
      );
      setSnackbar({
        open: true,
        message: "Client updated successfully.",
        severity: "success",
      });
    } catch (err) {
      console.error("Error updating client:", err);
      setSnackbar({ open: true, message: "Failed to update client.", severity: "error" });
    }
  };
  
  const handleEditClick = async (clientId) => {
    try{
      const response = await api.get(`/client/getClient/${clientId}`)
      setSelectedClient(response.data)
      setIsEditModalOpen(true)
    }
    catch(err){
      console.log("error opening" , err)
    }
  }

  const columns = [
    { field: 'clientId', headerName: 'ID', width: 90 },
    { field: 'clientName', headerName: 'Name', width: 150 },
    { field: 'clientFatherName', headerName: 'Father\'s Name', width: 150 },
    { field: 'clientAddress', headerName: 'Address', width: 180 },
    { field: 'clientContactPrimary', headerName: 'Primary Contact', width: 150 },
    { field: 'clientContactSecondary', headerName: 'Secondary Contact', width: 150 },
    { field: 'clientProof', headerName: 'Proof', width: 120 },
    { field: 'clientPicture', headerName: 'Picture', width: 120 },
    { field: 'clientCreatedAt', headerName: 'Created At', width: 150 },
    { field: 'clientUpdatedAt', headerName: 'Updated At', width: 150 },
    { field: 'clientRecords', headerName: 'Records', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box display="flex" flexDirection="column" gap={1}>
          <Button color="secondary" onClick={() => handleEditClick(params.row.clientId)}>Edit</Button>
          <Button color="secondary" onClick={() => deleteClient(params.row.clientId)}>Delete</Button>
        </Box>
      ),
    },
  ];

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

      <h2>Client List</h2>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={clientList}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          getRowId={(row) => row.clientId}
          // getRowHeight={() => 'auto'}
          rowHeight={75}
        />
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={selectedClient}
        onUpdate={(updatedClient) => setSelectedClient(updatedClient)}
        onSave={updateClientDetails}
      />
      
    </div>
  );
};

export default ClientPage;
