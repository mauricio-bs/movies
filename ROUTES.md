# HOW TO USE

Following here, have all instructions to use this API and all your resources

``[HTTP Method]``

``:id = ID of viewer or movie, depending what the route needs``

## Viewers

````
[GET] /viewers -> Return all viewers registered

[GET] /viewers/:viewer_id -> Search for the viewer by ID that you passs in URL

[POST] /viewers -> Create a viewer, sending the following params:
{
    "name": "STRING",
	"sure_name": "STRING",
	"email": "Valid Email",
	"times_watched": INTEGER (Optional)
}

[DELETE] /viewers/:viewer_id -> Specify the viewer that will be delete passing his ID in URL
````

## Movies

````
[GET] /movies -> Return all movies registered

[GET] /movies/:movie_id -> Search for the movie by ID that you passs in URL

[POST] /movies -> Create a movie, sending the following params:
{
    "name": "STRING" (Unique)
	"synopsis": "TEXT"
    "spectators_count": INTEGER (Optional)
}

[DELETE] /movies/:movie_id -> Specify the movie that will be delete passing his ID in URL
````

## Watching a movie

To watch a movie, you will need the id of movie and viewer, passing in URL as following here:

````
[POST] /movies/:movie_id/watch/:viewer_id
````