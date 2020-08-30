// create lazy functions

var math = Math;
var dqsa = query => document.querySelectorAll(query);
var rand16 = () => math.floor(math.random() * 16);
var setBackground = (x, y, color) => dqsa(`div grid[loc="${x}-${y}"]`)[0].style.backgroundColor = color;
var setBtnEvent = (idx, tag, code) => allBtns[idx].addEventListener(tag, ()=>{dir=dirs[code]}, false);
var setBtnClick = (idx, code) => setBtnEvent(idx, 'mousedown', code) || setBtnEvent(idx, 'touchstart', code); // Don't optimize

// init variable and calculate size

var cellSize = parseInt(math.min(innerWidth - 70, 800, innerHeight - 285) / 16);
var boxSize = cellSize * 16 + 1; // max: 800, min: depends on the browser width & height
var box = dqsa('div')[0];
var allBtns = dqsa('p');
var dirs  = {
    38: [0,-1],
    37: [-1,0], 
    39: [1,0], 
    40: [0,1]
}; // up, left, right, down
var snake = [[8,8]], apple = [4,4], dir = [0,0]; // d for dir

// create grid and config box size

var send = ''; // Don't optimize
for (i = 0; i < 16;i++)
    for (j = 0; j < 16;)
        send += `<grid loc="${j++}-${i}"></grid>`;
box.innerHTML = send;
box.style.width = box.style.height = boxSize + 'px'; // Don't optimize

var cells = dqsa('div *');
cells.forEach(x => x.style.width = x.style.height = cellSize + 'px');

// event listener

onkeydown = e => dir = dirs[e.keyCode] || dir;

setBtnClick(0, 38);
setBtnClick(1, 37);
setBtnClick(2, 39);
setBtnClick(3, 40);

setInterval(() => {
    snake.unshift([ snake[0][0] + dir[0] + 16 & 15 ,
                    snake[0][1] + dir[1] + 16 & 15 ]);
    if('' + snake[0] == apple)
        do apple = [ rand16(), rand16() ];
        while(snake.some(seg => '' + seg == apple));
    else if(snake.slice(1).some(seg => '' + seg == snake[0]))
        snake.splice(1);
    else
        snake.pop();
    cells.forEach(s => s.style.backgroundColor = '');
    setBackground(apple[0], apple[1], 'red');
    snake.forEach(([x,y]) => setBackground(x, y, 'green'));
}, 135);