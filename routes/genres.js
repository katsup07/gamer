const express = require('express');
const router = express.Router();
const Joi = require('joi');

const genres = [
	{ id: 1, name: 'action' },
	{ id: 2, name: 'rpg' },
	{ id: 3, name: 'sports' },
	{ id: 4, name: 'strategy' },
	{ id: 5, name: 'survival horror' },
];

// == /api/genres ==
router.get('/', (req, res) => {
  console.log('home page...');
  res.send(genres);
});

router.get('/:id', (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  if(!id) return res.status(400).send('Include the genre id to get a genre');

  const genre = genres.find( genre => genre.id === +id);
  if(!genre) return res.status(404).send('Genre could not be found.');

  res.send(genre);
});

router.post('/', (req, res) => {
  const { name } = req.body;
  const { error } = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const genreExists = genres.some( genre => genre.name === name);
  if(genreExists) return res.status(400).send('That genre already exists. Only new genres can be added.')

  const newGenre = {id: genres.length + 1, name};
  genres.push(newGenre);
  res.send(newGenre);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { error } = validateGenre(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const genre = genres.find( genre => genre.id === +id);
  // add new genre when doesn't already exist
  if(!genre) return res.status(400).send('No genre with the given id was found.')
  // update genre
  genre.name = name;
  res.send(genre);
});

router.delete('/:id', (req, res) =>  {
  const { id } = req.params;
  const genre = genres.find( genre => genre.id === +id);
  if(!genre) return res.status(404).send('No genre with the given id was found.');

  const index = genres.findIndex(genre => genre.id === id);
  genres.splice(index, 1);
  res.send(genre);
});

function validateGenre(genre){
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

module.exports = router;