maptilersdk.config.apiKey = maptilerApiKey;
const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: snap.geometry.coordinates,
    zoom: 13
});

new maptilersdk.Marker()
    .setLngLat(snap.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${snap.title}</h3><p>${snap.location}</p>`
            )
    )
.addTo(map)
