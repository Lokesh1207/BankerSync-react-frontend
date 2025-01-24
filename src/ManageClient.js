import React, { useEffect, useState } from "react";
import { Button, Box, Snackbar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "./api/api";
import EditModal from "./EditModal";
import MuiAlert from "@mui/material/Alert";
import ModeEditOutlineTwoToneIcon from '@mui/icons-material/ModeEditOutlineTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ManageClients = () => {

  const [clientList, setClientList] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

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

  const deleteClient = async (id) => {
    try {
      const response = await api.delete(`client/removeclient/${id}`);
      if (response.status === 200) {
        setClientList((prevList) => prevList.filter((client) => client.clientId !== id));

        setSnackbar({
          open: true,
          message: "Client deleted successfully.",
          severity: "success",
        });

      }
    } catch (err) {
      console.error("Error deleting client:", err);
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

  const updateClientDetails = async (updatedClient) => {
    try {
      const formData = new FormData();
      formData.append("clientDetails", JSON.stringify(updatedClient));

      if (updatedClient.clientProof) {
        formData.append("clientProof", updatedClient.clientProof);
      }

      if (updatedClient.clientPicture) {
        formData.append("clientPicture", updatedClient.clientPicture);
      }

      console.log(updatedClient)
  
      await api.put(`/client/editClient/${updatedClient.clientId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setIsEditModalOpen(false);
      setClientList((prevList) => prevList.map((client) => client.clientId === updatedClient.clientId ? updatedClient : client));

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
          <Button color="primary" startIcon={<ModeEditOutlineTwoToneIcon />} onClick={() => handleEditClick(params.row.clientId)}></Button>
          <Button color="error" startIcon={<DeleteIcon />} onClick={() => deleteClient(params.row.clientId)}></Button>
        </Box>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <h2>Client List</h2>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={clientList}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          getRowId={(row) => row.clientId}
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

export default ManageClients;
