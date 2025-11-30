export async function handler(event, context) {
  const API_KEY = process.env.MY_SECRET_API_KEY;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (!API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "API key not configured" }),
    };
  }

  const { lat, lon, q } = event.queryStringParameters || {};

  try {
    let url;

    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&lat=${lat}&lon=${lon}&units=metric`;
    } else if (q) {
      url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&q=${q}&units=metric`;
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required parameters" }),
      };
    }

    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to fetch weather data" }),
    };
  }
}
