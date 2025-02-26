const socket = io();
console.log("hellor");

if(navigator.geolocation){
    navigator.geolocation.watchPosition(position => {
        const {latitude, longitude} = position.coords;
        const timestamp = position.timestamp;
        socket.emit("sendLocation", {latitude, longitude , timestamp});
    },(err)=>{
        console.log(err);
    },{
        enableHighAccuracy: true,
        maximumAge :0, 
        timeout: 5000
    });
}

const map = L.map("map").setView([0,0],10) 
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "© Apurva Kixx",
}).addTo(map);

const marker ={}

socket.on("receiveLocation",(data)=>{
    console.log(data ); 
    const id = data.id ; 
    const {latitude, longitude} = data;
    map.setView([latitude, longitude],17 );
    if(marker[id]){
        marker[id].setLatLng([latitude, longitude]);
    }else{
        marker[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id)=>{
    if(marker[id]){
        map.removeLayer(marker[id]);
        delete marker[id];
    }
}); 







