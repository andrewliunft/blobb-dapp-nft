const fs = require("fs")
const hre = require("hardhat");

const svg = fs.readFileSync("./svgs/blobbOneLine.svg", {encoding: "utf8"})
const SVGChunks = svg.split("|")

const SVGChunksInBytes = SVGChunks.map(chunk => hre.ethers.utils.toUtf8Bytes(chunk))

module.exports = [SVGChunksInBytes]