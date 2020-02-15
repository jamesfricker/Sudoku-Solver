
function populateTable(){
  // begins the process
  // creates a matrix
  // creates event listeners
  var i, j, tr, td, input,
    table = document.querySelector('form#sudoku table'),
    tbody = document.createElement('tbody');
  table.appendChild(tbody);
  for(i=0; i<9; i++)
  {
    tr = document.createElement('tr');
    if(i%3==2){
      tr.className = "sudoku__table-row";
    }
    if(i==0)
    {
      tr.className="sudoku__table-toprow";
    }
    tbody.appendChild(tr);
    for(j=0; j<9; j++)
    {
      td = document.createElement('td');
      tr.appendChild(td);
      td.className = "sudoku__table-cell";

      if(j%3==2)
      {
        td.className+=" sudoku__table-cell-right";
      }
      else if (j==0) {
        td.className += " sudoku__table-cell-left";
      }

    }
  }
  document.querySelector('input[value=Solve]').addEventListener('click',updateMatrix);
  document.querySelector('input[value=Generate-New]').addEventListener('click',generateNums);
  document.querySelector('input[value=Reset]').addEventListener('click',reset);

}

function reset()
{
  // resets the matrix
  var cells = document.getElementById('sudoku').getElementsByTagName('td');
  for(var i=0; i<81; i++)
  {
    cells[i].innerHTML = '';
  }
}

function getRandomInt(max) {
  // generates a random number
  return Math.floor(Math.random() * Math.floor(max));
}

function generateNums()
{
  reset();
  // create a matrix with random values
  // works by creating a solved matrix and swapping rows and columns
  // this creates a valid matrix with unique properties
  // this way we don't generate the same example every time
  var mat = convertToMatrix();

  var matrix = [];
  for(var i=0; i<9; i++) {
    matrix[i] = [];
    for(var j=0; j<9; j++) {
        matrix[i][j] = undefined;
    }
  }

  var count = 0;

  solve(mat);

  // rotate rows
  var c=0,r = [], j = 0;
  while(c<100){
    r1 = getRandomInt(3)+j;
    r2 = getRandomInt(3)+j;
    r = [];
    for(var i=0; i<9; i++)
    {
      r.push(mat[r1][i]);
      mat[r1][i] = mat[r2][i];
      mat[r2][i] = r[i];
    }
    if(c==33)
    {
      j+=3;
    }
    if(c==66){
      j+=3;
    }
    c++;
  }
  // rotate cols
  var c=0,r = [];
  j = 0;
  while(c<100){
    c1 = getRandomInt(3)+j;
    c2 = getRandomInt(3)+j;
    r = [];
    for(var i=0; i<9; i++)
    {
      r.push(mat[i][c1]);
      mat[i][c1] = mat[i][c2];
      mat[i][c2] = r[i];
    }
    if(c==33)
    {
      j+=3;
    }
    if(c==66){
      j+=3;
    }
    c++;
  }

  // select random positions from mat
  var i=0;
  while(i<17){
    r = getRandomInt(9);
    c = getRandomInt(9);
    if(matrix[r][c]!=mat[r][c]){
      i++;
      matrix[r][c] = mat[r][c];
    }
  }
  printMatrix(matrix);
}

function convertToMatrix()
{
  // function gets the input from the html table
  // returns the information as a matrix

  // assume arr has length 81 (9x9)
  var cells = document.getElementById('sudoku').getElementsByTagName('td');

  var matrix,
  holder = [],
  i ,j ,k, z;
  // convert 1d array of form to 2d array matrix
  for(i=0; i<81; i++){
    holder[i] = parseInt(cells[i].innerHTML);

    //console.log(f[i].value);
    matrix = [];
    k = -1;
    for(j=0; j<holder.length; j++){
      if(j%9 === 0){
        k++;
        matrix[k] = [];
      }
      matrix[k].push(holder[j]);
    }
  }
  return matrix;
}

function printMatrix(matrix)
{
  // outputs the matrix back to the table
  z = 0;
  var cells = document.getElementById('sudoku').getElementsByTagName('td');
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[i].length; j++) {
      //display the solved sudoku numbers
      if(matrix[i][j]){
        cells[z].innerHTML = matrix[i][j];
      }
      z++;
    }
  }
  return cells;
}

function checkRow(matrix,r,c,n)
{
  // check to see if n is a valid number for the row
  var i,j;
  for(i = 0; i<9; i++)
  {
    if(i!=c && matrix[r][i] == n){
      return false;
    }
  }
  return true;
}

function checkCol(matrix,r,c,n)
{
  // check to see if n is a valid number for the column
  var i,j;
  for(i = 0; i<9; i++)
  {
    if(i!=r && matrix[i][c] == n){
      return false;
    }
  }
  return true;
}

function checkSquare(matrix,r,c,n)
{
  // check to see if n is a valid number for the square
  var y = Math.floor((r / 3)) * 3,
      x = Math.floor((c / 3)) * 3;
  for(var i =0; i<3; i++)
  {
    for(var j=0; j<3; j++)
    {
      if(i!=r && j!=c && matrix[y+i][x+j]==n){
        return false;
      }
    }
  }
  return true;
}

function checkNum(matrix,r,c,n)
{
  // check to see if n is a valid number
  // includes row, column and square
  if(checkCol(matrix,r,c,n)==true && checkRow(matrix,r,c,n)==true && checkSquare(matrix,r,c,n)==true)
  {
    return true;
  }
  return false;
}

function getNextPos(matrix)
{
  // returns the next empty position in the Matrix
  // if there is none, the sudoku is complete
  for(var i =0; i<9; i++)
  {
    for(var j=0; j<9; j++)
    {
      if(!matrix[i][j] || matrix[i][j]==0)
      {
        return i*9+j;
      }
    }
  }
  return -1;
}

function solve(matrix){
  // function to solve the matrix
  // returns true or false if the matrix was solved
  var pos = getNextPos(matrix);
  if(pos == -1)
  {
    return true;
  }

  var r = Math.floor(pos/9), c = pos%9;

  for(var n = 1; n<10; n++)
  {
    if(checkNum(matrix,r,c,n) == true){
      matrix[r][c] = n;
      //console.log(r,c,n);
      // if we solved it, return true
      if(solve(matrix) == true)
      {
        return true;
      }
      // then we didn't, reset
      matrix[r][c] = 0;
    }
  }
  return false;
}

function updateMatrix(){
  //function to update the matrix to solved version

  // get current matrix info
  var form = document.querySelector('form#sudoku'), matrix;
  matrix = convertToMatrix();
  console.log("Solving.....");
  // solve matrix
  solve(matrix);
  console.log("Solved!");
  // output the solved matrix
  printMatrix(matrix);

}

populateTable();
