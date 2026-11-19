@echo off
title Market Price Prediction for Agricultural Products
echo ======================================================================
echo   Market Price Prediction for Agricultural Products (AgriPrice AI)
echo ======================================================================
echo.
echo Starting Web Server with FastAPI and Machine Learning Engine...
echo.

REM Open browser after 2 seconds
start "" http://127.0.0.1:8000

REM Run Python FastAPI Server
python start_server.py

pause
