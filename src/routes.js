import { Router } from 'express'

// Controllers

const routes = new Router()

/* VIEWERS */

// Show all spectators
routes.get('/viewers')
// Show 1 viewer
routes.get('/viewers/:id')
// Create a viewer
routes.post('/viewers')
// Set a movie as seen (Viewer id as URL param, and movie ID on body)
routes.patch('/viewers/:id')

/* MOVIES */

// Show all movies
routes.get('/movies')
// Show 1 movie
routes.get('/movies/:id')
// Creat a movie
routes.post('/movies')
