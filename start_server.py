"""
Server Launcher for Market Price Prediction for Agricultural Products
"""
import sys
import os
import uvicorn

if __name__ == "__main__":
    print("==================================================================")
    print("  AgriPrice AI: Market Price Prediction for Agricultural Products")
    print("==================================================================")
    print(" * Serving on: http://127.0.0.1:8000")
    print(" * Interactive API Docs at: http://127.0.0.1:8000/docs")
    print(" * Press Ctrl+C to stop the server")
    print("==================================================================")
    
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False, log_level="info")
