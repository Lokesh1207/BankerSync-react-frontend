import React, { useEffect, useState } from "react";
import { Container, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [loanOverview, setLoanOverview] = useState({
    totalLoans: 0,
    activeLoans: 0,
    closedLoans: 0,
  });

  const [clientOverview, setClientOverview] = useState({
    totalClients: 0,
    activeClients: 0,
    recentClients: [], // Add recentClients to the state
  });

  useEffect(() => {
    fetch("http://localhost:8080/dashboard/loans-overview")
      .then((res) => res.json())
      .then((data) => setLoanOverview(data.data));

    fetch("http://localhost:8080/dashboard/clients-overview")
      .then((res) => res.json())
      .then((data) => setClientOverview(data.data));
  }, []);

  const loanChartData = {
    labels: ["Total Loans", "Active Loans"],
    datasets: [
      {
        label: "Loan Overview",
        data: [loanOverview.totalLoans, loanOverview.activeLoans],
        backgroundColor: ["#3f51b5", "#ff9800"],
      },
    ],
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Total Clients</Typography>
              <Typography variant="h4">{clientOverview.totalClients}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Active Clients</Typography>
              <Typography variant="h4">{clientOverview.activeClients || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5">Loan Overview</Typography>
              <Bar data={loanChartData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Clients Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Recent Clients
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Phone no</TableCell>
                      <TableCell>Created At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clientOverview.recentClients.map((client) => (
                      <TableRow key={client.clientId}>
                        <TableCell>{client.clientName}</TableCell>
                        <TableCell>{client.clientContactPrimary}</TableCell>
                        <TableCell>{new Date(client.clientCreatedAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;