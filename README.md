# BookMyWorker - Frontend

A modern React application for the BookMyWorker platform, built with Vite, React 19, and Material-UI.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Development](#development)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ✨ Features

- ⚡ **Fast Development**: Built with Vite for lightning-fast HMR
- 🔧 **Modern React**: Using React 19 with hooks and context
- 🎨 **Material-UI**: Beautiful, accessible component library
- 🌍 **Internationalization**: Multi-language support with react-i18next
- 📱 **Responsive Design**: Mobile-first responsive design
- 🔒 **Security**: Built-in security headers and CSP
- 🧪 **Testing**: Comprehensive testing with Vitest and Testing Library
- 📦 **Production Ready**: Optimized builds with code splitting
- 🐳 **Containerized**: Docker support for easy deployment
- 🚀 **CI/CD**: GitHub Actions for automated testing and deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: use nvm)
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with HMR
npm run start        # Alias for dev

# Building
npm run build        # Build for production
npm run build:prod   # Build with production optimizations
npm run preview      # Preview production build locally
npm run clean        # Clean build artifacts

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript type checking

# Testing
npm run test         # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate test coverage report

# Analysis
npm run analyze      # Analyze bundle size
npm run audit-security # Run security audit
```

### Development Workflow

1. **Code Style**: We use ESLint and Prettier for consistent code formatting
2. **Pre-commit**: Husky runs linting and formatting on commit
3. **Type Safety**: TypeScript for type checking (gradual adoption)
4. **Testing**: Write tests for all new components and utilities

## 🧪 Testing

We use Vitest for unit testing with React Testing Library:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

### Test Structure

```
src/
├── components/
│   └── __tests__/     # Component tests
├── utils/
│   └── __tests__/     # Utility tests
└── test/
    └── setup.js       # Test configuration
```

## 🏗️ Building for Production

### Local Build

```bash
# Build for production
npm run build:prod

# Preview build
npm run preview
```

### Docker Build

```bash
# Build Docker image
docker build -t bookmyworker-frontend .

# Run container
docker run -p 3000:80 bookmyworker-frontend
```

### Docker Compose

```bash
# Production
docker-compose up frontend

# Development with hot reload
docker-compose --profile dev up frontend-dev
```

## 🚀 Deployment

### Environment Setup

1. **Staging**: Deploys automatically from `develop` branch
2. **Production**: Deploys automatically from `main` branch

### Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] Security headers configured
- [ ] SSL certificate installed
- [ ] CDN configured (if applicable)
- [ ] Monitoring and error tracking setup

## 🌍 Environment Variables

### Required Variables

```env
# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com
VITE_API_TIMEOUT=15000

# External Services
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_SENTRY_DSN=your_sentry_dsn (production only)
```

### Optional Variables

```env
# App Configuration
VITE_APP_NAME=BookMyWorker
VITE_APP_ENVIRONMENT=production

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_LOGGING=false
VITE_ENABLE_DEBUG=false
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard components
│   ├── Job/           # Job-related components
│   └── Layout/        # Layout components
├── utils/              # Utility functions
│   ├── api.js         # API configuration
│   ├── monitoring.js  # Error tracking & monitoring
│   └── constants.js   # Application constants
├── assets/            # Static assets
├── test/              # Test configuration and utilities
└── i18n/              # Internationalization files
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards

- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure CI/CD pipeline passes

## 📝 License

