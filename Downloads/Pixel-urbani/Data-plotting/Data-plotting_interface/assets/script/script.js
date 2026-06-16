// 	main variables
// ---------------------------------

let archiveID = 4;
let archive = '_output_0' + archiveID;
let folder = 'assets/archive/' + archive + '/'

const totalImages = 260; 
zoom = 5;

let pos_x = 0;
let pos_y = 0;

const margin = 40;
const font_size = 12

let viewMode = 1; 
// 1: grid
// 2: timeline
// 3: scatterplot
// 4: map

const small_label_shift = 2;

let images = [];
let images_a = [];
let images_b = [];
let imageScale = [];
let data = []

let imageIndex = 0;

const IMAGE_SETS = [
  4,
  5,
  6,
  7,
  8,
  9
];


// functions 
// ------------------------------

function preload() {
	data_ = loadJSON( folder + 'metadata.json');
	loadSet(archiveID);
}

function setup() {

	// crete selector
	sel = createSelect();
	sel.position(margin, margin);
  	sel.style('font-size', '14px');

	IMAGE_SETS.forEach(id => {
  		sel.option(`Set ${id}`, id);  // label shown, value used internally
	});

  	sel.changed(() => loadSet(sel.value()));
	
	const width = window.innerWidth;
	const height = window.innerHeight;
	
    createCanvas(width, height);

}

function loadSet(keyDataset) {
	
	loaded = false;
	images = [];
	
	archive = '_output_0' + keyDataset
	folder = 'assets/archive/' + archive + '/'
	
	loadJSON(folder + 'metadata.json', (json) => {
		data = Object.values(json); 

		filtered = data.filter(item => item.sensor_readings !== null);
		
		let pending = filtered.length;

		filtered.forEach((item, i) => { // data

			loadImage(folder + item.image_file, (img) => {

				images[i] = img;             // store when actually loaded
				images[i].id = i;  

				if (--pending === 0) {
					loaded = true;            // all images ready
				}
			},
			(err) => {
    			console.error('failed to load:', folder + item.image_file, err);
    			if (--pending === 0) loaded = true; // still mark done so the sketch doesn't hang
  			}
			);
		})
  	});
}

function draw() {

	background(190);

	if (!loaded) { // while loading the pictures
		fill(100);
		noStroke();
		textAlign(CENTER, CENTER);
		text('Loading…', width / 2, height / 2);
		return;
  	}

	textAlign(LEFT, TOP);

	// define grid parameter
	const grid_columns = Math.floor(Math.sqrt(totalImages));
	const grid_rows = grid_columns;
	let max_image_size = (width - (margin*2)) / (grid_columns * 1.15);

	// key buttons
	fill(100)
	text('Schiaccia i tasti da 1 a 4 per vedere differenti configurazioni delle immagini', margin, height-margin-35)
	fill(0)
	text('1: griglia, 2: timeline, 3: scatterplot, 4: mappa', margin, height-margin-20)

	fill(100)
	text('immagini totali: ' + images.length, width - margin - 120, height-margin-20)

	let hovered_img = null;
	let hovered_data = [];
	let hovered_pos_x = 0;
	let hovered_pos_y = 0;
	let hovered_img_height = 0;
	let label_b = '';

	angleMode(RADIANS);
	noFill();
	stroke('#b9b9b9')

	for (let i = 1; i <= 5; i++) {
		arc(0, height, i*600, i*600, -HALF_PI, 0);
	} 

	fill(0);
	noStroke();

	let img_height = 0;

	// Draw all images
	images.forEach((img, i) => {

		if (images[i]) {
			img_metadata = data[i];
			
			//image size
			img_w = images[i].width;
			img_h = images[i].height;
			ratio = img_w/img_h;
			img_height = grid_columns / ratio;

			// width
			let grid_width = (width - (margin * 2)) / grid_columns;
			img_height = grid_width / ratio;
			
			textSize(font_size);

			img_id = images[i].id

			display_images(viewMode, img_id, images[i], img_metadata, data, img_height, width, height)

			if (
				mouseX > pos_x &&
				mouseX < (pos_x + grid_width) &&
				mouseY > pos_y &&
				mouseY < (pos_y + img_height)
			){
				hovered_img = images[i];
				hovered_pos_x = pos_x;
				hovered_pos_y = pos_y;
				hovered_img_height = img_height;
				hovered_data = img_metadata;
				hovered_label_a = i + '.';
			}
			
			if (hovered_img) {
				noStroke();
				
				let label_c = JSON.stringify(hovered_data, null, 2);
				
				// rect under json
				drawingContext.filter = 'none';
				rect_x = margin + (grid_width * zoom)
				rect_y = margin*2
				rect_w = 360
				rect_h = hovered_img_height * zoom

				fill(255);
				rect (rect_x, rect_y, rect_w, rect_h);
				
				// image id (for debug)
				// textSize(font_size);
				// fill(255)
				// text(hovered_label_a, hovered_pos_x + small_label_shift, hovered_pos_y + (font_size * 1 * 1));
				
				// json
				fill(0)
				text(label_c, rect_x + 10, rect_y + 20);
				
				// image
				image(hovered_img, margin, rect_y, grid_width * zoom, hovered_img_height * zoom);
			}
		}
	}) 
}

