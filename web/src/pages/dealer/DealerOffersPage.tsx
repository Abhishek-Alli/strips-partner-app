/**
 * Dealer Offers Page (Web)
 * 
 * View and like/bookmark offers
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { webDealerService } from '../../services/dealer/dealerService';
import { webBusinessService } from '../../services/business/businessService';
import { apiClient } from '../../services/apiClient';
import { Offer } from '../../../../shared/types/business.types';
import { DealerOffer } from '../../../../shared/types/dealer.types';
import { logger } from '../../core/logger';

const DealerOffersPage: React.FC = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [likedOffers, setLikedOffers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [allOffers, dealerOffers] = await Promise.all([
        webBusinessService.getOffers({ applicableTo: 'dealers' }),
        webDealerService.getDealerOffers(user.id),
      ]);
      setOffers(allOffers);
      const likedSet = new Set(dealerOffers.filter(o => o.isLiked).map(o => o.offerId));
      setLikedOffers(likedSet);
    } catch (error) {
      logger.error('Failed to load offers', error as Error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleLike = async (offerId: string) => {
    if (!user?.id) return;
    try {
      await webDealerService.likeOffer(user.id, offerId);
      const newLikedOffers = new Set(likedOffers);
      if (newLikedOffers.has(offerId)) {
        newLikedOffers.delete(offerId);
      } else {
        newLikedOffers.add(offerId);
      }
      setLikedOffers(newLikedOffers);
    } catch (error) {
      logger.error('Failed to like offer', error as Error);
    }
  };

  const getDiscountText = (offer: Offer) => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF`;
    } else if (offer.discountType === 'fixed') {
      return `₹${offer.discountValue} OFF`;
    }
    return 'Special Offer';
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
        <Box sx={{ p: 3 }}>Loading...</Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Offers & Discounts
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {likedOffers.size} liked offers
        </Typography>

        {offers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" color="text.secondary">
              No offers available at the moment
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {offers.map((offer) => {
              const isLiked = likedOffers.has(offer.id);
              const isValid = new Date(offer.validUntil) >= new Date();

              return (
                <Grid item xs={12} sm={6} md={4} key={offer.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Typography variant="h6" component="div">
                          {offer.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleLike(offer.id)}
                          color={isLiked ? 'error' : 'default'}
                        >
                          {isLiked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
                        </IconButton>
                      </Box>
                      <Chip
                        label={getDiscountText(offer)}
                        color="primary"
                        size="small"
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {offer.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                      </Typography>
                      {!isValid && (
                        <Chip label="Expired" color="default" size="small" sx={{ ml: 1 }} />
                      )}
                    </CardContent>
                    <CardActions>
                      <Button size="small" disabled={!isValid}>
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </ProtectedRoute>
  );
};

export default DealerOffersPage;

