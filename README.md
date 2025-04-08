# SFCC Voice of Customer Analysis

A React-based dashboard for analyzing Salesforce Commerce Cloud (SFCC) customer reviews and feedback. This application provides sentiment analysis, theme extraction, and trend visualization for customer reviews.

## Features

- Sentiment Analysis of customer reviews
- Theme extraction and word cloud visualization
- Rating trends over time
- Review filtering by date, rating, and source
- Detailed review analysis with theme grouping
- Interactive charts and visualizations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
  - To check your Node version: `node --version`
  - Download from: https://nodejs.org/
- npm (v6 or higher)
  - To check your npm version: `npm --version`
  - npm comes with Node.js
- Git installed on your machine
  - To check your git version: `git --version`
  - Download from: https://git-scm.com/downloads
- GitHub account with repository access
  - You should have received a collaboration invitation via email
  - Accept the invitation before proceeding

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kristina-Augustinaite/sfcc-voc-analysis.git
cd sfcc-voc-analysis
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at:
- Local: `http://localhost:3000`
- Network: Look for the "On Your Network" URL in the terminal output

### Troubleshooting Setup

#### Common Issues and Solutions

1. **Node Version Mismatch**
   ```bash
   # Check your Node version
   node --version
   
   # If you need to update Node, visit:
   # https://nodejs.org/
   ```

2. **Port 3000 Already in Use**
   ```bash
   # You can either:
   # a) Stop the process using port 3000
   # b) Use a different port:
   PORT=3001 npm start
   ```

3. **npm Install Errors**
   ```bash
   # Try clearing npm cache
   npm cache clean --force
   
   # Then remove node_modules and package-lock.json
   rm -rf node_modules package-lock.json
   
   # Reinstall dependencies
   npm install
   ```

4. **Git Authentication Issues**
   - Ensure you've accepted the repository collaboration invitation
   - Configure Git credentials:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@shopify.com"
   ```

#### Development Environment Setup

1. **Recommended IDE**: Visual Studio Code
   - Useful extensions:
     - ESLint
     - Prettier
     - React Developer Tools
     - GitHub Pull Requests

2. **Chrome Extensions**
   - React Developer Tools
   - Redux DevTools (if using Redux)

3. **Environment Variables**
   - Copy `.env.example` to `.env` (if exists)
   - Ask team members for any required API keys or credentials

## Usage

1. Upload or connect your SFCC review data
2. Use the date range filters to select the period you want to analyze
3. Explore different visualizations:
   - Sentiment distribution
   - Rating trends
   - Theme cloud
   - Detailed review listing

## Team Collaboration

### Development Workflow

1. Create a new branch for your feature or bug fix:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them with meaningful messages:
```bash
git commit -m "feat: add new feature description"
```

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

3. Push your changes and create a Pull Request:
```bash
git push origin feature/your-feature-name
```

### Code Review Process

- All changes must be reviewed by at least one team member
- Use the Pull Request template when creating PRs
- Include relevant test cases and documentation
- Ensure all CI checks pass before requesting review

### Branch Naming Convention

- Features: `feature/description`
- Bugs: `fix/description`
- Documentation: `docs/description`
- Refactoring: `refactor/description`

## Shopify Resources

### Related Projects
- [Streamlit Service](https://github.com/Shopify/streamlit-service)
- [Other related Shopify projects]

### Communication
- **Slack Channel**: #voc-analysis
- **Team Contact**: [Your team's contact information]
- **Documentation**: [Link to internal documentation]

### Support
For questions or issues:
1. Check existing GitHub issues
2. Post in the Slack channel
3. Contact the team lead

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 