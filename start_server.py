"""
Server Launcher for Market Price Prediction for Agricultural Products
Automatically selects an open port if 8000 is occupied to prevent WinError 10013.
"""
import sys
import os
import socket
import webbrowser
import uvicorn

def find_available_port(preferred_port=8000, fallback_ports=(8001, 8080, 5000, 8888)):
    for port in [preferred_port] + list(fallback_ports):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    return preferred_port

if __name__ == "__main__":
    port = find_available_port(8000)
    
    print("==================================================================")
    print("  AgriPrice AI: Market Price Prediction for Agricultural Products")
    print("==================================================================")
    print(f" * Serving on: http://127.0.0.1:{port}")
    print(f" * Interactive API Docs at: http://127.0.0.1:{port}/docs")
    print(" * Press Ctrl+C to stop the server")
    print("==================================================================")
    
    uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=False, log_level="info")