This project is private and proprietary.



    {step === 1 && (
                    <>
                      <FormControl
                        component="fieldset"
                        margin="normal"
                        fullWidth
                        sx={{
                          backgroundColor: 'transparent',
                          borderRadius: 2,
                          // padding: 2,
                        }}
                      >
                        <FormLabel
                          component="legend"
                          sx={{ fontWeight: 700, mb: 1, fontSize: '1.1rem' }}
                        >
                          {t('selectRole')}
                        </FormLabel>

                        <RadioGroup value={role} onChange={e => handleRoleChange(e.target.value)}>
                          {/* Group 1: Agent + Self Worker */}
                          <Box
                            sx={{
                              backgroundColor: 'rgb(240 248 255)', // ✅ light blue background for group
                              border: '1px solid rgba(0,0,0,0.08)',
                              borderRadius: 2,
                              p: 0,
                              mb: 1,
                              boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                            }}
                          >
                            {/* Agent Option */}
                            <Box
                              sx={{
                                borderRadius: 1.5,
                                backgroundColor:
                                  role === 'Agent' ? 'rgb(220 240 255)' : 'transparent',
                                transition: 'background-color 0.2s ease',
                                p: 1,
                              }}
                            >
                              <FormControlLabel
                                value="Agent"
                                control={<Radio sx={{ p: '0px 0px 0px 7px' }} size="medium" />}
                                label={
                                  <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                    {t('agent')}
                                  </Typography>
                                }
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 2, fontSize: '0.775rem', lineHeight: 1.4 }}
                              >
                                {t('registerMessageAgent')}
                              </Typography>
                            </Box>

                            <Divider sx={{ my: 1, borderColor: 'rgba(0,0,0,0.1)' }} />

                            {/* Self Worker Option */}
                            <Box
                              sx={{
                                borderRadius: 1.5,
                                backgroundColor:
                                  role === 'SelfWorker' ? 'rgb(230 255 230)' : 'transparent',
                                transition: 'background-color 0.2s ease',
                                p: 1,
                              }}
                            >
                              <FormControlLabel
                                value="SelfWorker"
                                control={<Radio sx={{ p: '0px 0px 0px 7px' }} size="medium" />}
                                label={
                                  <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                    {t('selfWorkerLabel') || 'Self Worker (Individual)'}
                                  </Typography>
                                }
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 2, fontSize: '0.775rem', lineHeight: 1.4 }}
                              >
                                {t('registerMessageSelfWorker') ||
                                  'Register as an individual worker and manage your own jobs.'}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Group 2: Employer */}
                          <Box
                            sx={{
                              backgroundColor: 'rgb(255 252 230)', // ✅ soft yellow background for employer group
                              border: '1px solid rgba(0,0,0,0.08)',
                              borderRadius: 2,
                              p: 0,
                              boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                            }}
                          >
                            <Box
                              sx={{
                                borderRadius: 1.5,
                                backgroundColor:
                                  role === 'Employer' ? 'rgb(255 249 200)' : 'transparent',
                                transition: 'background-color 0.2s ease',
                                p: 1,
                              }}
                            >
                              <FormControlLabel
                                value="Employer"
                                control={<Radio sx={{ p: '0px 0px 0px 7px' }} size="medium" />}
                                label={
                                  <Typography
                                    sx={{ fontWeight: 600, fontSize: '1rem', opacity: 0.85 }}
                                  >
                                    {t('employerLabel')}
                                  </Typography>
                                }
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 2, fontSize: '0.775rem', lineHeight: 1.4 }}
                              >
                                {t('registerMessageEmployer')}
                              </Typography>
                            </Box>
                          </Box>
                        </RadioGroup>
                      </FormControl>

                      {/* Name */}
                      <TextField
                        label={t('name')}
                        size="small"
                        type="text"
                        placeholder={t('enterName')}
                        value={name}
                        onChange={e => {
                          const input = e.target.value;

                          // ✅ Remove any character that is NOT letter, space, dot, apostrophe, or hyphen
                          const cleanedInput = input.replace(/[^a-zA-Z\s.'-]/g, '');

                          setName(cleanedInput);
                        }}
                        error={!/^[a-zA-Z\s.'-]*$/.test(name)}
                        helperText={
                          !/^[a-zA-Z\s.'-]*$/.test(name)
                            ? t('Name cannot contain numbers or special characters')
                            : ''
                        }
                        fullWidth
                        variant="outlined"
                        required
                      />

                      {/* Phone Input - OTP verification disabled */}
                      <TextField
                        label={t('phone')}
                        size="small"
                        type="number"
                        placeholder={t('enterPhone')}
                        value={phone}
                        onChange={e => {
                          const value = e.target.value;
                          if (value.length <= 10) setPhone(value); // limit to 10 digits
                        }}
                        variant="outlined"
                        required
                        fullWidth
                        sx={{ mt: 1, mb: 1 }}
                      />

                      {/* OTP Button - Commented Out
                      <Box display="flex" gap={2} alignItems="center" mt={1} mb={1}>
                        <TextField
                          label={t('phone')}
                          size="small"
                          type="number"
                          placeholder={t('enterPhone')}
                          value={phone}
                          onChange={e => {
                            const value = e.target.value;
                            if (value.length <= 10) setPhone(value); // limit to 10 digits
                          }}
                          variant="outlined"
                          required
                          sx={{ flex: 1 }}
                        />

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleVerifyPhone}
                          disabled={phone.length !== 10 || isCooldown}
                        >
                          {isCooldown ? `${t('Verify OTP in')} ${cooldownTimer}s` : t('verify')}
                        </Button>
                      </Box>
                      */

                      {/* OTP Input - Commented Out
                      {showOtpField && (
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'green',
                              fontWeight: 500,
                              mt: 0.5,
                              mb: 0.5,
                            }}
                          >
                            {t('checkotp')}
                          </Typography>

                          <TextField
                            label="Enter OTP"
                            type="number"
                            size="small"
                            value={enteredOtp}
                            onChange={handleOtpChange}
                            fullWidth
                            required
                            error={enteredOtp && !isOtpVerified}
                            helperText={enteredOtp && !isOtpVerified ? 'Incorrect OTP' : ''}
                          />
                        </>
                      )}
                      </>
                      */
                  )}# crm
