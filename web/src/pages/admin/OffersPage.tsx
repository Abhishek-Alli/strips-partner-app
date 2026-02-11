/**
 * Offers and Discounts CMS Page
 */

import React from 'react';
import CMSContentPage from './CMSContentPage';

const OffersPage: React.FC = () => {
  return (
    <CMSContentPage
      contentType="offers"
      title="Offers and Discounts"
      apiEndpoint="/admin/cms/offers"
    />
  );
};

export default OffersPage;
