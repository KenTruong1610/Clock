function updateDateTime() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;

    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = days[now.getDay()];
    const date = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    document.getElementById('date').textContent = `${dayName}, ${date}/${month}/${year}`;
}

async function fetchWeather() {
    const weatherElement = document.getElementById('weather');

    try {
        let position = null;
        try {
            position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 5000,
                    maximumAge: 60000
                });
            });
        } catch (geoError) {
            console.log('Không lấy được vị trí, sử dụng vị trí mặc định (Hà Nội)');
            position = {
                coords: {
                    latitude: 21.0285,
                    longitude: 105.8542
                }
            };
        }

        const { latitude, longitude } = position.coords;

        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
        );

        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu thời tiết');
        }

        const data = await response.json();

        const temperature = Math.round(data.current_weather.temperature);
        const weatherCode = data.current_weather.weathercode;

        weatherElement.innerHTML = `
            <div class="weather-container">
                <div class="weather-location">${getLocationName(latitude, longitude)}</div>
                <div class="weather-icon">${getWeatherIcon(weatherCode)}</div>
                <div class="weather-temperature">${temperature}°C</div>
                <div class="weather-description">${getWeatherDescription(weatherCode)}</div>
                <div class="weather-details">Gió: ${Math.round(data.current_weather.windspeed)} km/h</div>
            </div>
        `;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin thời tiết:', error);
        weatherElement.innerHTML = `
            <div class="error">Không thể tải dữ liệu thời tiết. ${error.message}</div>
        `;
    }
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Trời quang',
        1: 'Chủ yếu quang',
        2: 'Mây rải rác',
        3: 'Nhiều mây',
        45: 'Sương mù',
        48: 'Sương mù giá',
        51: 'Mưa phùn nhẹ',
        53: 'Mưa phùn vừa',
        55: 'Mưa phùn dày',
        56: 'Mưa phùn đóng băng nhẹ',
        57: 'Mưa phùn đóng băng dày',
        61: 'Mưa nhẹ',
        63: 'Mưa vừa',
        65: 'Mưa nặng hạt',
        66: 'Mưa đóng băng nhẹ',
        67: 'Mưa đóng băng nặng',
        71: 'Tuyết nhẹ',
        73: 'Tuyết vừa',
        75: 'Tuyết nặng',
        77: 'Hạt tuyết',
        80: 'Mưa rào nhẹ',
        81: 'Mưa rào vừa',
        82: 'Mưa rào nặng',
        85: 'Tuyết rào nhẹ',
        86: 'Tuyết rào nặng',
        95: 'Giông bão',
        96: 'Giông bão kèm mưa đá nhẹ',
        99: 'Giông bão kèm mưa đá nặng'
    };
    return descriptions[code] || 'Không xác định';
}

function getWeatherIcon(code) {
    const icons = {
        0: '☀️',  // Trời quang
        1: '🌤️',  // Chủ yếu quang
        2: '⛅',  // Mây rải rác
        3: '☁️',  // Nhiều mây
        45: '🌫️', // Sương mù
        48: '🌫️', // Sương mù giá
        51: '🌧️', // Mưa phùn nhẹ
        53: '🌧️', // Mưa phùn vừa
        55: '🌧️', // Mưa phùn dày
        56: '🌧️❄️', // Mưa phùn đóng băng
        57: '🌧️❄️', // Mưa phùn đóng băng dày
        61: '🌧️', // Mưa nhẹ
        63: '🌧️', // Mưa vừa
        65: '🌧️', // Mưa nặng hạt
        66: '🌧️❄️', // Mưa đóng băng nhẹ
        67: '🌧️❄️', // Mưa đóng băng nặng
        71: '❄️',  // Tuyết nhẹ
        73: '❄️',  // Tuyết vừa
        75: '❄️',  // Tuyết nặng
        77: '❄️',  // Hạt tuyết
        80: '🌧️', // Mưa rào nhẹ
        81: '🌧️', // Mưa rào vừa
        82: '🌧️', // Mưa rào nặng
        85: '❄️',  // Tuyết rào nhẹ
        86: '❄️',  // Tuyết rào nặng
        95: '⛈️',  // Giông bão
        96: '⛈️',  // Giông bão kèm mưa đá
        99: '⛈️'   // Giông bão kèm mưa đá nặng
    };
    return icons[code] || '🌤️';
}


function getLocationName(lat, lng) {
    if (lat >= 20.8 && lat <= 21.2 && lng >= 105.7 && lng <= 106.0) {
        return "Hà Nội, Việt Nam";
    } else if (lat >= 10.7 && lat <= 10.9 && lng >= 106.6 && lng <= 106.8) {
        return "TP.HCM, Việt Nam";
    } else {
        return `Vĩ độ: ${lat.toFixed(2)}, Kinh độ: ${lng.toFixed(2)}`;
    }
}

setInterval(updateDateTime, 1000);
updateDateTime(); 


fetchWeather();
setInterval(fetchWeather, 30 * 60 * 1000);