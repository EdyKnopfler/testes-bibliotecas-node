const MARGIN = 15;
const SPACING = 10;

const TEXT_TOP_MARGIN = MARGIN;
const TEXT_HEIGHT = 15;

const TRIANGLE_COLOR = '#000000';
const TRIANGLE_LEFT_MARGIN = MARGIN;
const TRIANGLE_TOP_MARGIN = TEXT_TOP_MARGIN + TEXT_HEIGHT + 2;
const TRIANGLE_HEIGHT = 10;
const TRIANGLE_WIDTH = 10;

const ROAD_COLOR = '#CCCCCC';
const ROAD_MARGIN_LEFT = TRIANGLE_LEFT_MARGIN + TRIANGLE_WIDTH + SPACING;
const ROAD_MARGIN_RIGHT = MARGIN;
const ROAD_MARGIN_TOP = TEXT_TOP_MARGIN + TEXT_HEIGHT;
const ROAD_HEIGHT = 15;

const MARKER_COLOR = '#000000';

function Sinotico(parentElem, segment_widths) {
    this.draw = SVG().addTo(parentElem).size(parentElem.clientWidth, parentElem.clientHeight);
    this.buses = {};
    this.segment_widths = segment_widths;
    
    let total = segment_widths.reduce((x, y) => x + y);
    this.percentages = segment_widths.map((x) => x / total);
    this.road_width = parentElem.clientWidth - ROAD_MARGIN_LEFT - ROAD_MARGIN_RIGHT;
    
    this.drawTriangle();
    this.drawRoad();
    this.drawMarkers();
}

Sinotico.prototype.drawTriangle = function() {
    let coords = [
        [TRIANGLE_LEFT_MARGIN, TRIANGLE_TOP_MARGIN], 
        [TRIANGLE_LEFT_MARGIN, TRIANGLE_TOP_MARGIN+TRIANGLE_HEIGHT],
        [TRIANGLE_LEFT_MARGIN+TRIANGLE_WIDTH, TRIANGLE_TOP_MARGIN+TRIANGLE_HEIGHT/2],
    ].map((x) => x.toString()).join(' ');
    this.draw.polyline(coords).fill(TRIANGLE_COLOR);
}

Sinotico.prototype.drawRoad = function() {
    this.draw.rect(this.road_width, ROAD_HEIGHT).move(ROAD_MARGIN_LEFT, ROAD_MARGIN_TOP).fill(ROAD_COLOR);
}

Sinotico.prototype.drawMarkers = function() {
    let stroke = {color: MARKER_COLOR, width: 1};
    this.draw.line(ROAD_MARGIN_LEFT, ROAD_MARGIN_TOP, ROAD_MARGIN_LEFT, ROAD_MARGIN_TOP+ROAD_HEIGHT).stroke(stroke);
    
    let x = ROAD_MARGIN_LEFT;
    for (let perc of this.percentages) {
        x += this.road_width * perc;
        this.draw.line(x, ROAD_MARGIN_TOP, x, ROAD_MARGIN_TOP+ROAD_HEIGHT).stroke(stroke);
    }
}

Sinotico.prototype.busesAt = function(new_positions) {

}
