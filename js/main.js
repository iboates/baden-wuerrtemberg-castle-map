/**
 * Created by isaac on 18/07/17.
 */

$(document).ready(function() {

    /* ===== SIDEBAR ===== */

        $("#menu-toggle").click(function(e) {
            e.preventDefault();
            $("#wrapper").toggleClass("active");
        });

    /* ===== MAP SETUP ===== */

        var map = L.map('map', {
            center: [48.6616, 9.3501],
            zoom: 8,
            minZoom: 8,
            maxBounds: L.latLngBounds(L.latLng(47.092472, 6.526250), L.latLng(50.541055, 11.700045))
        });

    /* ===== ICONS SETUP ===== */

        var castleIconLargeScale = L.icon({
            iconUrl: './icon/castle.png',
            iconSize: [32, 32]
        });

        var ruinsIconLargeScale = L.icon({
            iconUrl: './icon/castle-ruins.png',
            iconSize: [32, 32]
        });

        var castleIconSmallScale = L.icon({
            iconUrl: './icon/castle-sm.png',
            iconSize: [16, 16]
        });

        var ruinsIconSmallScale = L.icon({
            iconUrl: './icon/castle-ruins-sm.png',
            iconSize: [16, 16]
        });

    /* ===== LAYERS SETUP ===== */

        var hikeBikeBasemap = L.tileLayer('http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        var hikeBikeHillshadeBasemap = L.tileLayer('http://{s}.tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png', {
            maxZoom: 15,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        var castleLayerLargeScale = L.geoJSON(bwCastles, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {icon: castleIconLargeScale})
            },
            onEachFeature: function(feature, layer) {
                //layer.bindPopup(feature.properties.name);
                layer.on("click", function(e) {
                    addContentToSidebar(feature, layer);
                });
                layer.bindTooltip(feature.properties.name, {
                    permanent: true,
                    direction: 'bottom',
                    className: 'tooltip',
                    opacity: 0.8
                });
            }
        });

        var ruinsLayerLargeScale = L.geoJSON(bwRuins, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {icon: ruinsIconLargeScale})
            },
            onEachFeature: function(feature, layer) {
                //layer.bindPopup(feature.properties.name);
                layer.on("click", function(e) {
                    addContentToSidebar(feature, layer);
                });
                layer.bindTooltip(feature.properties.name, {
                    permanent: true,
                    direction: 'bottom',
                    className: 'tooltip',
                    opacity: 0.8
                });
            }
        });

        var castleLayerSmallScale = L.geoJSON(bwCastles, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {icon: castleIconSmallScale})
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.name);
                layer.on("click", function(e) {
                    addContentToSidebar(feature, layer);
                });
            }
        }).addTo(map);

        var ruinsLayerSmallScale = L.geoJSON(bwRuins, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {icon: ruinsIconSmallScale})
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.name);
                layer.on("click", function(e) {
                    addContentToSidebar(feature, layer);
                });
            }
        }).addTo(map);
    
    /* ===== LAYER ZOOM CONTROL ===== */

        map.on('zoomend', function () {
            console.log(map.getZoom());
            if (map.getZoom() >= 13) {
                map.removeLayer(castleLayerSmallScale);
                map.addLayer(castleLayerLargeScale);
                map.removeLayer(ruinsLayerSmallScale);
                map.addLayer(ruinsLayerLargeScale);
            }
            if (map.getZoom() < 13)
            {
                map.removeLayer(castleLayerLargeScale);
                map.addLayer(castleLayerSmallScale);
                map.removeLayer(ruinsLayerLargeScale);
                map.addLayer(ruinsLayerSmallScale);
            }
        });

    /* ===== SIDEBAR CONTENT CONTROL ===== */

    function addContentToSidebar(content, layer) {

        var name = content.properties.name;
        var lng = content.geometry.coordinates[0];
        var lat = content.geometry.coordinates[1];

        // Make sure that the large icon is loaded into the sidebar even if a small icon marker is clicked
        var icon = layer._icon.currentSrc.split("/").pop();
        if (icon === "castle-sm.png" || icon === "castle.png") {
            icon = "./icon/castle.png"
        } else if (icon === "castle-ruins-sm.png" || icon === "castle-ruins.png") {
            icon = "./icon/castle-ruins.png"
        }

        // Set up html for bookmark list entry
        htmlContent = '<li class="sidebar-list-item"><h6 class="remove-button">🗙</h6><img src="'+ icon + '" class="sidebar-img"><span class="solo" lat="'
                        + lat
                        + '" lng="'
                        + lng
                        + '">'
                        + name
                        + '</span></li>';

        $(htmlContent).insertBefore( $("#credits-begin") );

    }

    // Centre & zoom map on respective bookmark when clicked
    $("#sidebar-target").on("click", "span", function() {
        var lat = $(this).attr("lat");
        var lng = $(this).attr("lng");
        console.log(lat + ", " + lng);
        map.setView(new L.LatLng(lat, lng), 14);
    })

    // Remove item from bookmarks
    $("#sidebar-target").on("click", "h6", function () {
        var parentElement = $(this).parent();
        parentElement.remove();
    });

});