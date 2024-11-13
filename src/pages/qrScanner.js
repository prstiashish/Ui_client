import React, { useState } from "react";
import { DashboardLayout } from "src/components/dashboard-layout";
import { QRCode } from "qrcode.react"; // Import the QRCode component

const QRScanner = () => {
  const [url, setUrl] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) {
      setShow(true);
    } else {
      alert("Please enter a URL to generate the QR code.");
    }
  };

  return (
    <div>
      <h3>QR Code Generator in React</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to generate QR code"
          required
        />
        <input type="submit" value="Generate QR" />
      </form>

      {show && url && (
        <div style={{ marginTop: "20px" }}>
          {/* Use the QRCode component to generate the QR code */}
          <QRCode value={url} size={256} />
        </div>
      )}
    </div>
  );
};

QRScanner.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default QRScanner;
