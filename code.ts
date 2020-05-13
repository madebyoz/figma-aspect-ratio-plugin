let selectedNode;

figma.showUI(__html__, { width: 320, height: 280 });

const gcd = (a: number, b: number): number => {
  return b == 0 ? a : gcd(b, a % b);
};

const getData = (): void => {
  const node = figma.currentPage.selection[0];
  if (node) {
    const { width, height } = node;
    const denom = gcd(width, height);
    const ratio = `${width / denom} : ${height / denom}`;
    figma.ui.postMessage({ ratio, width, height });
  }
  selectedNode = node;
};

const setData = (width, height): void => {
  selectedNode.resize(width, height);
};

figma.on("selectionchange", () => {
  getData();
});

figma.ui.onmessage = msg => {
  console.log(msg);
  if (msg.type === "resize") {
    setData(msg.width, msg.height);
  }
};
