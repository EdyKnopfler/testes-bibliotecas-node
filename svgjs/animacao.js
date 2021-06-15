function animar(parentElem) {
    var draw = SVG().addTo(parentElem).size(parentElem.clientWidth, parentElem.clientHeight);
    var rect1 = draw.rect(10, 20).move(0, 0).fill('#CC0000');
    var rect2 = draw.rect(10, 20).move(0, 30).fill('orange');
    rect1.animate(10000, 0, 'now').move(300, 0);
    rect2.animate(5000, 0, 'now').move(300, 30);
    setTimeout(function() {
        rect2.animate(5000, 0, 'now').move(400, 30);
    }, 2000);
}
