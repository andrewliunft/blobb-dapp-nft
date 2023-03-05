// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title SVGChunksTool
 * @author Sawyheart
 * @notice The library where all the SVG chunks are sotred, managed and easily accessible. 
 */
library SVGChunksTool {
  /// @dev Struct to be instantiated in the Blobb.sol contract. It will contain all the SVG chunks informations.
  struct SVGChunks {
    uint totalChunks; // Total SVG chunks counter and index to access the chunks in their correct order. 
    mapping(uint => bytes) chunks; // A Mapping containing the ordered SVG chunks.
  }

  /**
   * @dev Getter of the total SVG chunks number. Useful for iterating over all individual chunks.
   * @param _svgChunks The SVGChunks struct instance in the Blobb.sol contract.
   */
  function getTotalChunksNumber(SVGChunks storage _svgChunks) internal view returns(uint) {
    return _svgChunks.totalChunks;
  }

  /**
   * @dev Function to upload all the SVG chunks at the time of deployment.
   * @param _svgChunks The SVGChunks struct instance in the Blobb.sol contract.
   * @param _chunks All the SVG chunks in an array of bytes.
   */
  function uploadSVG(SVGChunks storage _svgChunks, bytes[] memory _chunks) internal {
    for(uint i = 0; i < _chunks.length; i++) {
      _svgChunks.chunks[i] = _chunks[i];
    }
    _svgChunks.totalChunks = _chunks.length;
  }

  /**
   * @dev Allow the owner to replace a single chunk. To simply update it or to correct some error.
   * @param _svgChunks The SVGChunks struct instance in the Blobb.sol contract.
   * @param _chunkIDX The index of the chunk we want to replace.
   * @param _chunk The new SVG chunk information in bytes that you want to store.
   */
  function updateSVGChunk(SVGChunks storage _svgChunks, uint _chunkIDX, bytes memory _chunk) internal {
    _svgChunks.chunks[_chunkIDX] = _chunk;
  }

  /**
   * @dev Getter of a single chunk informations.
   * @param _svgChunks The SVGChunks struct instance in the Blobb.sol contract.
   * @param _chunkIDX The IDX of the chunk you want to get.
   */
  function getSVGChunk(SVGChunks storage _svgChunks, uint _chunkIDX) internal view returns(bytes memory) {
    return _svgChunks.chunks[_chunkIDX];
  }

  //UTILS

  /**
   * @dev Utility function to trim a string.
   * @param str The full string you want to trim.
   * @param beginIDX The index from which the new string will starts, removing all the previous chars.
   * @param endIDX The index from which the new string will ends, removing all the next chars.
   */
  function substring(string memory str, uint beginIDX, uint endIDX) internal pure returns(string memory) {
    bytes memory strBytes = bytes(str);
    bytes memory result = new bytes(endIDX-beginIDX);
    for(uint i = beginIDX; i < endIDX; i++) {
      result[i-beginIDX] = strBytes[i];
    }
    
    return string(result);
  }
  
}