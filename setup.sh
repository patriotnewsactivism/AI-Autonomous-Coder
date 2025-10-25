#!/bin/bash

# AI Autonomous Agent System - Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Setting up AI Autonomous Agent System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js 14 or higher."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Check if Git is installed
check_git() {
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        print_success "Git is installed: $GIT_VERSION"
    else
        print_error "Git is not installed. Please install Git."
        print_status "Visit: https://git-scm.com/"
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    if [ -f "package.json" ]; then
        npm install
        print_success "Dependencies installed successfully"
    else
        print_warning "No package.json found. Skipping npm install."
    fi
}

# Create environment file
create_env_file() {
    if [ ! -f ".env" ]; then
        print_status "Creating .env file..."
        cat > .env << EOF
# AI Provider API Keys
GEMINI_API_KEY=your_gemini_api_key_here
CLAUDE_API_KEY=your_claude_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Application Settings
APP_URL=http://localhost:3000
ENVIRONMENT=development
DEBUG=true

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
EOF
        print_success ".env file created"
        print_warning "Please update the API keys in .env file"
    else
        print_status ".env file already exists"
    fi
}

# Set up Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    # Create pre-commit hook
    mkdir -p .git/hooks
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit hook for AI Autonomous Agent System

echo "Running pre-commit checks..."

# Check for console.log statements
if grep -r "console\.log" --include="*.js" --include="*.html" .; then
    echo "Warning: Found console.log statements. Consider removing them for production."
fi

# Check for TODO comments
if grep -r "TODO\|FIXME" --include="*.js" --include="*.html" .; then
    echo "Warning: Found TODO/FIXME comments. Consider addressing them."
fi

echo "Pre-commit checks completed."
EOF
    
    chmod +x .git/hooks/pre-commit
    print_success "Git hooks set up successfully"
}

# Create development server script
create_dev_script() {
    print_status "Creating development server script..."
    cat > dev-server.js << 'EOF'
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Development server running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});
EOF
    
    print_success "Development server script created"
}

# Main setup function
main() {
    print_status "Starting setup process..."
    
    # Check prerequisites
    check_node
    check_npm
    check_git
    
    # Install dependencies
    install_dependencies
    
    # Create environment file
    create_env_file
    
    # Set up Git hooks
    setup_git_hooks
    
    # Create development server
    create_dev_script
    
    print_success "Setup completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "1. Update API keys in .env file"
    echo "2. Run 'node dev-server.js' to start development server"
    echo "3. Open http://localhost:3000 in your browser"
    echo "4. Start developing!"
    echo ""
    print_status "For more information, check the README.md file"
}

# Run main function
main "$@"
