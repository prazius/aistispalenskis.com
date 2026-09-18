#!/usr/bin/env bash

python3 server.py &
SERVER_PID=$!

cleanup() {
    echo
    echo "Stopping server..."
    kill -TERM "$SERVER_PID" 2>/dev/null
    wait "$SERVER_PID" 2>/dev/null
}

trap cleanup INT TERM

sleep 1
setsid -f xdg-open http://127.0.0.1:8000 >/dev/null 2>&1

wait "$SERVER_PID"
