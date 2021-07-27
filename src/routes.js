import { Router } from 'express'

// Controllers
import ViewerController from './app/controller/ViewerController'
import MovieController from './app/controller/MovieController'

const routes = new Router()

/* VIEWERS */

// Show all spectators
routes.get('/viewers', ViewerController.index)
// Show 1 viewer
routes.get('/viewers/:id', ViewerController.show)
// Create a viewer
routes.post('/viewers', ViewerController.store)
// Set a movie as seen (Viewer id as URL param, and movie ID on body)
routes.patch('/viewers/:id', ViewerController.update)
// Delete a Viewer
routes.delete('/viewers/:id', ViewerController.delete)

/* MOVIES */

// Show all movies
routes.get('/movies', MovieController.index)
// Show 1 movie
routes.get('/movies/:id', MovieController.show)
// Creat a movie
routes.post('/movies', MovieController.store)
// Delete a movie
routes.delete('/movies/:id', MovieController.delete)

export default routes
