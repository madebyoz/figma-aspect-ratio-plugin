let selectedNode: SceneNode;

figma.showUI(__html__, { width: 320, height: 280 });

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

const resizeNode = (width: number, height: number): void => {
  if (selectedNode === undefined) {
    figma.notify("Select more than one layer!");
    return;
  }
  if (width === 0 || height === 0) {
    figma.notify("Please enter a value!");
    return;
  }
  selectedNode.resize(roundFloat(width, 3), roundFloat(height, 3));
};

figma.on("selectionchange", () => {
  getData();
});

figma.ui.onmessage = msg => {
  if (msg.type === "resize") {
    resizeNode(msg.width, msg.height);
  }
};

