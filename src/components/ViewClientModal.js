import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import ClientImage from "./ClientImage"; // Ensure correct import

const ViewClientModal = ({
  isViewModalOpen,
  setIsViewModalOpen,
  selectedClient,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={isViewModalOpen}
      onClose={() => setIsViewModalOpen(false)}
      PaperProps={{
        style: {
          backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#fff", // Dark mode support
          color: theme.palette.mode === "dark" ? "#ffffff" : "#000",
          padding: "20px",
          borderRadius: "10px",
          width: "500px",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Client Details
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {selectedClient && (
          <Box display="flex" flexDirection="column" gap={1}>
            {[
              { label: "Name", value: selectedClient.clientName },
              {
                label: "Father's Name",
                value: selectedClient.clientFatherName,
              },
              { label: "Address", value: selectedClient.clientAddress },
              {
                label: "Primary Contact",
                value: selectedClient.clientContactPrimary,
              },
              {
                label: "Secondary Contact",
                value: selectedClient.clientContactSecondary,
              },
              { label: "Created At", value: selectedClient.clientCreatedAt },
              { label: "Updated At", value: selectedClient.clientUpdatedAt },
              { label: "Records", value: selectedClient.clientRecords },
            ].map((item, index) => (
              <Box key={index} display="flex" gap={1}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {item.label}:
                </Typography>
                <Typography>{item.value}</Typography>
              </Box>
            ))}

            {/* Client Images */}
            <ClientImage
              clientPicture={selectedClient.clientPicture}
              clientProof={selectedClient.clientProof}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setIsViewModalOpen(false)}
          color="primary"
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewClientModal;
