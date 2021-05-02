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
  // Set dataTransfer properties
  event.dataTransfer.setData('text/plain', event.currentTarget.id);
  event.dataTransfer.effectAllowed = 'move';

  //Set the Drag Image
  source = event.currentTarget;
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

function onDrop(event) {
  // Get data transfer properties
  const id = event.dataTransfer.getData('text');
  const dragTile = document.getElementById(id);
  let dropzone = event.target;
  tileGridContainer = document.getElementsByClassName('tile-grid-container')[0];
  if (isDescendant(tileGridContainer, dropzone)) {
    // If not dropped on itself
    if (dropzone.tagName != 'IMG') {
      // Clone tile and change class and id
      newTile = createGridTileFromDragTile(
        dragTile,
        dropzone.getAttribute('x'),
        dropzone.getAttribute('y')
      );
      placeTile(newTile, dropzone);

      // Remove old tile if dragged in grid and fix border
      if (dragTile.getAttribute('class') == 'grid-tile') {
        dragTile.parentElement.removeAttribute('style');
        dragTile.remove();
      }
    } else {
      // Return opacity to 100%
      dragTile.removeAttribute('style');
    }
  } else {
    // Remove dragged out tiles
    dragTile.parentElement.removeAttribute('style');
    dragTile.remove();
  }
  //clear data
  event.dataTransfer.clearData();
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
  var dataURL = canvas.toDataURL('image/jpeg');
  // canvas.toBlob(function (blob) {
  //   saveAs(blob, 'pattern.png');
  // });
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

// reset - refresh?
// save/export/share? -- replace not full tiles with blanks?
// set cursor when hovering over grid and not grid
// fix bug that allows the pool-tiles to be rrmoved when dropped back in the pool
// fix bug allowing tiles to stay opaque when dragged and dropped outside of the grid/pool/control/title
// disable drag on buttons
// overwrite tiles?
// export html2canvas as js asset
// move imgs to assets
