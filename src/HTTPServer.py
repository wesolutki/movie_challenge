import SimpleHTTPServer
import movie

movie.read_movie_list()
print len(movie.movies)

class HTTPServer(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def dispatch(self, path):
        if "/hello" == path:
            return "{userId: 18754875}"
        elif "/quiz" == path:
            return movie.getRandomTrailer()
        return None
    
    def handle_quote(self, path):
        print path
        result = self.dispatch(path)
        if not result:
            SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)
        self.rfile.write(result)

    def do_GET(self):
        self.handle_quote(self.path)
        #self.wfile.write(self.handle_quote(self.path))
        #self.wfile.write("<iframe width='560' height='315' src='https://www.youtube.com/embed/" + movie.getRandomTrailer() + "?autoplay=1' frameborder='0' allowfullscreen></iframe>")
