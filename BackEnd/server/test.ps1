# Set environment variables
$env:NODE_ENV = "test"
$env:MONGO_URI_TEST = "mongodb://localhost:27017/student_hub_test"

# Colors for output
$GREEN = "\u001b[32m"
$RED = "\u001b[31m"
$NC = "\u001b[0m" # No Color

# Function to check if Docker is running
function Test-DockerRunning {
    try {
        $null = docker info 2>$null
        return $true
    } catch {
        return $false
    }
}

# Function to wait for MongoDB to be ready
function Wait-MongoDBReady {
    $attempts = 0
    $maxAttempts = 30
    
    while ($attempts -lt $maxAttempts) {
        try {
            $result = docker exec test-mongodb mongosh --eval "print('MongoDB is ready')" 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "${GREEN}MongoDB is ready!${NC}"
                return $true
            }
        } catch {
            # Continue to next attempt
        }
        
        $attempts++
        Write-Host "${GREEN}Waiting for MongoDB... (Attempt $attempts/$maxAttempts)${NC}"
        Start-Sleep -Seconds 1
    }
    
    Write-Host "${RED}Failed to connect to MongoDB after $maxAttempts attempts${NC}"
    return $false
}

# Main script execution
try {
    # Check if Docker is running
    if (-not (Test-DockerRunning)) {
        Write-Host "${RED}Docker is not running. Please start Docker and try again.${NC}"
        exit 1
    }

    # Start test database
    Write-Host "${GREEN}Starting test database...${NC}"
    docker-compose -f docker-compose.test.yml up -d test-mongodb

    # Wait for MongoDB to be ready
    if (-not (Wait-MongoDBReady)) {
        exit 1
    }

    # Run database setup
    Write-Host "${GREEN}Setting up test database...${NC}"
    npm run test:setup
    if ($LASTEXITCODE -ne 0) {
        Write-Host "${RED}Failed to set up test database${NC}"
        exit $LASTEXITCODE
    }

    # Run tests
    Write-Host "${GREEN}Running tests...${NC}"
    
    # If arguments are passed, use them as test patterns
    if ($args.Count -gt 0) {
        $testArgs = $args -join ' '
        npm test -- $testArgs
    } else {
        npm test
    }
    
    $testExitCode = $LASTEXITCODE
}
catch {
    Write-Host "${RED}An error occurred: $_${NC}"
    $testExitCode = 1
}
finally {
    # Stop test database
    Write-Host "${GREEN}Stopping test database...${NC}"
    docker-compose -f docker-compose.test.yml down
    
    # Exit with the test command's exit code
    exit $testExitCode
}
