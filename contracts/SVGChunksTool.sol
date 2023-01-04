// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library SVGChunksTool {
  //STRUCT TO STORE THE SVG CHUNKS
  struct SVGChunks {
    uint totalChunks;
    mapping(uint => bytes) chunks;
  }
  //STRUCT TO STORE THE SVG VALUES TO INSERT BETWEEN CHUNKS
  // struct SVGValues {
  //   bytes[] values;
  // }

  //SVG CHUNKS SECTION
  function getTotalChunksNumber(SVGChunks storage _svgChunks) internal view returns(uint) {
    return _svgChunks.totalChunks;
  }

  function uploadSVG(SVGChunks storage _svgChunks, bytes[] memory _chunks) internal {
    for(uint i = 0; i < _chunks.length; i++) {
      _svgChunks.chunks[i] = _chunks[i];
    }
    _svgChunks.totalChunks = _chunks.length;
  }

  function updateSVGChunk(SVGChunks storage _svgChunks, uint _chunkIDX, bytes memory _chunk) internal {
    _svgChunks.chunks[_chunkIDX] = _chunk;
  }

  function getSVGChunk(SVGChunks storage _svgChunks, uint _chunkIDX) internal view returns(bytes memory) {
    return _svgChunks.chunks[_chunkIDX];
  }

  //SVG VALUES SECTION
  // function defaultSVGValue(SVGValues storage _svgValues) internal {

  // }

  // function getSVGValue(SVGValues storage _svgValues, uint _valueIDX) internal view returns(bytes memory) {
  //   return _svgValues.values[_valueIDX];
  // }

  //UTILS
  function substring(string memory str, uint beginIDX, uint endIDX) internal pure returns(string memory) {
    bytes memory strBytes = bytes(str);
    bytes memory result = new bytes(endIDX-beginIDX);
    for(uint i = beginIDX; i < endIDX; i++) {
      result[i-beginIDX] = strBytes[i];
    }
    
    return string(result);
  }
  
}