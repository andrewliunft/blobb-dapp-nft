// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract OnChainSVG is Ownable {
  uint private _chunksNumber;
  mapping(uint => bytes) private _SVGchunks;

  function _getChunksNumber() internal view virtual returns(uint) { return _chunksNumber; }

  function uploadSVGChunk(bytes[] memory _chunks) public virtual onlyOwner {
    for(uint i = 0; i < _chunks.length; i++) { _SVGchunks[i] = _chunks[i]; }
    _chunksNumber = _chunks.length;
  }
  
  function updateSVGChunk(uint _nChunk, bytes memory _chunkSVG) public virtual onlyOwner {
    _SVGchunks[_nChunk] = _chunkSVG;
  }

  function _getSVGChunk(uint _chunkIDX) internal view virtual returns(bytes memory) {
    return _SVGchunks[_chunkIDX];
  }

  function substring(string memory str, uint beginIDX, uint endIDX) internal pure returns(string memory) {
    bytes memory strBytes = bytes(str);
    bytes memory result = new bytes(endIDX-beginIDX);
    for(uint i = beginIDX; i < endIDX; i++) {
      result[i-beginIDX] = strBytes[i];
    }
    return string(result);
  }
}