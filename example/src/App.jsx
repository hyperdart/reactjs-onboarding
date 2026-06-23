import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';
import { Onboarding, OnboardingItem } from 'reactjs-onboarding';

const theme = createTheme({
  palette: {
    primary: { main: '#6366F1' },
    background: { default: '#F7F8FC', paper: '#FFFFFF' },
    text: { primary: '#1A1B2E', secondary: '#64748B' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { border: '1px solid #E2E8F0' } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' } },
    },
  },
});

const stats = [
  { value: '12K+', label: 'Active Users' },
  { value: '4.9★', label: 'Avg Rating' },
  { value: '99.9%', label: 'Uptime' },
];

const features = [
  {
    icon: '🎯',
    title: 'Element Targeting',
    desc: 'Highlight any DOM element by ID, ref, or screen coordinate for precise guidance.',
  },
  {
    icon: '📐',
    title: 'Auto Placement',
    desc: 'Tooltips automatically reposition to stay fully visible inside the viewport.',
  },
  {
    icon: '⌨️',
    title: 'Keyboard Navigation',
    desc: 'Arrow keys, Enter, and Escape all work out of the box — no extra config.',
  },
];

const codeSnippet = `import { Onboarding, OnboardingItem } from 'reactjs-onboarding';

<Onboarding name="my-tour">
  <OnboardingItem elementID="nav" message="Start here." />
  <OnboardingItem elementID="dashboard" message="Your overview." />
</Onboarding>`;

function App() {
  const handleRestart = () => Onboarding.reset();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Onboarding name="demo">
        <OnboardingItem
          elementID="topbar"
          message="This is the navigation bar. Hit Restart Tour any time to replay the walkthrough from the beginning."
        />
        <OnboardingItem
          elementID="hero"
          message="Welcome! The tour auto-starts on first visit and saves its state in localStorage so it only shows once."
        />
        <OnboardingItem
          elementID="stats-row"
          message="Key metrics at a glance — each card can be targeted independently by its element ID."
        />
        <OnboardingItem
          elementID="features-grid"
          message="The three core capabilities. Each step can spotlight any element anywhere on the page."
        />
        <OnboardingItem
          elementID="code-block"
          message="Drop this snippet into your app and you're done. The library handles positioning, keyboard nav, and persistence."
        />
      </Onboarding>

      {/* Nav */}
      <AppBar id="topbar" position="sticky">
        <Toolbar>
          <Typography variant="h6" color="primary" sx={{ flexGrow: 1, letterSpacing: '-0.3px' }}>
            OnboardKit
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Button
              size="small"
              sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Docs
            </Button>
            <Button
              size="small"
              sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' } }}
            >
              GitHub
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={handleRestart}
              sx={{ ml: { xs: 0, sm: 1 } }}
            >
              Restart Tour
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 5, md: 10 } }}>
        {/* Hero */}
        <Box id="hero" sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <Chip
            label="Powered by reactjs-onboarding"
            variant="outlined"
            color="primary"
            size="small"
            sx={{ mb: { xs: 2, md: 3 }, fontWeight: 600 }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
              lineHeight: 1.15,
              letterSpacing: { xs: '-0.5px', md: '-1.5px' },
              mb: 2.5,
            }}
          >
            Guide users<br />from day one
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.7,
              maxWidth: 420,
              mx: 'auto',
              mb: { xs: 3, md: 5 },
            }}
          >
            A lightweight React library for product tours, feature walkthroughs,
            and contextual hints — zero dependencies.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              disableElevation
              onClick={handleRestart}
              sx={{ px: 4, width: { xs: '100%', sm: 'auto' } }}
            >
              Start Demo Tour
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ px: 4, width: { xs: '100%', sm: 'auto' } }}
            >
              View Docs
            </Button>
          </Stack>
        </Box>

        {/* Stats */}
        <Box
          id="stats-row"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
            mb: { xs: 6, md: 10 },
          }}
        >
          {stats.map((s) => (
            <Card key={s.label} sx={{ textAlign: 'center', py: { xs: 3, md: 4 } }}>
              <Typography
                variant="h4"
                fontWeight={800}
                color="primary"
                sx={{ letterSpacing: '-0.5px', mb: 0.5 }}
              >
                {s.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {s.label}
              </Typography>
            </Card>
          ))}
        </Box>

        {/* Features */}
        <Box id="features-grid" sx={{ mb: { xs: 6, md: 10 } }}>
          <Typography variant="h5" sx={{ letterSpacing: '-0.3px', mb: 3 }}>
            Core Features
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            {features.map((f) => (
              <Card key={f.title}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Typography variant="h4" sx={{ mb: 1.5 }}>{f.icon}</Typography>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.75 }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {f.desc}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Code snippet */}
        <Box id="code-block">
          <Typography variant="h5" sx={{ letterSpacing: '-0.3px', mb: 1 }}>
            Quick Start
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Install the package and drop in the snippet below.
          </Typography>
          <Box sx={{ bgcolor: '#1A1B2E', borderRadius: 3, overflow: 'hidden' }}>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Stack direction="row" spacing={0.75}>
                {['#FF5F57', '#FFBD2E', '#28C840'].map((c) => (
                  <Box key={c} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c }} />
                ))}
              </Stack>
              <Typography
                variant="caption"
                sx={{ ml: 'auto', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}
              >
                App.jsx
              </Typography>
            </Stack>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: { xs: 2, md: 3 },
                color: '#A5B4FC',
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                fontSize: { xs: '0.78rem', md: '0.85rem' },
                lineHeight: 1.7,
                overflowX: 'auto',
              }}
            >
              {codeSnippet}
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Divider />
      <Box sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          reactjs-onboarding · MIT License
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
