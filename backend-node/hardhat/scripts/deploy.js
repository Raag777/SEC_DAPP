const hre = require("hardhat");

async function main() {
  console.log("Deploying SolarEnergyCertificate...");

  const Solar = await hre.ethers.getContractFactory("SolarEnergyCertificate");
  const solar = await Solar.deploy();

  await solar.waitForDeployment();   // << NEW FUNCTION (required)

  const address = await solar.getAddress();  // << New way to get address

  console.log("Contract deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