function keyPressed() {
	let numberPressed = parseInt(key);

	if (numberPressed === 1) {
		viewMode = 1;
	} 
	else if (numberPressed === 2) {
		viewMode = 2;
	}
	else if (numberPressed === 3) {
		viewMode = 3;
	}
	else if (numberPressed === 4) {
		viewMode = 4;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function display_images(viewMode, index, image_id, img_metadata, data, img_height, canvasW, canvasH){

	const grid_columns = Math.floor(Math.sqrt(totalImages));
	const grid_rows = grid_columns;
	
	if (viewMode == 1) { // grid	
		grid_size_w = (canvasW - (margin*2)) / grid_columns;
		grid_size_h = (canvasH - (margin*2)) / grid_rows;
		pos_x = grid_size_w * (index % grid_columns) + margin;
		pos_y = img_height * Math.floor(index / grid_columns) + (margin * 2); 
	}	
	else if (viewMode == 2) { // timeline
		
		if (img_metadata.sensor_readings != null) {

			let value_x = 0
			try {
				let values_x = data
					.map(entry => entry.timestamp)
					.filter(timestamp => typeof timestamp === 'string')
					.map(timestamp => parseTimecode(timestamp))
					.filter(val => !isNaN(val));
				let min_x = Math.min(...values_x);
				let max_x = Math.max(...values_x);
				
				value_x = parseTimecode(img_metadata.timestamp);
				pos_x = map(value_x, min_x, max_x, (margin*2), windowWidth - (margin * 6) - grid_size_w);
			}
			catch {
				pos_x = margin;
			}

			pos_y = (canvasH / 2 - margin) - (img_height / 2); 
		}
		
	}
	else if (viewMode == 3) { // scatterplot
		
		if (img_metadata.sensor_readings != null) {
	
			let value_x = 0;

			try {

				// time
				let values_x = data
					.map(entry => entry.timestamp)
					.filter(timestamp => typeof timestamp === 'string')
					.map(timestamp => parseTimecode(timestamp))
					.filter(val => !isNaN(val));
				let min_x = Math.min(...values_x);
				let max_x = Math.max(...values_x);
				
				value_x = parseTimecode(img_metadata.timestamp);
				pos_x = map(value_x, min_x, max_x, margin, canvasW - (margin * 2) - grid_size_w);
			}
			catch {
				pos_x = margin;
			}

			let value_y = 0
			let min_y = 0
			let max_y = 0

			let sensor = '' 
			if (archive == '_output_06' || archive == '_output_07'){
				sensor = 'trash'
			}
			else if (archive == '_output_05' || archive == '_output_08'){
				sensor = 'thermal'
			}
			else if (archive == '_output_04' || archive == '_output_09') {
				sensor = 'cigarettes'
			}

			try {

				if (sensor == 'thermal'){

					// pm10
					// ------------------------------
			
					// let values_x = data
					// 	.map(entry => entry.sensor_readings?.pms?.pm10)
					// 	.filter(val => typeof val === 'number' && !isNaN(val));
					// let min_x = Math.min(...values_x);
					// let max_x = Math.max(...values_x);
					
					// value_x = img_metadata.sensor_readings.pms.pm10;
					// pos_x = map(value_x, min_x, max_x, margin, canvasW - (margin * 2) - grid_size_w);

					// termperature
					// ------------------------------
					
					let values_y = data
						.map(entry => entry.sensor_readings?.thermal?.avg_temp)
						.filter(val => typeof val === 'number' && !isNaN(val));
					min_y = Math.min(...values_y);
					max_y = Math.max(...values_y);
					
					value_y = img_metadata.sensor_readings.thermal.avg_temp;
					
				}
				else if (sensor == 'cigarettes'){
					// console.log(sensor)
					
					// cigarettes
					// ------------------------------
					
					let values_y = data
					.map(entry => entry.sensor_readings?.cigarettes_detected)
					.filter(val => typeof val === 'number' && !isNaN(val));
					min_y = Math.min(...values_y);
					max_y = Math.max(...values_y);
					
					value_y = img_metadata.sensor_data.cigarettes_detected;
					console.log(value_y, min_y, max_y)

					
				}
				else if (sensor == 'trash'){
					// console.log(sensor)

					// bin ratio
					// ------------------------------
	
					let values_y = data
						.map(entry => entry.sensor_readings?.sensor_readings?.ratio)
						.filter(val => typeof val === 'number' && !isNaN(val));
					min_y = Math.min(...values_y);
					max_y = Math.max(...values_y);
					
					value_y = img_metadata.sensor_readings.sensor_readings.ratio;
				}

				if (min_y == 0){
					min_y = 0
				}
				if (max_y == 0){
					max_y = 1
				}
				
				pos_y = map(value_y, min_y, max_y, canvasH - (margin * 2) - 110, margin); // margin, height-(margin*2)-50
			}
			catch {
				pos_y = margin;
			}
		}
	}
	else if (viewMode == 4) { // latitude and longitude
		
		if (img_metadata.sensor_readings !== null ) {
			
			try {
				let values_x = data
					.map(entry => entry.sensor_readings?.gps?.latitude)
					.filter(val => typeof val === 'number' && !isNaN(val));
				let min_x = Math.min(...values_x);
				let max_x = Math.max(...values_x);
				
				let value_x = img_metadata.sensor_readings.gps.latitude;
				pos_x = map(value_x, min_x, max_x, canvasH - (margin * 2), margin);		
			}
			catch {
				pos_x = (canvasW/2) - (grid_size_w/2)
			}

			try {
				let values_y = data
					.map(entry => entry.sensor_readings?.gps?.longitude)
					.filter(val => typeof val === 'number' && !isNaN(val));
				let min_y = Math.min(...values_y);
				let max_y = Math.max(...values_y);
				
				let value_y = img_metadata.sensor_readings.gps.longitude;
				pos_y = map(value_y, min_y, max_y, margin, canvasW - (margin * 2));
			}
			catch {
				pos_y = (canvasH/2) - (img_height/2)
			}
		}
	}
	
	image(image_id, pos_x, pos_y, grid_size_w, img_height);
	
}
