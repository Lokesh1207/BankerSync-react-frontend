import React, { useState, useEffect } from 'react'
import api from './api/api';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Snackbar } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import ModeEditOutlineTwoToneIcon from '@mui/icons-material/ModeEditOutlineTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateModal from './UpdateModal';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ManageLoans = () => {
    const [loanList, setLoanList] = useState([])
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [currentLoan, setCurrentLoan] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" })

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
          console.log()
          setLoanList((prevList) => prevList.filter((loan) => loan.loanId !== id));
  
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
        console.log("Updating loan with data:", { loanId, itemLoanValue, itemInterestValue });
    
        const response = await api.put(`/updateLoan/${loanId}/${itemLoanValue}/${itemInterestValue}`);
        console.log("Update response:", response);
    
        if (response.status === 200) {
          setLoanList((prevList) =>
            prevList.map((loan) => (loan.loanId === loanId ? { ...loan, ...updatedLoan } : loan))
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

    const columns = [
        { field: 'loanId', headerName: 'Loan_ID', width: 90 },
        { field: 'clientId', headerName: 'Client_ID', width: 90 },
        { field: 'ownerName', headerName: 'Name', width: 150 },
        { field: 'ownerContactNumber', headerName: 'ContactNumber', width: 150 },
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
          width: 100,
          renderCell: (params) => (
            <Box display="flex" flexDirection="column" gap={0.5}>
            <Button color="primary"  onClick={() => openEditModal(params.row)} startIcon={<ModeEditOutlineTwoToneIcon />}></Button>
            <Button color="error" onClick = {() => deleteLoan(params.row.loanId)}startIcon={<DeleteIcon />}></Button>
            </Box>
          ),
        },
      ];


  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
        <h2>Loan List</h2>
        <div style={{ height: 600, width: "100%" }}>
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
  )
}

export default ManageLoans