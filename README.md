== README

Jep-Prep is an online application that allows users to play randomly generated Jeopardy games based on fifteen years of Jeopardy history.

Don't buzz in until "Alex" is done reading the clue
You'll see a light when it's time to click your mouse.
But be quick. In real life, other contestants will be buzzing too.

Jep-Prep also provides a public API of Jeopardy questions and answers for consumption in other applications.

Jep-Prep API
============

The Jep-Prep API provides open access to all Jeopardy questions and categories since 2000. All information is sourced from the good people at [J-Archive](http://j-archive.com).

Access to the API
-----------------

The Jep-Prep API is open. No key or authentication is required to gain access to the API. The API provides JSON endpoints for accessing information about clues and categories from Jeopardy history.

API Base URL
------------
`http://104.131.160.239/api`

Categories by ID
----------------
Sample request

`http://104.131.160.239/api/categories/1214`

Categories by Air Date
----------------------
Sample request

`http://104.131.160.239/api/categories/by_airdate/2015-04-02`

Categories By Season
--------------------
Sample request

`http://104.131.160.239/api/categories/by_season/28`

Clues by ID
-----------
Sample request

`http://104.131.160.239/api/clues/431`

New Game
--------
Sample request

`http://104.131.160.239/api/new_game`