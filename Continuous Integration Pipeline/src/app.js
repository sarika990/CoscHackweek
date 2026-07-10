import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Continuous Integration Project Running Successfully');
});

// Start the server only when run directly
const isDirectRun =
  process.argv[1] &&
  (process.argv[1] === new URL(import.meta.url).pathname ||
    process.argv[1].endsWith('app.js') ||
    process.argv[1].endsWith('app.js'));

if (isDirectRun) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
