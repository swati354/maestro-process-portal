# Maestro Process Portal

A comprehensive web application for viewing and managing UiPath Maestro processes, their instances, BPMN diagrams, and execution history. Built with React, TypeScript, and Cloudflare Workers for enterprise-grade performance and scalability.

[cloudflarebutton]

## Features

- **Process Management**: Browse and monitor Maestro process orchestrations
- **Instance Monitoring**: View detailed process instances with real-time status updates
- **BPMN Visualization**: Interactive BPMN diagram viewer with execution tracking
- **Execution History**: Comprehensive execution logs and run history
- **Instance Control**: Pause, resume, and cancel process instances
- **Real-time Updates**: Live status monitoring with automatic refresh
- **Responsive Design**: Modern, mobile-first interface with dark/light theme support

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom design system
- **shadcn/ui** - High-quality, accessible UI components
- **React Query** - Powerful data fetching and caching
- **React Router 6** - Client-side routing
- **Framer Motion** - Smooth animations and transitions

### Backend
- **Cloudflare Workers** - Edge computing platform
- **Hono** - Fast, lightweight web framework
- **Durable Objects** - Stateful serverless computing
- **TypeScript** - End-to-end type safety

### UiPath Integration
- **UiPath SDK** - Official TypeScript SDK for UiPath services
- **Maestro API** - Process orchestration and management
- **BPMN Viewer** - Interactive process diagram visualization

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- UiPath Orchestrator access with Maestro processes
- Cloudflare account (for deployment)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd maestro-process-port-zmdjbqmaddf4y0t1tnuqh
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment variables**
   
   Copy the `.env` file and update with your UiPath credentials:
   ```bash
   cp .env .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   VITE_UIPATH_BASE_URL=https://your-orchestrator-url.com
   VITE_UIPATH_ORG_NAME=your-organization
   VITE_UIPATH_TENANT_NAME=your-tenant
   VITE_UIPATH_FOLDER_KEY=your-folder-key
   VITE_UIPATH_ACCESS_TOKEN=your-access-token
   ```

4. **Start the development server**
   ```bash
   bun run dev
   ```

The application will be available at `http://localhost:3000`.

## Usage

### Viewing Processes

1. **Process List**: The home page displays all available Maestro processes with status counts and metadata
2. **Process Selection**: Click on any process card to view its instances
3. **Instance Monitoring**: Browse all instances for the selected process with real-time status updates

### Instance Management

1. **Instance Details**: Click on any instance to view comprehensive details including:
   - Instance metadata and execution information
   - Interactive BPMN diagram with current execution state
   - Complete execution history and run logs
   - Global variables and process context

2. **Instance Control**: Use the action buttons to:
   - **Pause**: Temporarily halt a running instance
   - **Resume**: Continue a paused instance
   - **Cancel**: Terminate an instance permanently

### BPMN Diagrams

- View interactive process diagrams with zoom and pan capabilities
- Track execution progress with visual indicators
- Export or view raw BPMN XML source

## Development

### Project Structure

```
src/
├── components/
│   ├── maestro/          # Maestro-specific components
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components
├── hooks/
│   └── useUiPathMaestro.ts  # React Query hooks for UiPath API
├── lib/
│   └── uipath.ts         # UiPath SDK configuration
├── pages/
│   └── HomePage.tsx      # Main application page
└── main.tsx              # Application entry point

worker/
├── index.ts              # Worker entry point
├── userRoutes.ts         # API routes
└── durableObject.ts      # Stateful storage
```

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint
- `bun run deploy` - Deploy to Cloudflare Workers

### Adding New Features

1. **API Integration**: Add new UiPath API calls in `src/hooks/useUiPathMaestro.ts`
2. **UI Components**: Create new components in `src/components/maestro/`
3. **Backend Routes**: Add API endpoints in `worker/userRoutes.ts`
4. **State Management**: Use React Query for server state, React hooks for local state

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Code formatting (via ESLint integration)
- **Import Organization**: Automatic import sorting and organization

## Deployment

### Cloudflare Workers

[cloudflarebutton]

**Manual Deployment:**

1. **Install Wrangler CLI**
   ```bash
   bun add -g wrangler
   ```

2. **Authenticate with Cloudflare**
   ```bash
   wrangler login
   ```

3. **Deploy to Cloudflare Workers**
   ```bash
   bun run deploy
   ```

### Environment Variables

Set the following environment variables in your Cloudflare Workers dashboard:

- `VITE_UIPATH_BASE_URL`
- `VITE_UIPATH_ORG_NAME`
- `VITE_UIPATH_TENANT_NAME`
- `VITE_UIPATH_FOLDER_KEY`
- `VITE_UIPATH_ACCESS_TOKEN`

### Custom Domain

Configure a custom domain in the Cloudflare Workers dashboard for production deployments.

## Configuration

### UiPath Setup

1. **Access Token**: Generate a service account token in UiPath Orchestrator
2. **Folder Permissions**: Ensure the token has access to Maestro processes
3. **API Permissions**: Required scopes:
   - `OrchestratorApiUserAccess`
   - Maestro process read/write permissions

### Customization

- **Themes**: Modify `src/index.css` for custom color schemes
- **Components**: Extend `src/components/ui/` for custom UI elements
- **API Endpoints**: Add custom routes in `worker/userRoutes.ts`

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify UiPath credentials in environment variables
   - Check token expiration and permissions

2. **BPMN Diagram Loading**
   - Ensure process instances have associated BPMN data
   - Check browser console for specific error messages

3. **Real-time Updates**
   - Verify network connectivity to UiPath Orchestrator
   - Check React Query cache configuration

### Debug Mode

Enable debug logging by setting:
```env
VITE_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the UiPath documentation for API-related questions
- Review Cloudflare Workers documentation for deployment issues