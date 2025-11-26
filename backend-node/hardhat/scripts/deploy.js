const fs = require("fs");
const path = require("path");

async function main() {
  const SolarEnergyCertificate = await ethers.getContractFactory("SolarEnergyCertificate");
  const contract = await SolarEnergyCertificate.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("Contract deployed to:", address);

  // Save deployment JSON
  const filePath = path.join(
    __dirname,
    "..",
    "deployments",
    "localhost",
    "SolarEnergyCertificate.json"
  );

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  fs.writeFileSync(
    filePath,
    JSON.stringify({ address }, null, 2)
  );

  console.log("📦 Deployment saved to:", filePath);
}

main().catch(console.error);