var Main;

// Assuming you're using a bundler or ES module-compatible environment

import Map from "https://js.arcgis.com/5.1/@arcgis/core/Map.js";
import Graphic from "https://js.arcgis.com/5.1/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/5.1/@arcgis/core/layers/GraphicsLayer.js";
import ElevationLayer from "https://js.arcgis.com/5.1/@arcgis/core/layers/ElevationLayer.js";
import SceneView from "https://js.arcgis.com/5.1/@arcgis/core/views/SceneView.js";
import FeatureLayer from "https://js.arcgis.com/5.1/@arcgis/core/layers/FeatureLayer.js";

Main = (function() {
    const layer = new ElevationLayer({
        url: "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
    });
    const map = new Map({
        basemap: "hybrid",
        ground: {
            layers: [layer]
         },
    });
    
    const view = new SceneView({
    container: "map",
    map: map,
    viewingMode: "global",
    center: [-111.8910, 40.7608],
    zoom: 6,
    popup: {
        dockEnabled: true,
        dockOptions: {
            breakpoint: false
        }
    },
    environment: {
        lighting: {
            directShadowsEnabled: false
        }
    }
});
                
    const initMap = function(){
    document.getElementById("citySearch").addEventListener("change", function() {
    if (this.value) {
        const coords = this.value.split(",").map(Number);

        view.goTo({
            center: coords,
            zoom: 12
        }, {
            duration: 1500
        });
    }
});
        
        
        const graphicsLayer = new GraphicsLayer();               
        
        const features = [];

        for (const [key, value] of Object.entries(myStuff)){                       
            console.log(key, value)
                        
            const point = {                        
                type: "point",                             
                x: value.coord[0],                        
                y: value.coord[1],                            
                z: 10000                          
            };
                                
            const markerSymbol = {
            type: "simple-marker",
            style: "circle",
            color: [0, 51, 102],
            size: 14,
            outline: {
            color: [255, 255, 255],
            width: 2
            }
            };
                                                
            const pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
                popupTemplate: {
                title: value.city + ", " + value.state,
                content: "Category: " + key
                }
            });
                          
            graphicsLayer.add(pointGraphic);
            features.push(new Graphic({
    geometry: point,
    attributes: {
        ObjectID: features.length + 1,
        city: value.city,
        state: value.state,
        category: key
    }
}));        
                    
        }
    const featureLayer = new FeatureLayer({
    source: features,
    objectIdField: "ObjectID",
    geometryType: "point",
    spatialReference: { wkid: 4326 },

    fields: [
        { name: "ObjectID", type: "oid" },
        { name: "city", type: "string" },
        { name: "state", type: "string" },
        { name: "category", type: "string" }
    ],

    renderer: {
        type: "simple",
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: [0, 51, 102],
            size: 14,
            outline: {
                color: [255, 255, 255],
                width: 2
            }
        }
    },

   popupTemplate: {
    title: "{city}, {state}",
    content: "Category: {category}"
}
});

map.add(featureLayer);
        view.on("click", function(event) {
    view.hitTest(event).then(function(response) {
        const result = response.results.find(function(item) {
            return item.graphic &&
                   item.graphic.layer === featureLayer;
        });

        if (result) {
            view.goTo({
                target: result.graphic.geometry,
                zoom: 12
        
            }, {
                duration: 1500
            });
        }
    });
});                               
    }
                
    initMap()
                
    return {};

            
})();



    
