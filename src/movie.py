import json
import random
from random import shuffle
from urllib2 import Request, urlopen, quote
from pprint import pprint
import cPickle
import tmdbsimple as tm

from time import sleep

MOVIE_API_KEY = 'ae35231a48a01b1923fa9c885cae9d47'
MOVIE_FILE_PATH = './movies.txt'
movies = {}
  
#movieApiUrl = 'http://api.themoviedb.org/3/'
#movieApiKey = 'ae35231a48a01b1923fa9c885cae9d47'

def get_video(video):
    sleep(0.5)
    return video['key']

def get_trailers(id):
    print "Getting trailers for id: " + str(id);
    return [get_video(video) for video in tm.movies.Movies(id=id).videos()['results']  if 'Trailer' in video['name']]

def update_movie(movie):
    id = movie['id']
    movies[id] = {
        'title': movie['title'], 
        'trailers': get_trailers(id)
        }

def update_videos(data):
    for movie in data:
        update_movie(movie)

def read_movie_list():
    global movies
    movies = cPickle.load(open(MOVIE_FILE_PATH))
    movies = dict([[movieKey, movies[movieKey]] for movieKey in movies.keys() if movies[movieKey]['trailers']])
    count = len(movies)
    print count

def save_movie_list():
    cPickle.dump(movies, open(MOVIE_FILE_PATH, 'w'))
     
def get_movies():
    discover = tm.Discover()
    response = Discover()


def makeRequest(url):
    headers = {
        'Accept': 'application/json'
    }
    print 'Making request for url: ' + url
    request = Request(url, headers=headers)
    return json.loads(urlopen(request).read())
    

def getMovieDetails(title):
    title = quote(title)
    return makeRequest(movieApiUrl + 'search/movie?api_key=' + movieApiKey + '&query=' + title)

def getMovieVideos(id):
    return makeRequest(movieApiUrl + 'movie/' + str(id) + '/videos?api_key=' + movieApiKey)

def getMovieTrailer(title):
    data = getMovieDetails(title)
    if 'results' in data:
        videosData = getMovieVideos(data['results'][0]['id'])
        if 'results' in videosData:
            trailers = [result['key'] for result in videosData['results'] if 'Trailer' in result['name']]
            if len(trailers):
                return trailers[0]
    return None

def getRandomTrailer():
    global movies
    movie_list = []
    while len(movie_list) < 4:
        count = len(movies)
        id = movies.keys()[random.randint(0, count - 1)]
        movie = movies[id]
        if movie['title'] not in [m['title'] for m in movie_list]:
            print movie
            movie_list.append({
                'id': id,
                'title': movie['title'],
                'status': 'bad'
                })
    good_movie = movies[movie_list[0]['id']]
    trailer = good_movie['trailers'][0]
    movie_list[0]['status'] = 'good'
    shuffle(movie_list)
    
    ret = json.dumps({
        'quiz': movie_list,
        'trailer': trailer
        })
    
    print ret
    return ret
