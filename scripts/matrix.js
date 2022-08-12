function createMatrix(rowAmount, colAmount) {
  let m = []
  for (let i = -2; i < rowAmount; i++) {
    let row = []
    for (let j = 0; j < colAmount; j++) {
      row.push(0)
    }
    m.push(row)
  }
  return m
}

function deepCopy(m) {
  let result = []
  for (let i of [...m]) {
    result.push([...i])
  }
  return result
}

function rotateMatrix(mat) {
  let newWidth = mat.length;
  let newHeight = mat[0].length;
  let rotated = new Array(newHeight).fill().map(() => (new Array(newWidth)).fill(0));
  for (let i = 0; i < newHeight; i++) {
    for (let j = 0; j < newWidth; j++) {
      rotated[i][newWidth - 1 - j] = mat[j][i];
    }
  }
  return rotated;
}

export { createMatrix, deepCopy, rotateMatrix }