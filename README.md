# Almena ID Documentation

Public documentation for Almena ID - a decentralized identity platform.

## Documentation Purpose

This documentation is for:
- **Users**: Learn how to use Almena ID
- **Integrators**: Learn how to integrate Almena ID into your applications

This documentation is **NOT** for:
- Internal development setup (see module READMEs)
- Contributing to Almena ID codebase
- Internal architecture details

## Structure

See [DOCUMENTATION_STRUCTURE.md](./DOCUMENTATION_STRUCTURE.md) for a complete overview of the documentation organization.

### For Users
Documentation on how to **use** Almena ID:
- Getting started with your identity wallet
- Managing your DID and keys
- Security best practices
- Troubleshooting

### For Integrators
Documentation on how to **integrate** Almena ID:
- API reference and endpoints
- Authentication patterns
- Integration examples
- SDK documentation
- Best practices

## Local Development

### Prerequisites
- Node.js >= 20.0.0
- Yarn

### Installation

```bash
yarn install
```

### Start Development Server

```bash
yarn start
```

Documentation will be available at `http://localhost:3001`

### Build

```bash
yarn build
```

Static files will be generated in the `build/` directory.

## Docker

### Build Image

```bash
docker build -t almena-docs .
```

### Run Container

```bash
docker compose up
```

Documentation will be available at `http://localhost:3001`

## Documentation Guidelines

### Language
- **All documentation MUST be in English**
- No exceptions

### Content Focus
- **Users**: How to USE features (non-technical)
- **Integrators**: How to INTEGRATE (technical, but not internal)
- **Never**: Internal implementation details or development setup

### Structure
- Keep pages focused and concise (under 500 lines)
- Use subfolders to organize related content
- Cross-link related pages
- Include code examples that work

### When to Update
Update documentation when:
- Adding new user-facing features
- Adding new API endpoints
- Changing how features work
- Adding integration patterns

### Critical Rule
**ONLY document what is actually implemented and working.**

Never document planned features, future APIs, or functionality that doesn't exist yet (unless clearly marked in a separate "Coming Soon" section).

## Contributing

To contribute documentation improvements:
1. Make changes in `docs/` folder
2. Test locally with `yarn start`
3. Ensure all links work
4. Submit pull request

## Technology

- **Framework**: Docusaurus 3.x
- **Language**: TypeScript + MDX
- **Styling**: CSS
- **Deployment**: Static site (can deploy anywhere)

## Links

- **Live Documentation**: https://docs.almena.id
- **Main Project**: https://github.com/almena-id/almena-id
- **Website**: https://almena.id

## Support

For documentation issues:
- Email: docs@almena.id
- GitHub Issues: https://github.com/almena-id/docs/issues
