import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Snackbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "./api/api";
import EditModal from "./EditModal";
import MuiAlert from "@mui/material/Alert";
import ModeEditOutlineTwoToneIcon from "@mui/icons-material/ModeEditOutlineTwoTone";
import DeleteIcon from "@mui/icons-material/Delete";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewClientModal from "./components/ViewClientModal";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ManageClients = () => {
  const [clientList, setClientList] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

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
        setClientList((prevList) =>
          prevList.filter((client) => client.clientId !== id)
        );

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
    try {
      const response = await api.get(`/client/getClient/${clientId}`);
      setSelectedClient(response.data);
      setIsEditModalOpen(true);
    } catch (err) {
      console.log("error opening", err);
    }
  };

  const handleViewClick = async (clientId) => {
    try {
      const response = await api.get(`/client/getClient/${clientId}`);
      setSelectedClient(response.data);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Error fetching client details:", err);
    }
  };

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

      console.log(updatedClient);

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
      setSnackbar({
        open: true,
        message: "Failed to update client.",
        severity: "error",
      });
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [240, 180], // Width: 240mm, Height: 180mm (4:3 aspect ratio)
    });

    doc.autoTable({
      head: [
        [
          "ID",
          "Name",
          "Father's Name",
          "Address",
          "Primary Contact",
          "Secondary Contact",
          "Proof",
          "Picture",
          "Created At",
          "Updated At",
          "Records",
        ],
      ],
      body: clientList.map((client) => [
        client.clientId || "N/A",
        client.clientName || "N/A",
        client.clientFatherName || "N/A",
        client.clientAddress || "N/A",
        client.clientContactPrimary || "N/A",
        client.clientContactSecondary || "N/A",
        client.clientProof || "N/A",
        client.clientPicture || "N/A",
        client.clientCreatedAt || "N/A",
        client.clientUpdatedAt || "N/A",
        client.clientRecords || "N/A",
      ]),
      margin: { top: 10, right: 5, bottom: 10, left: 5 }, // Reduced margins to fit more content
      styles: { fontSize: 6 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 35 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },
        8: { cellWidth: 20 },
        9: { cellWidth: 20 },
        10: { cellWidth: 25 },
      },
      didDrawPage: function (data) {
        doc.text("Clients", 115, 7, { align: "center" });
        // doc.setFillColor(255, 255, 255); // White background (optional)
        // doc.setTextColor(150, 150, 150); // Gray color for the watermark
        // doc.setFontSize(100); // Large font size for the watermark
        // doc.setAlpha(0.2); // Set opacity (0.2 = 20% opacity)
        // doc.text("BANKERYNC", 120, 90, { align: "center" }); // Centered watermark
        // doc.setAlpha(1); // Reset opacity to default
      },
    });

    // Save the PDF
    doc.save("clients.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clientList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "clients.xlsx");
  };

  const columns = [
    { field: "clientId", headerName: "ID", width: 90 },
    { field: "clientName", headerName: "Name", width: 150 },
    { field: "clientFatherName", headerName: "Father's Name", width: 150 },
    { field: "clientAddress", headerName: "Address", width: 180 },
    {
      field: "clientContactPrimary",
      headerName: "Primary Contact",
      width: 150,
    },
    {
      field: "clientContactSecondary",
      headerName: "Secondary Contact",
      width: 150,
    },
    { field: "clientProof", headerName: "Proof", width: 120 },
    { field: "clientPicture", headerName: "Picture", width: 120 },
    { field: "clientCreatedAt", headerName: "Created At", width: 150 },
    { field: "clientUpdatedAt", headerName: "Updated At", width: 150 },
    { field: "clientRecords", headerName: "Records", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-around" width="100%" marginTop={"18px"}>
          <Button
            color="primary"
            startIcon={<ModeEditOutlineTwoToneIcon />}
            onClick={() => handleEditClick(params.row.clientId)}
          ></Button>
          <Button
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => deleteClient(params.row.clientId)}
          ></Button>
          <Button
            color="info"
            startIcon={<VisibilityIcon />}
            onClick={() => handleViewClick(params.row.clientId)}
          ></Button>
        </Box>
      ),
    },
  ];

  return (
    <div style={{ padding: "5px", maxWidth: "1600px", margin: "auto" }}>
      <div style={{ height: "calc(100vh - 120px)", width: "100%" }}>
        <Box display="flex" gap={2} mb={2}>
          <Button variant="contained" color="primary" onClick={downloadPDF}>
            Download PDF
          </Button>
          <Button variant="contained" color="success" onClick={downloadExcel}>
            Download Excel
          </Button>
        </Box>

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

      <ViewClientModal
        isViewModalOpen={isViewModalOpen}
        setIsViewModalOpen={setIsViewModalOpen}
        selectedClient={selectedClient}
      />
    </div>
  );
};

export default ManageClients;
