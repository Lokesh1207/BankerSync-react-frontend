import React, { useState, useEffect } from "react";
import api from "./api/api";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ModeEditOutlineTwoToneIcon from "@mui/icons-material/ModeEditOutlineTwoTone";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateModal from "./UpdateModal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ManageLoans = () => {
  const [loanList, setLoanList] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentLoan, setCurrentLoan] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

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

  const deleteLoan = async (id) => {
    try {
      const response = await api.delete(`loan/removeLoan/${id}`);
      console.log(response); // Debug the response
      if (response.status === 200) {
        console.log();
        setLoanList((prevList) =>
          prevList.filter((loan) => loan.loanId !== id)
        );

        setSnackbar({
          open: true,
          message: "Loan deleted successfully.",
          severity: "success",
        });
      }
    } catch (err) {
      console.error("Error deleting Loan:", err);
    }
  };

  const handleUpdateLoan = async (updatedLoan) => {
    try {
      const { loanId, itemLoanValue, itemInterestValue } = updatedLoan;

      const parsedLoanValue = parseFloat(itemLoanValue);
      const parsedInterestValue = parseFloat(itemInterestValue);

      const response = await api.put(
        `loan/updateLoan/${loanId}/${parsedLoanValue}/${parsedInterestValue}`
      );

      if (response.status === 200) {
        const updatedLoanData = response.data; 
        setLoanList((prevList) =>
          prevList.map((loan) =>
            loan.loanId === loanId
              ? {
                  ...loan,
                  loanPendingPrincipalAmount: updatedLoanData.loanPendingPrincipalAmount,
                  loanPendingInterestAmount: updatedLoanData.loanPendingInterestAmount,
                  loanPendingTotalAmount: updatedLoanData.loanPendingTotalAmount,
                }
              : loan
          )
        );
        setSnackbar({
          open: true,
          message: "Loan updated successfully.",
          severity: "success",
        });
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error("Error updating loan:", err);
      setSnackbar({
        open: true, 
        message: "Failed to update loan.",
        severity: "error",
      });
    }
  };

  const openEditModal = (loan) => {
    setCurrentLoan(loan);
    setIsEditModalOpen(true);
  };

  const downloadPDF = () => { 
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 210], // A4 size in landscape mode
    });

    doc.autoTable({
      head: [
        [
          "Loan ID",
          "Client ID",
          "Owner Name",
          "Contact Number",
          "Item Value",
          "Loan Value",
          "Interest %",
          "Interest Period",
          "Interest Value",
          "Loan Date",
          "Return Date",
          "Pending Interest",
          "Pending Principal",
          "Total Pending",
          "Status",
        ],
      ],
      body: loanList.map((loan) => [
        loan.loanId || "N/A",
        loan.clientId || "N/A",
        loan.ownerName || "N/A",
        loan.ownerContactNumber || "N/A",
        loan.itemValue || "N/A",
        loan.itemLoanValue || "N/A",
        loan.itemInterestPercentage || "N/A",
        loan.itemInterestPeriod || "N/A",
        loan.itemInterestValue || "N/A",
        loan.itemLoanDate || "N/A",
        loan.itemReturnDate || "N/A",
        loan.loanPendingInterestAmount || "N/A",
        loan.loanPendingPrincipalAmount || "N/A",
        loan.loanPendingTotalAmount || "N/A",
        loan.itemStatus || "N/A",
      ]),
      margin: { top: 10, right: 10, bottom: 10, left: 2 },
      styles: { fontSize: 6 },
      columnStyles: {
        0: { cellWidth: 10 }, // Loan ID
        1: { cellWidth: 10 }, // Client ID
        2: { cellWidth: 25 }, // Owner Name
        3: { cellWidth: 25 }, // Contact Number
        4: { cellWidth: 20 }, // Item Value
        5: { cellWidth: 20 }, // Loan Value
        6: { cellWidth: 15 }, // Interest %
        7: { cellWidth: 20 }, // Interest Period
        8: { cellWidth: 20 }, // Interest Value
        9: { cellWidth: 25 }, // Loan Date
        10: { cellWidth: 25 }, // Return Date
        11: { cellWidth: 20 }, // Pending Interest
        12: { cellWidth: 20 }, // Pending Principal
        13: { cellWidth: 20 }, // Total Pending
        14: { cellWidth: 20 }, // Status
      },
      didDrawPage: function (data) {
        doc.text("Loans Report", 148, 7, { align: "center" });
      },
    });

    // Save the PDF
    doc.save("loans.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(loanList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Loans");
    XLSX.writeFile(workbook, "loans.xlsx");
  };

  const columns = [
    { field: "loanId", headerName: "Loan_ID", width: 90 },
    { field: "clientId", headerName: "Client_ID", width: 90 },
    { field: "ownerName", headerName: "Name", width: 150 },
    { field: "ownerContactNumber", headerName: "ContactNumber", width: 150 },
    { field: "itemPicture", headerName: "itemPicture", width: 150 },
    { field: "itemValue", headerName: "itemValue", width: 150 },
    { field: "itemLoanValue", headerName: "itemLoanValue", width: 120 },
    {
      field: "itemInterestPercentage",
      headerName: "itemInterestPercentage",
      width: 120,
    },
    {
      field: "itemInterestPeriod",
      headerName: "itemInterestPeriod",
      width: 150,
    },
    { field: "itemInterestValue", headerName: "itemInterestValue", width: 150 },
    { field: "itemLoanDate", headerName: "itemLoanDate", width: 180 },
    { field: "itemReturnDate", headerName: "itemReturnDate", width: 180 },
    {
      field: "loanPendingInterestAmount",
      headerName: "loanPendingInterestAmount",
      width: 180,
    },
    {
      field: "loanPendingPrincipalAmount",
      headerName: "loanPendingPrincipalAmount",
      width: 180,
    },
    {
      field: "loanPendingTotalAmount",
      headerName: "loanPendingTotalAmount",
      width: 180,
    },
    { field: "itemStatus", headerName: "itemStatus", width: 180 },

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Box display="flex" flexDirection="column" gap={0.5}>
          <Button
            color="primary"
            onClick={() => openEditModal(params.row)}
            startIcon={<ModeEditOutlineTwoToneIcon />}
          ></Button>
          <Button
            color="error"
            onClick={() => deleteLoan(params.row.loanId)}
            startIcon={<DeleteIcon />}
          ></Button>
        </Box>
      ),
    },
  ];

  return (
    <div style={{ padding: "5px", maxWidth: "1600px", margin: "auto" }}>
      <div style={{ height: "calc(100vh - 120px)", width: "100%" }}>
        {" "}
        {/* Adjust height to occupy the full screen */}
        <Box display="flex" gap={2} mb={2}>
          <Button variant="contained" color="primary" onClick={downloadPDF}>
            Download PDF
          </Button>
          <Button variant="contained" color="success" onClick={downloadExcel}>
            Download Excel
          </Button>
        </Box>
        <DataGrid
          rows={loanList}
          columns={columns}
          disableSelectionOnClick
          getRowId={(row) => row.loanId}
          rowHeight={75}
        />
      </div>

      {/* Update Modal */}
      {isEditModalOpen && (
        <UpdateModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          loan={currentLoan}
          onSubmit={handleUpdateLoan}
        />
      )}
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

export default ManageLoans;
