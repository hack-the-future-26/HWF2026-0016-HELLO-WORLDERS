import { ScamAnalysisResult, ScamSignal, ScamSeverity } from '../types';
import { api } from './api';

/**
 * Scam & Safety Check Service
 *
 * Runs both client-side heuristics (instant, no network) AND calls the
 * backend /scam-check endpoint (async). Results are merged so the frontend
 * shows comprehensive warnings.
 */
class ScamService {
  // -----------------------------------------------------------------------
  // Synchronous client-side analysis (used for real-time form feedback)
  // -----------------------------------------------------------------------
  public analyzeListing(
    title: string,
    description: string,
    price: number,
    category: string,
  ): ScamAnalysisResult {
    const text = `${title} ${description}`.toLowerCase();
    const signals: ScamSignal[] = [];

    // 1. Off-platform payment indicators
    const offPlatformKeywords = [
      'gift card', 'google play card', 'apple gift card',
      'wire transfer', 'western union', 'crypto', 'bitcoin',
      'telegram', 't.me', 'whatsapp', 'zelle me first',
      'send deposit', 'venmo before meeting', 'cashapp deposit',
    ];
    for (const kw of offPlatformKeywords) {
      if (text.includes(kw)) {
        signals.push({
          severity: 'danger',
          title: 'Off-Platform Payment or Contact Request Detected',
          description: `The listing mentions "${kw}". Scammers frequently ask for advance deposits or gift cards.`,
          advice:
            'Never send advance deposits or off-platform payments. Complete exchanges in person at a campus safe zone.',
        });
        break;
      }
    }

    // 2. Suspicious external URLs
    const urlPattern = /(https?:\/\/[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+)/gi;
    if (urlPattern.test(text)) {
      signals.push({
        severity: 'warning',
        title: 'External Link in Description',
        description: 'Listing contains an external web link or URL shortener.',
        advice: 'Avoid opening unfamiliar external links that could lead to phishing websites.',
      });
    }

    // 3. High-urgency pressure language
    const urgencyKeywords = [
      'must sell today or throwing out',
      'need gone in 1 hour',
      'urgent moving sale today only',
      'immediate transfer needed',
      'first one to transfer cash gets it',
    ];
    for (const kw of urgencyKeywords) {
      if (text.includes(kw)) {
        signals.push({
          severity: 'info',
          title: 'High-Urgency Phrasing Detected',
          description: 'The description uses high-pressure language urging immediate action.',
          advice: 'Take your time to review the seller profile and confirm meeting details in daylight.',
        });
        break;
      }
    }

    // 4. Off-campus courier / shipping claims
    const shippingKeywords = [
      'my uncle will ship',
      'will send courier',
      'deliver to your house',
      'out of town right now',
      'currently deployed',
      'shipping company will contact you',
    ];
    for (const kw of shippingKeywords) {
      if (text.includes(kw)) {
        signals.push({
          severity: 'warning',
          title: 'Unusual Delivery / Remote Shipping Offer',
          description:
            'The listing mentions remote shipping or courier delivery rather than local student exchange.',
          advice:
            'Campus-Thrift is designed for local student handoffs. Avoid remote delivery arrangements.',
        });
        break;
      }
    }

    // 5. Price anomaly heuristic
    if ((category === 'electronics' || category === 'bicycles') && price > 0 && price <= 10) {
      signals.push({
        severity: 'warning',
        title: 'Unusually Low Price for Category',
        description: `Price ($${price}) is unusually low for ${category}. Could be for parts, a replica, or a demo listing.`,
        advice: 'Test device functionality or mechanical condition in person before paying.',
      });
    }

    return this.buildResult(signals);
  }

  // -----------------------------------------------------------------------
  // Async full analysis — client heuristics + backend /scam-check merged
  // -----------------------------------------------------------------------
  public async analyzeListingFull(
    title: string,
    description: string,
    price: number,
    category: string,
  ): Promise<ScamAnalysisResult> {
    // Run client-side immediately
    const clientResult = this.analyzeListing(title, description, price, category);

    // Call backend
    try {
      const res = await api.post<{
        success: boolean;
        risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
        risk_score: number;
        warnings: string[];
      }>('/scam-check', { title, description, price });

      if (res.success && res.warnings.length > 0) {
        const backendSignals: ScamSignal[] = res.warnings.map((w) => ({
          severity:
            res.risk_level === 'HIGH'
              ? 'danger'
              : res.risk_level === 'MEDIUM'
              ? 'warning'
              : 'info',
          title: 'Safety Flag from Campus Thrift AI',
          description: w,
          advice: 'Review this listing carefully before making any payment.',
        }));

        // Merge — deduplicate by description text
        const merged = [...clientResult.signals];
        for (const bs of backendSignals) {
          const alreadyPresent = merged.some(
            (s) => s.description.toLowerCase() === bs.description.toLowerCase(),
          );
          if (!alreadyPresent) merged.push(bs);
        }

        return this.buildResult(merged);
      }
    } catch {
      // Backend unavailable — return client-side result only
    }

    return clientResult;
  }

  private buildResult(signals: ScamSignal[]): ScamAnalysisResult {
    let maxSeverity: ScamSeverity = 'info';
    if (signals.some((s) => s.severity === 'danger')) maxSeverity = 'danger';
    else if (signals.some((s) => s.severity === 'warning')) maxSeverity = 'warning';

    return {
      hasWarning: signals.length > 0,
      maxSeverity,
      signals,
    };
  }
}

export const scamService = new ScamService();
