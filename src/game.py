import movie
import json
import random
import urllib
import datetime
import time
import cPickle
from random import shuffle
from geoip import geolite2

movie.read_movie_list()
print len(movie.movies)

SCORES_FILE_PATH = "./scores.txt"
INITIAL_ID = 0
GAMES = {}
SCORES = []

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
            self.score += 100 * self.good_answers_in_row
            self.good_answers_in_row += 1
        elif 'bad' == answer:
            self.good_answers_in_row = 1
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
            'lifes': self.lifes,
            'multiplayer': self.good_answers_in_row
            })
    
        print ret
        return ret
        
    def get_game_over_data(self):
        global SCORES
        self.endTime = time.time()
        
        current_element = [self.score, self.endTime, self.country]
        SCORES.append([self.score, self.endTime, self.country])
        def sortScores(itemL, itemR):
            if itemL[0] != itemR[0]:
                return itemR[0] - itemL[0]
            return itemR[1] < itemL[1]
        SCORES = sorted(SCORES, cmp=sortScores)
        
        save_score_list()
        index = SCORES.index(current_element)
        
        print "Index: ", index
        
        upperList = []
        lowerList = []
        if 0 == index:
            lowerList = SCORES[index + 1 : 10]
        elif 5 >= index:
            upperList = SCORES[:index]
            lowerList = SCORES[index + 1 : 10]
        elif len(SCORES) < index + 5:
            upperList = SCORES[ len(SCORES) - index - 11: index]
            lowerList = SCORES[index + 1 :]
        else:
            upperList = SCORES[index - 5 : index ]
            lowerList = SCORES[index + 1 : index + 6]
            
        upperList = [[e[0], datetime.datetime.fromtimestamp(e[1]).strftime('%Y-%m-%d'), e[2]] for e in upperList]
        lowerList = [[e[0], datetime.datetime.fromtimestamp(e[1]).strftime('%Y-%m-%d'), e[2]] for e in lowerList]
        current_element[1] = datetime.datetime.fromtimestamp(current_element[1]).strftime('%Y-%m-%d')
        current_element.append(index)
        
        print 'Game over'
        print upperList
        print current_element
        print lowerList
        
        ret = json.dumps({
            'upperList': upperList,
            'currentElement': current_element,
            'lowerList': lowerList
            })
    
        return ret
        
def get_best_scores(count):
    pass

def get_score_with_surroundings(count):
    pass
        

def read_score_list():
    global SCORES
    SCORES = cPickle.load(open(SCORES_FILE_PATH))

def save_score_list():
    cPickle.dump(SCORES, open(SCORES_FILE_PATH, 'w'))
    
    
def add_new_game(ip):
    print "Ip address: " + ip
    match = geolite2.lookup(ip)
    print match.country
    global INITIAL_ID
    INITIAL_ID += 1
    GAMES[INITIAL_ID] = game(match.country)
    return INITIAL_ID

