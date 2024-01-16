const express = require("express");
const ThermalPrinter = require("node-thermal-printer").printer;
const Types = require("node-thermal-printer").types;
const cors = require("cors");
const app = express();
const port = 3000;
const printerIpAddress = "192.168.0.30";
app.use(cors());
app.options("*", cors());

app.get("/", (req, res) => {
  const textToPrint = req.query.text || "Hello, this is a test print.";

  const printer = new ThermalPrinter({
    type: Types.EPSON,
    interface: `tcp://${printerIpAddress}:9100`,
    timeout: 3000000,
  });

  printer.alignCenter();
  printer.bold(true);
  printer.println(textToPrint);
  printer.bold(false);
  printer.newLine();

  printer.cut();

  printer
    .execute()
    .then(() => {
      console.log("Print done");
      res.send(`
                <html>
                    <body>
                        <h1>Printed successfully!</h1>
                        <p>Printed Text: ${textToPrint}</p>
                    </body>
                </html>
            `);
    })
    .catch((error) => {
      console.error("Print error", error);
      res.status(500).send(`
                <html>
                    <body>
                        <h1>Print error</h1>
                    </body>
                </html>
            `);
    });
  res.json("get success");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
