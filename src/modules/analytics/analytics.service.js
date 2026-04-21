import { prisma } from '../../lib/prisma.js';
import { subDays, startOfDay, format } from 'date-fns';

export const getOverview = async (merchantId) => {
  const sevenDaysAgo = startOfDay(subDays(new Date(), 7));

  // 1. Get Core Analytics Counts (Last 7 Days)
  const eventLogs = await prisma.analytics.findMany({
    where: {
      merchantId,
      createdAt: { gte: sevenDaysAgo }
    }
  });

  // 2. Get Product Snapshot (For the leaderboard)
  const products = await prisma.product.findMany({
    where: { merchantId },
    select: {
      id: true,
      name: true,
      viewCount: true,
      arViewCount: true,
      modelUrl: true,
    }
  });

  // 3. Process Time-Series for Charts
  const timeSeries = {};
  for (let i = 0; i < 7; i++) {
    const date = format(subDays(new Date(), i), 'MMM dd');
    timeSeries[date] = { date, views: 0, arViews: 0 };
  }

  // 4. Calculate Live stats from Logs
  const productLiveStats = {};
  const featureInterest = {};
  
  eventLogs.forEach(log => {
    const date = format(log.createdAt, 'MMM dd');
    if (timeSeries[date]) {
      if (log.type === 'VIEW') timeSeries[date].views++;
      if (log.type === 'AR_VIEW') timeSeries[date].arViews++;
    }

    if (!productLiveStats[log.productId]) {
      productLiveStats[log.productId] = { views: 0, arViews: 0 };
    }
    if (log.type === 'VIEW') productLiveStats[log.productId].views++;
    if (log.type === 'AR_VIEW') productLiveStats[log.productId].arViews++;
    
    // Track Hotspot Feature Interest
    if (log.type === 'HOTSPOT_CLICK' && log.metadata?.title) {
       if (!featureInterest[log.metadata.title]) {
           featureInterest[log.metadata.title] = { 
               clicks: 0, 
               productId: log.productId
           };
       }
       featureInterest[log.metadata.title].clicks++;
    }
  });

  // Aggregate All-Time (Products + Logs)
  const totalViews = products.reduce((sum, p) => sum + p.viewCount, 0) + eventLogs.filter(l => l.type === 'VIEW').length;
  const totalArViews = products.reduce((sum, p) => sum + p.arViewCount, 0) + eventLogs.filter(l => l.type === 'AR_VIEW').length;
  
  const rawEngagement = totalViews > 0 ? (totalArViews / totalViews) * 100 : 0;
  const arEngagementRate = Math.min(100, Math.round(rawEngagement));

  return {
    stats: {
      totalProducts: products.length,
      totalViews,
      totalArViews,
      arEngagementRate,
    },
    chartData: Object.values(timeSeries).reverse(),
    topProducts: products
      .map((p) => ({
        name: p.name,
        hasModel: !!p.modelUrl,
        totalViewCount: p.viewCount + (productLiveStats[p.id]?.views || 0),
        totalArViewCount: p.arViewCount + (productLiveStats[p.id]?.arViews || 0)
      }))
      .sort((a, b) => (b.totalViewCount + b.totalArViewCount) - (a.totalViewCount + a.totalArViewCount))
      .slice(0, 5),
    topFeatures: Object.entries(featureInterest)
      .map(([feature, data]) => ({
         feature,
         clicks: data.clicks,
         productName: products.find(p => p.id === data.productId)?.name || 'Unknown'
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
  };
};

export const getProductAnalytics = async (merchantId) => {
  return await prisma.product.findMany({
    where: { merchantId },
    select: {
      id: true,
      name: true,
      viewCount: true,
      arViewCount: true
    },
    orderBy: { viewCount: 'desc' }
  });
};
