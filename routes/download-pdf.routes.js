const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");

const fs = require("fs");
const path = require("path");

router.get("/:a", (req, res) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(path.join(`./path/to/${req.params.a}.pdf`))); // write to PDF
  doc.pipe(res); // HTTP response

  // add stuff to PDF here using methods described below...

  // finalize the PDF and end the stream
  doc.end();
});

module.exports = router;
