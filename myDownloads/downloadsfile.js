const path = require("path");
const fs = require("fs");
const { patientChartLogger } = require("../Logger/ChartLogger");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const capitalize = (str) => {
  if (typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};


const MedicalandLedger = async (first_name, last_name, res) => {
  

      try {
        await sleep(5000);
        console.log(">>>>>>code running",)

        const commanName = "- Daily Note.pdf";
        const downloadPath = "/home/ec2-user/Downloads"
        const formattedFirstName = capitalize(first_name);
        const formattedLastName = capitalize(last_name);
        const fileName = `${formattedLastName} ${formattedFirstName} ${commanName}`;
        const filePath = path.join(downloadPath, fileName);

        const ledgerFileName = "Open Item Ledger.pdf";
        const ledgerFilePath = path.join(downloadPath, ledgerFileName);

        if (!fs.existsSync(filePath)) {
          patientChartLogger.error(`Medical File not found: ${filePath}`);
          if (!res.headersSent) {
            return res.status(404).json({ message: "Medical File not found" });
          }
          return;
        }

        if (!fs.existsSync(ledgerFilePath)) {
          patientChartLogger.error(`Ledger File not found: ${ledgerFilePath}`);
          if (!res.headersSent) {
            return res.status(404).json({ message: "Ledger File not found" });
          }
          return;
        }

        fs.readFile(filePath, (err, data) => {
          if (err) {
            patientChartLogger.error("Error reading file:", err);
            if (!res.headersSent) {
              return res
                .status(500)
                .json({ message: "Error reading file", error: err.message });
            }
            return;
          }

          if (!data) {
            patientChartLogger.error("File data is undefined");
            if (!res.headersSent) {
              return res
                .status(500)
                .json({ message: "Error processing file data" });
            }
            return;
          }

          // Read ledger file
          fs.readFile(ledgerFilePath, (err, data2) => {
            if (err) {
              patientChartLogger.error("Error reading file:", err);
              if (!res.headersSent) {
                return res
                  .status(500)
                  .json({ message: "Error reading file", error: err.message });
              }
              return;
            }

            if (!data2) {
              patientChartLogger.error("File data is undefined");
              if (!res.headersSent) {
                return res
                  .status(500)
                  .json({ message: "Error processing file data" });
              }
              return;
            }

            const base64Data = data.toString("base64");
            const ledgerBase64 = data2.toString("base64");
            patientChartLogger.info("PDF files read and encoded successfully");

            if (!res.headersSent) {
              res.status(200).json({
                Status: "True",
                message: "Medical Records sent successfully",
                MedicalData: base64Data,
                LedgerData: ledgerBase64,
              });

              // Delete files
              fs.unlink(filePath, (err) => {
                if (err) {
                  patientChartLogger.error("Error deleting file:", err);
                } else {
                  patientChartLogger.info(
                    "Medical PDF file deleted successfully"
                  );
                }
              });

              fs.unlink(ledgerFilePath, (err) => {
                if (err) {
                  patientChartLogger.error("Error deleting ledger file:", err);
                } else {
                  patientChartLogger.info(
                    "Ledger PDF file deleted successfully"
                  );
                }
              });
            }
          });
        });
      } catch (error) {
        patientChartLogger.error("Error in MedicalandLedger:", error);
        if (!res.headersSent) {
          return res.status(500).json({
            message: "Error processing file download",
            error: error.message,
          });
        }
      }
    }

module.exports = MedicalandLedger






