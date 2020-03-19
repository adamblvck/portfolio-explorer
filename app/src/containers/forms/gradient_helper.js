const white = 'rgba(247,247,247,1)';
const dark = 'rgb(60,60,60,1)';

const gradients = [
	{ value: 'linear-gradient(45deg, #fc466b, #FFA447)', name: 'Sweet Peach', textColor: white, headerColor: '#fc466b'},
	{ value: 'linear-gradient(45deg, #e65c00, #f9d423)', name: 'Savana Dawn', textColor: white, headerColor: '#e65c00'},
	{ value: 'linear-gradient(45deg, #283048, #859398)', name: 'Blackboard Chalk', textColor: white, headerColor: '#283048'},
	{ value: 'linear-gradient(45deg, #6666ff, #B32AFF)', name: 'Voilet Satin', textColor: white, headerColor: '#6666ff'},
	{ value: 'linear-gradient(45deg, #4532E6, #1cb5e0)', name: 'Blue Wave', textColor: white, headerColor: '#4532E6'},
	{ value: 'linear-gradient(45deg, #2bc0e4, #eaecc6)', name: 'Shallow Beach', textColor: dark, headerColor: '#2bc0e4'},

	{ value: 'linear-gradient(45deg, #FC466B 0%, #3F5EFB 100%)', name: 'Red To Voilet', textColor: white, headerColor: '#FC466B'},
	{ value: 'linear-gradient(45deg, #1CB5E0 0%, #000851 100%)', name: 'Living Ocean', textColor: white, headerColor: '#1CB5E0'},
	{ value: 'linear-gradient(45deg, #3F2B96 0%, #A8C0FF 100%)', name: 'Trusty Approach', textColor: white, headerColor: '#3F2B96'},
	{ value: 'linear-gradient(45deg, #4b6cb7 0%, #182848 100%)', name: 'Black Sea Residu', textColor: white, headerColor: '#4b6cb7'},
	{ value: 'linear-gradient(45deg, #0700b8 0%, #00ff88 100%)', name: 'Overused Bolt', textColor: white, headerColor: '#0700b8'},
	{ value: 'linear-gradient(45deg, #fcff9e 0%, #c67700 100%)', name: 'Sunlit Cinamon', textColor: dark, headerColor: '#fcff9e'},
	{ value: 'linear-gradient(45deg, #9ebd13 0%, #008552 100%)', name: 'Lemon With Avocado', textColor: white, headerColor: '#9ebd13'},
	{ value: 'linear-gradient(45deg, #FDBB2D 0%, #22C1C3 100%)', name: 'Tropical Parrot', textColor: dark, headerColor: '#FDBB2D'},

	{ value: 'linear-gradient(45deg, #FDBB2D 0%, #3A1C71 100%)', name: 'Evening Chills', textColor: white, headerColor: '#FDBB2D'},
	{ value: 'linear-gradient(45deg, #00d2ff 0%, #3a47d5 100%)', name: 'Cool Wound Spray', textColor: dark, headerColor: '#00d2ff'},
	{ value: 'linear-gradient(45deg, #efd5ff 0%, #515ada 100%)', name: 'Lavender Field', textColor: dark, headerColor: '#efd5ff'},
	{ value: 'linear-gradient(90deg, #f8ff00 0%, #3ad59f 100%)', name: 'Sour Lemon Tastes Lime', textColor: dark, headerColor: '#f8ff00'},
	{ value: 'linear-gradient(90deg, #FEE140 0%, #FA709A 100%)', name: 'Sweet Love', textColor: dark, headerColor: '#FEE140'},
];

const getTextColor = (gradient_value) => {
	const grad = _.find(gradients, {value: gradient_value});
	return grad != undefined ? grad.textColor : "white";
};

const getHeaderColor = (gradient_value) => {
	const grad = _.find(gradients, {value: gradient_value});
	return grad != undefined ? grad.headerColor : "black";
};

export {
	gradients,
	getTextColor,
	getHeaderColor
};