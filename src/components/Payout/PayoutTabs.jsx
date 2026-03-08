import { Tabs, Tab } from "@mui/material";

const PayoutTabs = ({ tabValue, setTabValue }) => {
  return (
    <Tabs
      value={tabValue}
      onChange={(e, newValue) => setTabValue(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      sx={{ mb: 2 }}
    >
      <Tab label="Pending Requests" />
      <Tab label="Completed Requests" />
      <Tab label="Rejected Requests" />
      <Tab label="Received Payments" />
    </Tabs>
  );
};

export default PayoutTabs;
