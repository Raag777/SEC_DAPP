import fs from "fs";
import path from "path";

const filePath = path.resolve("src/data/certificates.json");

export function loadCertificates() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const raw = fs.readFileSync(filePath);
    return JSON.parse(raw);
}

export function saveCertificates(list) {
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
}
