var map = L.map('map', {
    center: [22.38503, 114.14374], 
    zoom: 12,
    zoomControl: false
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var myIcon = L.icon({
    iconUrl: "resources/images/branches.png",
    iconSize: [35, 35]
})


function showPopup(feature, layer){
    layer.bindPopup(makePopupcontent(feature), {closeButton: false, offset: L.point(0, -8)});
}

function makePopupcontent(branch) {
    return `
        <div>
            <h4>${branch.properties.name}</h4>
            <p>${branch.properties.address}</p>
            <div class="phone-number">
                <a href="tel:${branch.properties.phone}">${branch.properties.phone}</a>
            </div>
        </div>
    `;
}

var branchLayer = L.geoJSON(branchList, {
    onEachFeature: showPopup,
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {icon: myIcon});
    }
});

branchLayer.addTo(map);

const ul = document.querySelector('.list');

function populateBranch() {
    var arrDvision = [];
    $.each(branchList.features, function(key, value) {
        if (arrDvision.indexOf(value.properties.division)==-1) {
            arrDvision.push(value.properties.division);
        }
    })
    $.each(arrDvision, function(index, value) {
        const division = document.createElement("li");
        division.classList.add('division');
        division.innerText = value;
        ul.appendChild(division);
        populateDvisionBranch(value);
    })
}

function populateDvisionBranch(name) {
    branchList.features.forEach((branch) => {
        if (branch.properties.division == name) {
            const li = document.createElement('li');
            const div = document.createElement('div');
            const a = document.createElement('a');
            const p = document.createElement('p');
            a.addEventListener('click', () => {
                flyToStore(branch);
            })
    
            div.classList.add('branch-item');
            a.innerText = branch.properties.name;
            a.href = '#';
            p.innerText = branch.properties.address;
    
            div.appendChild(a);
            div.appendChild(p);
            li.appendChild(div);
            ul.appendChild(li);
        }
    });
}

populateBranch();

function flyToStore(branch) {
    const lat = branch.geometry.coordinates[1];
    const lng = branch.geometry.coordinates[0];
    map.flyTo([lat, lng], 18, {
        duration: 3
    });
    setTimeout(() => {
        L.popup({closeButton: false, offset: L.point(0, -8)})
            .setLatLng([lat, lng])
            .setContent(makePopupcontent(branch))
            .openOn(map);
    }, 3000);
}