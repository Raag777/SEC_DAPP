// src/utils/download.js
export function downloadBlob(blobData, filename) {
  const url = window.URL.createObjectURL(blobData);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
