function addRotation(product, operand) {
  product = product + operand;
  if (product >= 360) {
    product = product - 360;
  } else if (product < 0) {
    product = product + 360;
  }
  return product;
}

function rotatePool(degrees) {
  console.log(`Rotating the tile pool ${degrees} degrees.`);
  var poolTiles = document.getElementsByClassName('pool-tile');
  poolTiles = Array.from(poolTiles);
  poolTiles.forEach((poolTile) => {
    var rotation = parseInt(poolTile.getAttribute('tile_rotation'));
    rotation = addRotation(rotation, degrees);
    poolTile.setAttribute('tile_rotation', rotation);
    var image = poolTile.getElementsByTagName('img')[0];

    image.setAttribute('style', 'transform: rotate(' + rotation + 'deg)');
  });
}

function isDescendant(parent, child) {
  var node = child.parentNode;
  while (node != null) {
    if (node == parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function onDragStart(event) {
  source = event.currentTarget;
  // Set dataTransfer properties
  event.dataTransfer.setData('text/plain', source.id);
  event.dataTransfer.effectAllowed = 'move';

  //Set the Drag Image
  event.dataTransfer.setDragImage(
    source,
    source.offsetWidth / 2,
    source.offsetHeight / 2
  );

  // When dragging tiles within the grid, set the source to opaque
  if (source.getAttribute('class') == 'grid-tile') {
    source.style.opacity = '0.4';
  }
}

function onDragOver(event) {
  event.preventDefault();
}

function createGridTileFromDragTile(dragTile, gridX, gridY) {
  var newTile = dragTile.cloneNode(true);
  newTile.removeAttribute('style');
  newTile.setAttribute('class', 'grid-tile');
  newTile.setAttribute('id', 'grid_' + gridX + '_' + gridY);
  return newTile;
}

function placeTile(tile, dropzone) {
  dropzone.style.border = '0';
  dropzone.appendChild(newTile);
}

function removeTileIfClass(tile, className) {
  if (tile.getAttribute('class') == className) {
    tile.parentElement.removeAttribute('style');
    tile.remove();
  }
}

function onDrop(event) {
  // Get data transfer properties
  const id = event.dataTransfer.getData('text');
  let dragTile = document.getElementById(id);
  let dropzone = event.target;
  tileGridContainer = document.getElementsByClassName('tile-grid-container')[0];
  tilePool = document.getElementsByClassName('tile-pool')[0];
  if (isDescendant(tileGridContainer, dropzone)) {
    // If not dropped on itself
    if (dropzone.tagName == 'IMG') {
      // Dropping onto an existing tile
      let currentTile = dropzone.parentElement;
      let newDropzone = currentTile.parentElement;
      currentTile.remove();
      dropzone = newDropzone;
    }

    // Clone tile and change class and id
    newTile = createGridTileFromDragTile(
      dragTile,
      dropzone.getAttribute('x'),
      dropzone.getAttribute('y')
    );
    placeTile(newTile, dropzone);

    // Remove old tile if dragged in grid and fix border
    removeTileIfClass(dragTile, 'grid-tile');
  } else {
    removeTileIfClass(dragTile, 'grid-tile');
  }
  //clear data
  event.dataTransfer.clearData();
}

function onDragEnd(event) {
  source = event.currentTarget;
  // clear style if grid tile drag is canceled
  if (source.getAttribute('class') == 'grid-tile') {
    source.removeAttribute('style');
  }
}

function fillBlanks() {
  console.log(`Filling empty squares with blank tiles.`);
  var gridSpaces = document.getElementsByClassName('tile-grid-item');
  gridSpaces = Array.from(gridSpaces);
  gridSpaces.forEach((gridSpace) => {
    if (gridSpace.children.length == 0) {
      // Space is empty, add a blank tile
      let blankPoolTile = document.getElementById('pool_blank_tile');
      newTile = createGridTileFromDragTile(
        blankPoolTile,
        gridSpace.getAttribute('x'),
        gridSpace.getAttribute('y')
      );
      placeTile(newTile, gridSpace);
    }
  });
}

function saveCanvas(canvas) {
  canvas.toBlob(function (blob) {
    saveAs(blob, 'pattern.png');
  });
}

function exportPattern() {
  fillBlanks();
  let patternDiv = document.getElementsByClassName('tile-grid-container')[0];
  html2canvas(patternDiv, {
    allowTaint: true,
    taintTest: false,
    logging: true,
    onrendered: saveCanvas,
  }).then(function (canvas) {
    saveCanvas(canvas);
  });
}
