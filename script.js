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

function onDrop(event) {
  // Get data transfer properties
  const id = event.dataTransfer.getData('text');
  const tile = document.getElementById(id);
  let dropzone = event.target;
  tileGridContainer = document.getElementsByClassName('tile-grid-container')[0];
  if (isDescendant(tileGridContainer, dropzone)) {
    // If not dropped on itself
    if (dropzone.tagName != 'IMG') {
      // Clone tile and change class and id
      var newTile = tile.cloneNode(true);
      newTile.removeAttribute('style');
      newTile.setAttribute('class', 'grid-tile');
      newTile.setAttribute(
        'id',
        'grid_' + dropzone.getAttribute('x') + '_' + dropzone.getAttribute('y')
      ); // set to grid space

      // Insert tile
      dropzone.style.border = '0';
      dropzone.appendChild(newTile);

      // Remove old tile if dragged in grid and fix border
      if (tile.getAttribute('class') == 'grid-tile') {
        tile.parentElement.removeAttribute('style');
        tile.remove();
      }
    } else {
      // Return opacity to 100%
      tile.removeAttribute('style');
    }
  } else {
    // Remove dragged out tiles
    tile.parentElement.removeAttribute('style');
    tile.remove();
  }
  //clear data
  event.dataTransfer.clearData();
}

// reset
// save/export/share? -- replace not full tiles with blanks?
// set cursor when hovering over grid and not grid
