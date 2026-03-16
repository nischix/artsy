'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge as MuiBadge, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const cartItemsCount = useSelector((state: RootState) => state.cart.length);

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          href="/" 
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold', letterSpacing: 1 }}
        >
          Artsy
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button component={Link} href="/explore" color="inherit">
            Explore
          </Button>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton color="inherit" component={Link} href="/cart">
              <MuiBadge badgeContent={cartItemsCount} color="error">
                <ShoppingCartIcon />
              </MuiBadge>
            </IconButton>
          </motion.div>

          <Button component={Link} href="/login" variant="outlined" color="inherit">
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};