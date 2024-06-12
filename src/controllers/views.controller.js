const { usersService, petsService } = require('../services')

const showHome = (req, res) => {
  res.render('home')
}

const showUsersList = async (req, res) => {
  const users = await usersService.getAll();
  res.render('users', { users })
}

const showPetsList = async (req, res) => {
  const pets = await petsService.getAll();
  res.render('pets', { pets })
}


module.exports = {
  showHome,
  showUsersList,
  showPetsList
}