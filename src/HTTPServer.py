import SimpleHTTPServer
import movie
import game

import json

movie.read_movie_list()
#game.read_score_list()
print 'Movies count: ' + str(len(movie.movies))
print 'Scores count: ' + str(len(game.SCORES))

class HTTPServer(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def dispatch(self, path):
        params = path.split('/')
        print params
        if "hello" == params[1]:
            return json.dumps({"gameId": game.add_new_game(self.client_address[0])})
        elif 'quiz' == params[1]:
            gameId = int(params[2])
            game.GAMES[gameId].process_answer(params[3])
            return game.GAMES[gameId].get_random_quiz()
        elif 'game_over' == params[1]:
            gameId = int(params[2])
            return game.GAMES[gameId].get_game_over_data()
        return None
    
    def handle_quote(self, path):
        print path
        result = self.dispatch(path)
        if not result:
            SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)
        self.rfile.write(result)

    def do_GET(self):
        self.handle_quote(self.path)

