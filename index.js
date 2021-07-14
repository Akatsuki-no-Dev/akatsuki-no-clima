function obtenerPosicion() {
  return new Promise((resolve, reject) =>
    //obtiene las coordenadas del cliente
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
}

async function obtenerClima() {
  const position = await obtenerPosicion();
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const url = `https://api.openweathermap.org/data/2.5/weather?`;
  const apiKey = `287807033c186226918ef742cec2d9c9`;

  const response = await fetch(
    //cadena para consumir API
    `${url}lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=sp`
  );

  const data = await response.json();
  console.log(data);
  return data;
}

//main
try {
  const datosClima = await obtenerClima();

  document.getElementById(
    "lugar"
  ).textContent = `Ubicacion: ${datosClima.name}, ${datosClima.sys.country}`;
  datosClima.weather.forEach((clima) => {
    const img = document.createElement("img");
    img.src = `http://openweathermap.org/img/wn/${clima.icon}@2x.png`;
    img.alt = `${clima.description} icon`;
    document.getElementById("icons").appendChild(img);
    //se crea una variable con un elemento P del dom
    const description = document.createElement("p");//<p></p>
    //se crea otra variable con un nodo de texto
    const pText = document.createTextNode(`${clima.description}`);//pText
    //luego a la variable P le hago un append con el texto
    description.appendChild(pText);//<p>pText</p>
    //hago un append del P ya con el texto incluido dentro de un tag <i>
    document.getElementById("icons").appendChild(description);//<i><p>pText</p></i>
  });

  document.getElementById("temp").textContent = `Temperatura Actual: ${
    Math.round(datosClima.main.temp * 10) / 10
  }°C`;
  document.getElementById("feels_like").textContent = `Sensacion Termica: ${
    Math.round(datosClima.main.feels_like * 10) / 10
  }°C`;
  document.getElementById(
    "humidity"
  ).textContent = `Humedad: ${datosClima.main.humidity}%`;
  document.getElementById("wind").textContent = `Viento: ${
    Math.round(datosClima.wind.speed * 3.6 * 10) / 10
  } Km/h`;
  
} catch (error) {
  console.log(error.message);
}
