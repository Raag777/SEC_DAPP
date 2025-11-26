/**
 * Sync Script — Keeps ABI + Contract Address updated automatically
 *
 * ➤ Reads Hardhat’s deployment artifact
 * ➤ Copies ABI to:
 *      - backend-node/src/abi/
 *      - frontend-vite/src/abi/
 * ➤ Updates .env files:
 *      - backend-node/.env
 *      - frontend-vite/.env
 */

import fs from "fs";
import path from "path";

console.log("🔄 Syncing ABI + Contract Address...");

try {
  const artifactPath = path.join(
    "..",
    "backend-node",
    "hardhat",
    "artifacts",
    "contracts",
    "SolarEnergyCertificate.sol",
    "SolarEnergyCertificate.json"
  );

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const contractAddressPath = path.join(
    "..",
    "backend-node",
    "hardhat",
    "deployments",
    "localhost",
    "SolarEnergyCertificate.json"
  );

  let deployedAddress = null;

  if (fs.existsSync(contractAddressPath)) {
    const deployed = JSON.parse(fs.readFileSync(contractAddressPath, "utf8"));
    deployedAddress = deployed.address;
  }

  if (!deployedAddress) {
    console.log("❌ ERROR: Contract not deployed or deployment file missing.");
    process.exit(1);
  }

  // ------------------- COPY ABI -------------------
  const backendABIPath = path.join(
    "..",
    "backend-node",
    "src",
    "abi",
    "SolarEnergyCertificate.json"
  );
  const frontendABIPath = path.join(
    "..",
    "frontend-vite",
    "src",
    "abi",
    "SolarEnergyCertificate.json"
  );

  fs.writeFileSync(backendABIPath, JSON.stringify(artifact.abi, null, 2));
  fs.writeFileSync(frontendABIPath, JSON.stringify(artifact.abi, null, 2));

  console.log("📦 ABI synced successfully!");

  // ------------------- UPDATE .env FILES -------------------
  const backendEnv = path.join("..", "backend-node", ".env");
  const frontendEnv = path.join("..", "frontend-vite", ".env");

  const updateEnv = (filePath, address) => {
    let content = fs.readFileSync(filePath, "utf8");

    if (!content.includes("CONTRACT_ADDRESS")) {
      content += `\nCONTRACT_ADDRESS=${address}\n`;
    } else {
      content = content.replace(
        /CONTRACT_ADDRESS=.*?\n/,
        `CONTRACT_ADDRESS=${address}\n`
      );
    }

    fs.writeFileSync(filePath, content);
  };

  updateEnv(backendEnv, deployedAddress);
  updateEnv(frontendEnv, deployedAddress);

  console.log("📝 .env files updated!");
  console.log("🎉 Sync complete!");
} catch (err) {
  console.error("❌ Sync failed:", err);
  process.exit(1);
}