// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library SVGChunksTool {

  struct SVGChunks {
    uint totalChunks;
    mapping(uint => bytes) chunks;
  }

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

  // uint private _chunksNumber;
  // mapping(uint => bytes) private _SVGchunks;

  // function _getChunksNumber() internal view virtual returns(uint) { return _chunksNumber; }

  // function uploadSVGChunk(bytes[] memory _chunks) public virtual onlyOwner {
  //   for(uint i = 0; i < _chunks.length; i++) { _SVGchunks[i] = _chunks[i]; }
  //   _chunksNumber = _chunks.length;
  // }
  
  // function updateSVGChunk(uint _nChunk, bytes memory _chunkSVG) public virtual onlyOwner {
  //   _SVGchunks[_nChunk] = _chunkSVG;
  // }

  // function _getSVGChunk(uint _chunkIDX) internal view virtual returns(bytes memory) {
  //   return _SVGchunks[_chunkIDX];
  // }

  function substring(string memory str, uint beginIDX, uint endIDX) internal pure returns(string memory) {
    bytes memory strBytes = bytes(str);
    bytes memory result = new bytes(endIDX-beginIDX);
    for(uint i = beginIDX; i < endIDX; i++) {
      result[i-beginIDX] = strBytes[i];
    }
    return string(result);
  }
}