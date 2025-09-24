@echo off
setlocal enabledelayedexpansion

:: Colors
set "GREEN=[32m"
set "RED=[31m"
set "NC=[0m"

:: Set environment
set NODE_ENV=test

:: Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo %RED%Docker is not running. Please start Docker and try again.%NC%
    exit /b 1
)

:: Start test database
echo %GREEN%Starting test database...%NC%
docker-compose -f docker-compose.test.yml up -d test-mongodb

:: Wait for MongoDB to be ready
echo %GREEN%Waiting for MongoDB to be ready...%NC%
:wait_for_mongo
docker exec test-mongodb mongosh --eval "print('MongoDB is ready')" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo %GREEN%Waiting for MongoDB...%NC%
    timeout /t 1 >nul
    goto wait_for_mongo
)

:: Set MongoDB connection string
set MONGO_URI_TEST=mongodb://localhost:27017/student_hub_test

:: Run database setup
echo %GREEN%Setting up test database...%NC%
call npm run test:setup

:: Run tests
echo %GREEN%Running tests...%NC%

:: If arguments are passed, use them as test patterns
if "%*"=="" (
    call npm test
) else (
    call npm test -- %*
)

:: Capture the exit code of the test command
set TEST_EXIT_CODE=%ERRORLEVEL%

:: Stop test database
echo %GREEN%Stopping test database...%NC%
docker-compose -f docker-compose.test.yml down

:: Exit with the test command's exit code
exit /b %TEST_EXIT_CODE%
