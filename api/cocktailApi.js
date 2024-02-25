const axios = require('axios');

const URL = `https://api.api-ninjas.com/v1/cocktail`;
const API_KEY = `oyh7HfMUA+sDRmX0FI/5CA==9bFgT0Yx1U2t9JdN`;

async function getCocktails() {
  
    const response = await axios.get(`${URL}?name=a`, {
        headers: {
            "X-Api-Key": API_KEY
        }
    });

    console.log(response.data);

    if (response.status !== 200) {
        throw new Error('Failed to fetch cocktails');
    }

    return response.data;
}

module.exports = { getCocktails };

