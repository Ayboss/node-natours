
export const displayMap = (locations)=>{
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXlib3NzIiwiYSI6ImNraGtneGU4czAyeDkyc3J0c3pwMjM2d24ifQ.sO7n_T1HjwLZpB8E_S382A';
        var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/ayboss/ckhkig83c23pb19ruby0w9yev',
        scrollZoom: false
        // center: [-118.113491, 34.111745 ],
        // zoom: 4
        }); 

        const bounds = new mapboxgl.LngLatBounds();

        locations.forEach(loc=>{
            //create marker
            const el = document.createElement('div');
            el.className= 'marker';

            // add marker
            new mapboxgl.Marker({
                element: el,
                anchor: 'bottom'
            }).setLngLat(loc.coordinates)
            .addTo(map);

            //add popup
            new mapboxgl.Popup({
                offset:30
            })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map)
            //extends map bounds to include current locations
            bounds.extend(loc.coordinates);   
        })

        map.fitBounds(bounds,{
            padding:{
                top:200,
                bottom:150,
                left:100,
                right:100
            }
        });
}   