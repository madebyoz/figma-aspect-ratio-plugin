figma.showUI(__html__, { width: 170, height: 130 });

const gcd = (a: number, b: number): number => {
  return (b == 0) ? a : gcd (b, a%b);
};

const getData = (): void => {
  const node = figma.currentPage.selection[0];
  if (node){
    const { width, height } = node;
    const denom = gcd(width, height);
    const ratio = `${width/denom} / ${height/denom}`;
    figma.ui.postMessage({ ratio, width, height });
  }
};

figma.on('selectionchange', () => {
  getData();
});

getData();
