/**
 * Seed Dealer Data
 * 
 * Populate master products and sample dealer data
 */

import { query } from '../config/database.js';

const seedDealerData = async () => {
  try {
    console.log('Seeding dealer data...');

    // Insert master products
    const masterProducts = [
      { name: 'Cement (OPC 53 Grade)', category: 'Cement', unit: 'Bag' },
      { name: 'Steel TMT Bars', category: 'Steel', unit: 'Ton' },
      { name: 'Sand (River)', category: 'Aggregates', unit: 'Cubic Meter' },
      { name: 'Aggregate (20mm)', category: 'Aggregates', unit: 'Cubic Meter' },
      { name: 'Bricks (Red)', category: 'Bricks', unit: 'Piece' },
      { name: 'Cement (PPC)', category: 'Cement', unit: 'Bag' },
      { name: 'Steel TMT Bars (Fe 500)', category: 'Steel', unit: 'Ton' },
      { name: 'Sand (M-Sand)', category: 'Aggregates', unit: 'Cubic Meter' },
    ];

    for (const product of masterProducts) {
      await query(
        `INSERT INTO master_products (name, category, unit, is_active)
         VALUES ($1, $2, $3, true)
         ON CONFLICT DO NOTHING`,
        [product.name, product.category, product.unit]
      );
    }

    // Get dealer user ID
    const dealerResult = await query(
      "SELECT id FROM users WHERE role = 'DEALER' LIMIT 1"
    );

    if (dealerResult.rows.length > 0) {
      const dealerId = dealerResult.rows[0].id;

      // Get some master products
      const productsResult = await query(
        'SELECT id, name FROM master_products WHERE is_active = true LIMIT 3'
      );

      // Add sample dealer products
      for (const product of productsResult.rows) {
        await query(
          `INSERT INTO dealer_products (dealer_id, product_id, product_name, price, unit, status)
           VALUES ($1, $2, $3, $4, $5, 'active')
           ON CONFLICT (dealer_id, product_id) DO NOTHING`,
          [dealerId, product.id, product.name, Math.floor(Math.random() * 1000) + 100, 'INR']
        );
      }
    }

    console.log('✅ Dealer data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding dealer data failed:', error);
    process.exit(1);
  }
};

seedDealerData();






