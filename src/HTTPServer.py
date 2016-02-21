import SimpleHTTPServer
import movie

movie.read_movie_list()

class HTTPServer(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def main_page(self):
        file = open("../Web/index.html").read()
        return file
        
    def handle_quote(self, quote):
        print quote
        if "/hello" == quote:
            return "{userId: 18754875}"
        return self.main_page()

    def do_GET(self):
        return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self);
        #self.wfile.write(self.handle_quote(self.path))
        #self.wfile.write("<iframe width='560' height='315' src='https://www.youtube.com/embed/" + movie.getRandomTrailer() + "?autoplay=1' frameborder='0' allowfullscreen></iframe>")
