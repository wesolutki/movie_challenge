#!/usr/bin/python

#import SimpleHTTPServer
import SocketServer
import src.HTTPServer as HTTPServer
import sys
import traceback


try:
    print sys.argv[0]
    port = int(sys.argv[1])
    print('Server listening on port %d...' % port)
    httpd = SocketServer.TCPServer(('', port), HTTPServer.HTTPServer)
    httpd.serve_forever()
except Exception as e:
    print "Unexpected error:", str(e)
    traceback.print_stack()
    if httpd:
        httpd.server_close()
    raise
