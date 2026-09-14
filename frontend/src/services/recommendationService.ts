import { Product, Recommendation } from '../types';
import { productService } from './productService';

/**
 * Frontend Heuristic Recommendation Service
 * 
 * NOTE: This is a frontend-only heuristic engine, NOT an external AI model.
 * It uses client-side signals (recently viewed items, saved categories, campus location)
 * to provide explainable recommendations for students.
 */
class RecommendationService {
  // TODO: [Backend Integration] In production, replace with machine learning recommendations endpoint
  public async getRecommendations(): Promise<Recommendation[]> {
    const allProducts = await productService.getProducts();
    const activeProducts = allProducts.filter(p => p.status === 'active');
    const viewedIds = productService.getViewedProductIds();
    const savedIds = productService.getSavedProductIds();

    const recommendations: Recommendation[] = [];

    // Find viewed categories
    const viewedProducts = activeProducts.filter(p => viewedIds.includes(p.id));
    const viewedCategories = new Set(viewedProducts.map(p => p.category));

    // Find saved categories
    const savedProducts = activeProducts.filter(p => savedIds.includes(p.id));
    const savedCategories = new Set(savedProducts.map(p => p.category));

    for (const product of activeProducts) {
      // Don't recommend items already viewed first
      if (viewedIds.slice(0, 2).includes(product.id)) {
        continue;
      }

      let reason = '';
      let score = 50;

      if (viewedCategories.has(product.category)) {
        reason = `Because you recently browsed ${product.category.replace('-', ' ')}`;
        score += 35;
      } else if (savedCategories.has(product.category)) {
        reason = `Matches items in your saved ${product.category.replace('-', ' ')} list`;
        score += 30;
      } else if (product.originalPrice && ((product.originalPrice - product.price) / product.originalPrice) >= 0.6) {
        const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        reason = `Top Student Value: ${discountPct}% off original retail price`;
        score += 25;
      } else if (product.tags.includes('stem') || product.tags.includes('math') || product.tags.includes('textbook')) {
        reason = 'Popular among STEM & Engineering students this week';
        score += 20;
      } else if (product.tags.includes('dorm') || product.tags.includes('appliances')) {
        reason = 'Dorm room essential frequently requested on campus';
        score += 15;
      } else {
        reason = 'Trending student deal on Campus-Thrift';
        score += 10;
      }

      recommendations.push({
        product,
        reason,
        matchScore: score
      });
    }

    // Sort by match score descending and return top 6
    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);
  }
}

export const recommendationService = new RecommendationService();
