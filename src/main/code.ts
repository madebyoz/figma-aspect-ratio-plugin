let selectedNode: SceneNode;

// Show UI with theme support
figma.showUI(__html__, { 
  width: 400, 
  height: 300,
  themeColors: true // Enable theme colors
});

// Load all pages for documentchange handler in incremental mode
figma.loadAllPagesAsync();

// Notify UI of theme changes
figma.on('documentchange', () => {
  figma.ui.postMessage({ type: 'theme-change' });
});

// Also notify on selection change
figma.on('selectionchange', () => {
  getData();
  figma.ui.postMessage({ type: 'theme-change' });
});

// Initial theme notification
figma.ui.postMessage({ type: 'theme-change' });

const gcd = (a: number, b: number): number => {
  if (!(Number.isInteger(a) && Number.isInteger(b))) {return 1;}
  return b == 0 ? a : gcd(b, a % b);
};

const roundFloat = ( number: number, n: number ) => {
  var _pow = Math.pow( 10 , n );
  return Math.round( number * _pow ) / _pow;
}

const getData = (): void => {
  const node = figma.currentPage.selection[0];
  if (node) {
    const { width, height } = node;
    const denom = gcd(width, height);
    const ratio = `${width / denom} : ${height / denom}`;
    figma.ui.postMessage({ ratio, width: roundFloat(width, 3), height: roundFloat(height, 3) });
  }
  selectedNode = node;
};

function isResizableNode(node: SceneNode): node is
  FrameNode | ComponentNode | InstanceNode | RectangleNode | EllipseNode | PolygonNode | StarNode | VectorNode | TextNode | LineNode | BooleanOperationNode | ComponentSetNode {
  return typeof (node as any).resize === 'function';
}

const resizeNode = (width: number, height: number): void => {
  if (selectedNode === undefined) {
    figma.notify("Select more than one layer!");
    return;
  }
  if (width === 0 || height === 0) {
    figma.notify("Please enter a value!");
    return;
  }
  if (isResizableNode(selectedNode)) {
    selectedNode.resize(roundFloat(width, 3), roundFloat(height, 3));
  } else {
    figma.notify("Selected node cannot be resized!");
  }
};

figma.on("selectionchange", () => {
  getData();
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'apply-aspect-ratio') {
    const selection = figma.currentPage.selection;

    if (selection.length === 0) {
      figma.notify('Please select at least one layer');
      return;
    }

    const targetWidth = msg.width;
    const targetHeight = msg.height;

    if (isNaN(targetWidth) || isNaN(targetHeight) || targetWidth <= 0 || targetHeight <= 0) {
        figma.notify('Please enter valid positive numbers for width and height.');
        return;
    }

    for (const node of selection) {
      if (isResizableNode(node)) {
        // Directly resize to the target dimensions
        (node as any).resize(roundFloat(targetWidth, 3), roundFloat(targetHeight, 3));
      } else {
        // Optionally notify if a selected node isn't resizable, but continue with others
        // figma.notify(`Node "${node.name}" cannot be resized!`);
      }
    }

    figma.notify('Dimensions applied successfully');
  } else if (msg.type === 'resize-ui') {
    figma.ui.resize(msg.width, msg.height);
  }
};

