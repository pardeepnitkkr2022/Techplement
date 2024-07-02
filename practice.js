const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let quotes = [

];

let currentQuoteId = quotes.length;

// Fetch a random quote from an external API
async function fetchRandomQuote() {
    try {
        const response = await axios.get('https://api.quotable.io/random');
        return response.data.content;
    } catch (error) {
        console.error("Error fetching quote from external API:", error);
        return null;
    }
}

// Get a random quote (from external API)
app.get('/quote', async (req, res) => {
  

    
        const externalQuote = await fetchRandomQuote();
        if (externalQuote) {
            return res.json({ text: externalQuote });
        }
    

    const randomIndex = Math.floor(Math.random() * quotes.length);
    res.json(quotes[randomIndex]);
});

// Adding a new quote
app.post('/quote', (req, res) => {
    const newQuote = {
        id: ++currentQuoteId,
        text: req.body.text
    };
    quotes.push(newQuote);
    res.status(201).json(newQuote);
});

// Updating a quote
app.put('/quote/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedText = req.body.text;
    const quote = quotes.find(q => q.id === id);

    if (quote) {
        quote.text = updatedText;
        res.json(quote);
    } else {
        res.status(404).json({ error: 'Quote not found' });
    }
});

// Deleting a quote by its id
app.delete('/quote/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const quoteIndex = quotes.findIndex(q => q.id === id);

    if (quoteIndex !== -1) {
        quotes.splice(quoteIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Quote not found' });
    }
});

app.listen(port, () => {
    console.log(`Quote of the Day API listening at http://localhost:${port}`);
});
