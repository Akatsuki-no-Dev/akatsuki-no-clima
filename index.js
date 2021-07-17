function obtenerPosicion() {
  return new Promise((resolve, reject) =>
    //obtiene las coordenadas del cliente
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
}
//funcion para buscar los datos de la API
async function obtenerClima(ciudad) {
  const url = `https://api.openweathermap.org/data/2.5/weather?`;
  const apiKey = `287807033c186226918ef742cec2d9c9`;
  let lat = "";
  let lon = "";
  let fullUrl = "";
  if (!ciudad) {
    const position = await obtenerPosicion();
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    fullUrl = `${url}lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=sp`;
  } else {
    fullUrl = `${url}q=${ciudad}&units=metric&appid=${apiKey}&lang=sp`;
  }
  const response = await fetch(
    //cadena para consumir API
    fullUrl
  );

  const data = await response.json();
  //console.log(data);
  return data;
}

//funcion para mostrar los datos obtenidos en el html
async function mostrarClima(ciudad) {
  try {
    const datosClima = await obtenerClima(ciudad);

    document.getElementById(
      "lugar"
    ).textContent = `Ubicacion: ${datosClima.name}, ${datosClima.sys.country}`;
    //creamos una referencia al elemento icons y le borramos todos los nodos hijos
    const icons = document.getElementById("icons")
    while (icons.firstChild) {
      icons.removeChild(icons.firstChild);
    }
    //poblamos el elemento icons con dos hijos por cada icono de la API
    datosClima.weather.forEach((clima) => {
      const img = document.createElement("img");
      img.src = `http://openweathermap.org/img/wn/${clima.icon}@2x.png`;
      img.alt = `${clima.description} icon`;
      icons.appendChild(img);
      //se crea una variable con un elemento P del dom
      const description = document.createElement("p"); //<p></p>
      //se crea otra variable con un nodo de texto
      const pText = document.createTextNode(`${clima.description}`); //pText
      //luego a la variable P le hago un append con el texto
      description.appendChild(pText); //<p>pText</p>
      //hago un append del P ya con el texto incluido dentro de un tag <i>
      icons.appendChild(description); //<i><p>pText</p></i>
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
}

//al cargar la pagina muestra los datos del cliente
document.addEventListener("DOMContentLoaded", () => {
  mostrarClima();
});

//cada vez que se haga click en el boton toma el valor del campo ciudad y llama a la funcion mostrarClima
//para que muestre los datos de la ciudad remplazando los datos del cliente
const formulario = document.getElementById("formulario");
formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  mostrarClima(formulario.ciudad.value);
});
//main
