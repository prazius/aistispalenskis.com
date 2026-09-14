from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Condition, Thread
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer
import os

DIST = Path("dist").resolve()
changes = Condition()
version = 0


class Watcher(FileSystemEventHandler):
    def on_any_event(self, event):
        global version

        if event.is_directory:
            return

        path = Path(event.src_path)

        if path.suffix not in {".html", ".css", ".js"}:
            return

        print(f"Changed: {path}")

        with changes:
            version += 1
            changes.notify_all()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST), **kwargs)

    def do_GET(self):
        if self.path == "/__reload":
            return self.reload_stream()

        return super().do_GET()

    def reload_stream(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self.end_headers()

        current = version

        try:
            while True:
                with changes:
                    changes.wait_for(lambda: version != current)
                    current = version

                self.wfile.write(b"data: reload\n\n")
                self.wfile.flush()

        except (BrokenPipeError, ConnectionResetError):
            pass


observer = Observer()
observer.schedule(Watcher(), str(DIST), recursive=True)
observer.start()

server = ThreadingHTTPServer(("127.0.0.1", 8000), Handler)

print("Serving on http://127.0.0.1:8000")

try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.shutdown()
    observer.stop()
    observer.join()
