import axios from "./axiosClient";

export const downloadReceipt = async (certId, txHash) => {
  try {
    const response = await axios.get(
      `/download_receipt/${certId}/${txHash}`,
      { responseType: "blob" }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `PurchaseReceipt_${certId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    
  } catch (err) {
    console.error("PDF receipt download failed:", err);
    alert("Failed to download receipt");
  }
};
