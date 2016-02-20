import json
import random
from urllib2 import Request, urlopen, quote
from pprint import pprint
 
 
movieApiUrl = 'http://api.themoviedb.org/3/'
movieApiKey = 'ae35231a48a01b1923fa9c885cae9d47'
 

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
    

#trailers = [getMovieTrailer(line) for line in open("movie_titles.txt").readlines() if line]
#pprint(trailers)
trailers = ["faja"]

def getRandomTrailer():
    return trailers[random.randint(0, len(trailers) - 1)]