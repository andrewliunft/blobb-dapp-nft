// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs")

async function main() {
  //EXTRACTING CHUNKS FROM THE SVG file: blobbOneLine.svg
  const svg = fs.readFileSync("./svgs/blobbOneLine.svg", {encoding: "utf8"})
  const SVGChunks = svg.split("|")

  //CONVERTING SVG STRING CHUNKS TO BYTES CHUNKS
  const SVGChunksInBytes = SVGChunks.map(chunk => hre.ethers.utils.toUtf8Bytes(chunk))
  console.log(SVGChunks.length, SVGChunksInBytes.length)

  //DEPLYING CONTRACT
  const Blobb = await hre.ethers.getContractFactory("Blobb");
  const blobb = await Blobb.deploy(/*SVGChunksInBytes*/);

  await blobb.deployed();
  console.log(`Blobb succesfully deployed to ${blobb.address}`);

  //CONTRACT INSTANCE TO ENABLE THE BLOBB SMART CONTRACT
  const accounts = await hre.ethers.getSigners()
  const signer = accounts[0]
  const blobbContract = new hre.ethers.Contract(blobb.address, Blobb.interface, signer)

  const chunksTX = await blobbContract.uploadSVG(SVGChunksInBytes)
  const receipt = await chunksTX.wait(1)
  console.log("The receipt: ", receipt.cumulativeGasUsed, receipt.effectiveGasPrice)

  const enableTX = await blobbContract.setIsContractEnabled(true)
  await enableTX.wait(1)
  console.log("contract is ready to use", await blobbContract.isContractEnabled())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

