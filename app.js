const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

	// build leaflet map
	buildMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 12,
		});

		// add openstreetmap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(this.map)

		// create and add geolocation marker
		const marker = L.marker(this.coordinates)
		marker
		.addTo(this.map)
		.bindPopup('<p1><b>You are here</b><br></p1>')
		.openPopup()
	},
	addMarkers() {
		for (var i = 0; i < this.businesses.length; i++) {
		this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		])
			.bindPopup(`<p1>${this.businesses[i].name}</p1>`)
			.addTo(this.map)
		}
	},
}

async function getLocation(){
    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options = {enableHighAccuracy:true})
    });
    return [pos.coords.latitude, pos.coords.longitude]
}

async function getFourSquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3l/clhpWoJvTqW99hPhTmOdOk61Bp7whkSRKmh4f/hv0='
		}
	};
	
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	console.log(lat)
	console.log(lon)
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=5&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let pData = JSON.parse(data)
	let busList = pData.results
	return busList

}

function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}

window.onload = async () => {
	let coords = await getLocation()
    myMap.coordinates = coords
	myMap.buildMap()
	
	
	document.getElementById( 'submit').addEventListener('click', async (event) => {
	event. preventDefault()
	let business = document.getElementById('business').value
	let data = await getFourSquare(business)
	console. log(data)
	myMap. businesses = processBusinesses (data)
	myMap.addMarkers()
	})
}