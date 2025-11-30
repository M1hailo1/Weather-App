export async function handler(event, context) {
  const API_KEY = process.env.MY_SECRET_API_KEY;

  const response = await fetch("https://api.example.com/data?key=" + API_KEY);

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
