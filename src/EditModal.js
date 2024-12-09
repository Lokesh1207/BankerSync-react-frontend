import { Modal, TextField, Button, Box } from "@mui/material";
import { useState } from "react";

const EditModal = ({ isOpen, onClose, client, onUpdate, onSave }) => {
  const [clientProof, setClientProof] = useState(null);
  const [clientPicture, setClientPicture] = useState(null);

  const handleFileChange = (event, setter) => {
    setter(event.target.files[0]);
  };

  const handleSave = () => {
    onSave(client, clientProof, clientPicture);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: "white",
          padding: 4,
          margin: "auto",
          width: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <h2>Edit Client</h2>

        <TextField
          label="Client Name"
          value={client?.clientName || ""}
          onChange={(e) => onUpdate({ ...client, clientName: e.target.value })}
        />
        <TextField
          label="Father's Name"
          value={client?.clientFatherName || ""}
          onChange={(e) =>
            onUpdate({ ...client, clientFatherName: e.target.value })
          }
        />
        <TextField
          label="Address"
          value={client?.clientAddress || ""}
          onChange={(e) => onUpdate({ ...client, clientAddress: e.target.value })}
        />
        <TextField
          label="Primary Contact"
          value={client?.clientContactPrimary || ""}
          onChange={(e) =>
            onUpdate({ ...client, clientContactPrimary: e.target.value })
          }
        />
        <TextField
          label="Secondary Contact"
          value={client?.clientContactSecondary || ""}
          onChange={(e) =>
            onUpdate({ ...client, clientContactSecondary: e.target.value })
          }
        />
        <TextField
          label="Records"
          value={client?.clientRecords || ""}
          onChange={(e) =>
            onUpdate({ ...client, clientRecords: e.target.value })
          }
        />
        <label>Upload Proof:</label>
        <input
          type="file"
          accept=".pdf,.docx,.png,.jpg,.jpeg"
          onChange={(e) => handleFileChange(e, setClientProof)}
        />
        <label>Upload Picture:</label>
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={(e) => handleFileChange(e, setClientPicture)}
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default EditModal;
