const express = require('express');
const equipmentRoutes = require("./src/equipment/router");

const app = express();
const port = 3000;
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.use('/api/v1/equipment', equipmentRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});