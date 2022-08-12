import { tetrisPieces } from './tetrisPieces.js'
import { createMatrix, deepCopy, rotateMatrix } from './matrix.js'

let field = document.querySelector('.field')
let bestField = document.querySelector('.best')
let scoreField = document.querySelector('.score')

let matrix = []
let playField = []

let shapes = ['T', 'S', 'O', 'Z', 'I', 'L', 'J']

let rowAmount = 18
let colAmount = 12

let score = 0
let currentRow = 0
let currentCol = 4
let currentShape
let currentRotate = 0
let cellElements
let playing = true

matrix = createMatrix(rowAmount, colAmount)
playField = createMatrix(rowAmount, colAmount)

drawFieldStart()
game()

bestField.innerHTML = localStorage.getItem('best_t3') ?? 0

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawFieldStart() {
    field.innerHTML = ''
    for (let row = 0; row < rowAmount; row++) {
        let rowElement = document.createElement('tr')
        for (let col = 0; col < colAmount; col++) {
            let cellElement = document.createElement('td')
            cellElement.classList.add('cell')
            if (matrix[row + 2][col] && !playField[row + 2][col]) {
                cellElement.classList.remove('cell')
                cellElement.classList.add('filled_cell', matrix[row + 2][col])
                cellElement.innerHTML = tetrisPics[matrix[row + 2][col]]
            }
            rowElement.appendChild(cellElement)
        }
        field.appendChild(rowElement)
    }
    cellElements = document.querySelectorAll('td')
}

function drawField() {
    for (let row = 0; row < rowAmount; row++) {
        for (let col = 0; col < colAmount; col++) {
            let cellElement = cellElements[row * colAmount + col]
            if (matrix[row + 2][col]) {
                cellElement.classList.remove('cell')
                cellElement.className = 'filled_cell ' + matrix[row + 2][col]
            } else {
                cellElement.className = 'cell'
            }
        }
    }
}

function generatePiece() {
    if (!playing) return
    currentRow = 0
    currentCol = 4
    currentRotate = 0

    currentShape = shapes[randInt(1, 7) - 1]

    drawPiece(currentShape, currentRow, currentCol, matrix, 0)
}

function drawPiece(shape, row, col, field, currentRotate) {
    let piece = tetrisPieces[shape]
    for (let k = 0; k < currentRotate; k++) {
        piece = rotateMatrix(piece)
    }
    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[0].length; j++) {
            if (piece[i][j]) { field[row + i][col + j] = shape }
        }
    }
}

function isValidMove(shape, row, col, rotateAmount) {
    let piece = tetrisPieces[shape]
    for (let k = 0; k < rotateAmount; k++) {
        piece = rotateMatrix(piece)
    }
    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[0].length; j++) {
            if (piece[i][j] && (row + i >= rowAmount + 2 || playField[row + i][col + j] !== 0)) {
                return false
            }
        }
    }
    return true
}

function deleteComplited() {
    for (let row = playField.length - 1; row >= 0;) {
        if (playField[row].every(cell => !!cell)) {
            for (let r = row; r > 0; r--) {
                for (let c = 0; c < playField[r].length; c++) {
                    playField[r][c] = playField[r - 1][c];
                }
            }
            score += 1
            scoreField.innerHTML = Number(scoreField.innerHTML) + 5 + (score - 1) * 5
        }
        else {
            row--;
        }
    }
    matrix = deepCopy(playField)
}

function fall() {
    if (!playing) return
    if (isValidMove(currentShape, currentRow + 1, currentCol, currentRotate)) {
        matrix = deepCopy(playField)
        drawPiece(currentShape, currentRow + 1, currentCol, matrix, currentRotate)
        currentRow += 1
    } else {
        if (currentRow <= 2) {
            gameOver()
            return
        }
        drawPiece(currentShape, currentRow, currentCol, playField, currentRotate)
        deleteComplited()
        generatePiece()
    }
}

function left() {
    if (isValidMove(currentShape, currentRow, currentCol - 1, currentRotate)) {
        matrix = deepCopy(playField)
        drawPiece(currentShape, currentRow, currentCol - 1, matrix, currentRotate)
        currentCol -= 1
    }
}

function right() {
    if (isValidMove(currentShape, currentRow, currentCol + 1, currentRotate)) {
        matrix = deepCopy(playField)
        drawPiece(currentShape, currentRow, currentCol + 1, matrix, currentRotate)
        currentCol += 1
    }
}

function rotate() {
    if (!playing) return
    if (isValidMove(currentShape, currentRow, currentCol, currentRotate + 1)) {
        matrix = deepCopy(playField)
        drawPiece(currentShape, currentRow, currentCol, matrix, currentRotate + 1)
        currentRotate += 1
    }
}

function gameOver() {
    if (!playing) { return }

    if (Number(bestField.innerHTML) < Number(scoreField.innerHTML)) {
        bestField.innerHTML = Number(scoreField.innerHTML)
        localStorage.setItem('best_t3', Number(scoreField.innerHTML))
    }

    scoreField.innerHTML = 0

    playing = false
    matrix = createMatrix(rowAmount, colAmount)
    playField = createMatrix(rowAmount, colAmount)
    currentRow = 0
    currentCol = 4
    currentRotate = 0
    score = 0
    drawField()

    setTimeout(() => {
        game()
    }, 2000);
}

function game() {
    playing = true
    generatePiece()
    let gameInterval = setInterval(() => {
        if (!playing) {
            clearInterval(gameInterval)
            gameOver()
        } else {
            fall()
            drawField()
        }
    }, 500);
}

document.querySelector('.arrow.Up').onclick = () => {
    rotate()
    drawField()
}

document.querySelector('.arrow.Down').onclick = () => {
    fall()
    drawField()
}

document.querySelector('.arrow.Left').onclick = () => {
    left()
    drawField()
}

document.querySelector('.arrow.Right').onclick = () => {
    right()
    drawField()
}

document.querySelector('.wrapper').classList.remove('hidden')

