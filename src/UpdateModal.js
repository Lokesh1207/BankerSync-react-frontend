import React, { useState, useEffect } from "react";
import { Modal, TextField, Button } from "@mui/material";

const UpdateModal = ({ open, onClose, loan, onSubmit }) => {
  // Step 1: Initialize the state properly to handle the loan values
  const [updatedLoan, setUpdatedLoan] = useState({
    loanId: "",
    itemLoanValue: "",
    itemInterestValue: "",
  });

  // Step 2: Update the state whenever the `loan` prop changes
  useEffect(() => {
    if (loan) {
      setUpdatedLoan({
        loanId: loan.loanId,
        itemLoanValue: loan.itemLoanValue || "",
        itemInterestValue: loan.itemInterestValue || "",
      });
    }
  }, [loan]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedLoan((prev) => ({...prev,[name]: value,}));
  };

  const handleFormSubmit = () => {
    onSubmit(updatedLoan);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: "20px", backgroundColor: "#fff", margin: "10% auto", width: "300px" }}>
        <h3>Update Loan Details</h3>
        
        <TextField
          label="Loan Value"
          name="itemLoanValue"
          value={updatedLoan.itemLoanValue}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        
        <TextField
          label="Interest Value"
          name="itemInterestValue"
          value={updatedLoan.itemInterestValue}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        
        <Button variant="contained" color="primary" onClick={handleFormSubmit}>
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default UpdateModal;
