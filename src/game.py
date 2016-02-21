import movie
import json
import random
import urllib
import datetime
import time
from random import shuffle
from geoip import geolite2

movie.read_movie_list()
print len(movie.movies)

INITIAL_ID = 0
GAMES = {}

class game:
    def __init__(self, country):
        self.good_movies = []
        self.bad_movies = []
        self.get_movies_ids()
        self.score = 0
        self.good_answers_in_row = 0
        self.currentMovieId = 0
        self.lifes = 5
        self.country = country
        
    def process_answer(self, answer):
        print "Answer: " + answer
        if 'good' == answer:
            self.good_answers_in_row += 1
            self.score += 100 * self.good_answers_in_row
        elif 'bad' == answer:
            self.good_answers_in_row = 0
            self.lifes -= 1
        elif 'error' == answer:
            movie.deleteMovie(self.currentMovieId)
            
    def get_movies_ids(self):
        self.movie_ids = movie.movies.keys()
        
    def get_random_quiz(self):
        ids = []
        movie_list = []
        for i in range(0, 4):
            r_id = self.movie_ids.pop(random.randint(0, len(self.movie_ids) - 1))
            ids.append(r_id)
            movie_list.append({
                'id': r_id,
                'title': movie.movies[r_id]['title'],
                'status': 'bad'
                })
        
        self.currentMovieId = ids[0]
        good_movie = movie.movies[ids[0]]
        trailer = good_movie['trailers'][0]
        movie_list[0]['status'] = 'good'
        shuffle(movie_list)
        ids.pop(0)
        self.movie_ids += ids
        
        ret = json.dumps({
            'quiz': movie_list,
            'trailer': trailer,
            'points': self.score,
            'lifes': self.lifes
            })
    
        return ret
        
    def get_game_over_data(self):
        d = datetime.datetime.fromtimestamp(time.time())
        
        datetime.Date
        ret = json.dumps({
            'points': self.score,
            'timeStamp': self.timeStamp,
            'country': self.country
            })
    
        return ret
        

def add_new_game(ip):
    print "Ip address: " + ip
    match = geolite2.lookup(ip)
    print match.country
    global INITIAL_ID
    INITIAL_ID += 1
    GAMES[INITIAL_ID] = game(match.country)
    return INITIAL_ID

