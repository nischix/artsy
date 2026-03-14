import FeedGrid from '@/app/components/feed/FeedGrid';
import { Box, Typography, Container } from '@mui/material';

export default function Home() {
  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ pt: 8, pb: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" fontWeight={800} sx={{ mb: 1, letterSpacing: '-0.02em' }}>
          ANTIGRAVITY
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
          Curated Marketplace for the Modern Aesthetic
        </Typography>
      </Box>
      <FeedGrid />
    </Box>
  );
}
