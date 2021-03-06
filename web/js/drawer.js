function Drawer(data) {

    //todo выбор направления взгляда

    //todo test
    data = {
        xSize: 100,
        ySize: 50,
        tiles: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
        units: [
            {id: 1, x: 2, y: 3, type: '1', speed: 4},
            {id: 2, x: 4, y: 3, type: '2', speed: 4},
            {id: 3, x: 6, y: 3, type: '3', speed: 4},
            {id: 4, x: 8, y: 3, type: '4', speed: 4}
        ],
        vision: [
            {x: 1, y: 2},
            {x: 2, y: 2},
            {x: 3, y: 2},
            {x: 1, y: 3},
            {x: 2, y: 3},
            {x: 3, y: 3},
            {x: 1, y: 4},
            {x: 2, y: 4},
            {x: 3, y: 4}
        ],
        tilesize: 30
    };

    var
        ScreenPos = {x: 0, y: 0},
        $canvas = jQuery('#canvas'),
        context = document.getElementById('canvas').getContext('2d'),
        xSize = data.xSize,
        ySize = data.ySize,
        tiles = data.tiles,
        vision = data.vision,
        tilesize = data.tilesize,
        units = data.units,
        orders = [],
        looks = [],
        selectedUnit = false,
        w = window.innerWidth,
        h = window.innerHeight,
        move = false,
        moveStart = {x: 0, y: 0},
        moveScreenStart = {x: 0, y: 0},
        endvar;

    context.canvas.width = w;
    context.canvas.height = h;


    /** public methods */
    this.getOrders = function () {
        return orders;
    };

    this.getLooks = function () {
        return looks;
    };

    this.redraw = function () {
        redraw();
    };





    /** private methods */

    init();
    function init() {
        redraw();
    };

    function redraw() {
        //debug
        // var time = performance.now();

        w = window.innerWidth;
        h = window.innerHeight;

        context.canvas.width = w;
        context.canvas.height = h;

        context.fillStyle = "#000000";
        context.fillRect(0, 0, w, h);

        drawAllTiles();
        drawVision();
        drawAllLooks();
        drawAllOrders();
        drawAllUnits();
        drawSelectedUnit();

        //debug
        // time = performance.now() - time;
        // console.log('Время выполнения = ', time);
    }

    function drawAllTiles() {
        var xMin = -Math.floor(ScreenPos.x / tilesize),
            yMin = -Math.floor(ScreenPos.y / tilesize),
            xMax = (w - Math.floor(ScreenPos.x)) / tilesize + 1,
            yMax = (h - Math.floor(ScreenPos.y)) / tilesize + 1;

        for (var x = xMin; x <= xMax; x++) {
            for (var y = yMin; y <= yMax; y++) {
                drawTile(x, y);
            }
        }
    }

    function drawVision() {
        vision.forEach(function (v) {
            context.fillStyle = 'rgba(200, 200, 200, 0.4)';
            context.fillRect(v.x * tilesize + 1 + Math.floor(ScreenPos.x), v.y * tilesize + 1 + Math.floor(ScreenPos.y), tilesize - 1, tilesize - 1);
        });
    }

    function drawAllLooks() {
        looks.forEach(function (look) {
            context.beginPath();
            context.arc(look.unit_new_x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), look.unit_new_y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y), tilesize / 2 - 10, 0, 2 * Math.PI, false);
            context.fillStyle = 'blue';
            context.fill();

            context.beginPath();
            context.moveTo(look.unit_x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), look.unit_y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y));
            context.lineTo(look.unit_new_x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), look.unit_new_y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y));
            context.strokeStyle = 'blue';
            context.stroke();
        });
    }

    function drawAllOrders() {
        orders.forEach(function (order) {
            context.lineWidth = 4;
            context.beginPath();
            context.arc(order.unit_x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), order.unit_y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y), tilesize / 2 - 2, 0, 2 * Math.PI, false);
            context.strokeStyle = 'green';
            context.stroke();

            context.lineWidth = 2;
            context.beginPath();
            context.arc(order.unit_new_x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), order.unit_new_y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y), tilesize / 2 - 10, 0, 2 * Math.PI, false);
            context.fillStyle = 'green';
            context.fill();

            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(order.unit_x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), order.unit_y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y));
            context.lineTo(order.unit_new_x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), order.unit_new_y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y));
            context.strokeStyle = 'green';
            context.stroke();
        });
    }

    function drawSelectedUnit() {
        if (selectedUnit !== false) {
            context.lineWidth = 2;
            context.beginPath();
            context.arc(selectedUnit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), selectedUnit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y), tilesize / 2 - 2, 0, 2 * Math.PI, false);
            context.strokeStyle = 'red';
            context.stroke();
            context.lineWidth = 1;

            //draw posible move
            var speed = selectedUnit.speed;
            for (var x = selectedUnit.x - speed; x <= selectedUnit.x + speed; x++) {
                for (var y = selectedUnit.y - speed; y <= selectedUnit.y + speed; y++) {
                    if (isCanMove(selectedUnit, x, y)) {
                        context.beginPath();
                        context.arc(x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y), tilesize / 2 - 2, 0, 2 * Math.PI, false);
                        context.fillStyle = 'rgba(200, 200, 200, 0.5)';
                        context.fill();
                    }
                }
            }
        }
    }

    function drawAllUnits() {
        units.forEach(function (unit) {
            drawUnit(unit);
        });
    }

    function drawUnit(unit) {
        var color = 'red';

        color = 'blue';
        context.beginPath();
        context.arc(unit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), unit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y), tilesize / 2 - 2, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();
        context.strokeStyle = 'white';
        switch (unit.type) {
            case '1'://стрелок
                context.beginPath();
                context.moveTo(unit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x) - 6, unit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y) - 6);
                context.lineTo(unit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), unit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y) + 6);
                context.lineTo(unit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x) + 6, unit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y) - 6);
                context.stroke();
                break;
            case '2'://снайпер
                context.beginPath();
                context.moveTo(unit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x) - 10, unit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y));
                context.lineTo(unit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x) + 10, unit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y));
                context.stroke();

                context.beginPath();
                context.moveTo(unit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), unit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y) + 10);
                context.lineTo(unit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), unit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y) - 10);
                context.stroke();

                context.beginPath();
                context.arc(unit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), unit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y), tilesize / 2 - 8, 0, 2 * Math.PI, false);
                context.stroke();
                break;
            case '3'://шнырь
                context.beginPath();
                context.arc(unit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), unit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y), 4, 0, 2 * Math.PI, false);
                context.stroke();
                context.fillStyle = 'white';
                context.fill();
                break;
            case '4'://пулеметчик
                context.beginPath();
                context.moveTo(unit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x) - 8, unit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y) + 6);
                context.lineTo(unit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x) + 8, unit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y) + 6);
                context.stroke();

                context.beginPath();
                context.moveTo(unit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), unit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y) + 6);
                context.lineTo(unit.x * tilesize + tilesize / 2 + Math.floor(ScreenPos.x), unit.y * tilesize + tilesize / 2 + Math.floor(ScreenPos.y) - 9);
                context.stroke();
                break;
            default:
                break;
        }

    }

    function drawTile(x, y) {
        var draw = true;

        switch (getTile(x, y)) {
            case '1':
                context.fillStyle = "#008800";
                break;
            case '2':
                context.fillStyle = "#008800";
                break;
            case '3':
                context.fillStyle = "#007700";
                break;
            default:
                context.fillStyle = "#222222";
        }
        if (draw) {
            context.fillRect((x - 1) * tilesize + 1 + Math.floor(ScreenPos.x), (y - 1) * tilesize + 1 + Math.floor(ScreenPos.y), tilesize - 1, tilesize - 1);
        }
    }

    function getTile(x, y) {
        var char = tiles.charAt((x - 1) * xSize + y - 1);
        return (char === '') ? ' ' : char;
    }

    function getUnit(x, y) {
        var u = false;
        units.forEach(function (unit) {
            if (unit.x == x && unit.y == y) {
                u = unit;
            }
        });
        return u;
    }

    function setLook(unit, x, y) {

        var consilienceLookId = false,
            newLook = {
                unit_id: unit.id,
                unit_x: unit.x,
                unit_y: unit.y,
                unit_new_x: x,
                unit_new_y: y
            };

        looks.forEach(function (look, index) {
            if (look.unit_id == unit.id) {
                consilienceLookId = index;
            }
        });

        if (consilienceLookId === false) {
            looks.push(newLook);
        } else {
            looks[consilienceLookId] = newLook;
        }

        return true;
    }

    function setOrder(unit, x, y) {
        //check distance
        if (!isCanMove(unit, x, y)){
            return false;
        }

        var consilienceOrderId = false,
            newOrder = {
                unit_id: unit.id,
                unit_x: unit.x,
                unit_y: unit.y,
                unit_new_x: x,
                unit_new_y: y
            };

        orders.forEach(function (order, index) {
            if (order.unit_id == unit.id) {
                consilienceOrderId = index;
            }
        });

        if (consilienceOrderId === false) {
            orders.push(newOrder);
        } else {
            orders[consilienceOrderId] = newOrder;
        }

        return true;
    }

    function isCanMove(u, x, y) {
        if (getDistance(u.x, u.y, x, y) > u.speed)
            return false;
        if (u.x == x && u.y == y)
            return false;

        return true;
    }

    function getDistance(x1, y1, x2, y2) {
        return Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
    }


    /** jQuery functions */
    jQuery(window).resize(function () {
        redraw();
    });

    $canvas.contextmenu(function () {
        event.preventDefault();
    });

    $canvas.mousedown(function (e) {
        //right mouse button
        if (e.which == '3') {
            move = true;
            moveStart.x = e.offsetX;
            moveStart.y = e.offsetY;
            moveScreenStart.x = ScreenPos.x;
            moveScreenStart.y = ScreenPos.y;
        }
    });

    $canvas.mouseup(function (e) {
        if (e.which == '3') {
            move = false;
        }
    });

    $canvas.mouseout(function () {
        move = false;
    });

    $canvas.mousemove(function (e) {
        if (move) {
            var deltaX = e.offsetX - moveStart.x,
                deltaY = e.offsetY - moveStart.y;

            ScreenPos.x = moveScreenStart.x + deltaX;
            ScreenPos.y = moveScreenStart.y + deltaY;

            redraw();
        }
    });

    $canvas.click(function (e) {
        var x = Math.floor((e.offsetX - ScreenPos.x) / tilesize),
            y = Math.floor((e.offsetY - ScreenPos.y) / tilesize),
            u = getUnit(x, y);

        if (u === selectedUnit && selectedUnit !== false) {
            selectedUnit = false;
        } else if (u === false && selectedUnit !== false) {
            if (e.ctrlKey) {
                if (setLook(selectedUnit, x, y)) {
                    selectedUnit = false;
                }
            } else if (setOrder(selectedUnit, x, y)) {
                selectedUnit = false;
            }
        } else {
            selectedUnit = u;
        }
        redraw();
    });

    $canvas.mousemove(function (e) {
        if (e.ctrlKey) {
            if (selectedUnit !== false)
                $canvas.addClass('ctrl');
        } else {
            $canvas.removeClass('ctrl');
        }
    });
}
