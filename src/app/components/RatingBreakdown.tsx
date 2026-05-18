import { Star } from 'lucide-react';
import { ReviewData } from './ReviewForm';

interface RatingBreakdownProps {
  reviews: ReviewData[];
}

export function RatingBreakdown({ reviews }: RatingBreakdownProps) {
  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length
    : 0;

  // Calculate star distribution
  const starCounts = {
    5: reviews.filter(r => r.overallRating === 5).length,
    4: reviews.filter(r => r.overallRating === 4).length,
    3: reviews.filter(r => r.overallRating === 3).length,
    2: reviews.filter(r => r.overallRating === 2).length,
    1: reviews.filter(r => r.overallRating === 1).length
  };

  const getPercentage = (count: number) => {
    return reviews.length > 0 ? (count / reviews.length) * 100 : 0;
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-5 h-5">
            <Star className="absolute inset-0 w-5 h-5 text-slate-300" />
            <div className="absolute inset-0 w-1/2 overflow-hidden">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-5 h-5 text-slate-300 dark:text-slate-600" />
        );
      }
    }

    return stars;
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Rating Overview</h3>

      {/* Overall Rating */}
      <div className="flex items-start gap-6 mb-8">
        <div className="text-center">
          <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            {renderStars(averageRating)}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Star Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm text-slate-700 dark:text-slate-300">{stars}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>

              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                  style={{ width: `${getPercentage(starCounts[stars as keyof typeof starCounts])}%` }}
                />
              </div>

              <span className="text-sm text-slate-600 dark:text-slate-400 w-12 text-right">
                {starCounts[stars as keyof typeof starCounts]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Averages (if available) */}
      {reviews.some(r => r.categoryRatings) && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
            Category Ratings
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {getCategoryAverages(reviews).map(({ category, average }) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                  {category.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= Math.round(average)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {average.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getCategoryAverages(reviews: ReviewData[]): { category: string; average: number }[] {
  const allCategories = new Set<string>();
  const categorySums: { [key: string]: { total: number; count: number } } = {};

  // Collect all category ratings
  reviews.forEach(review => {
    if (review.categoryRatings) {
      Object.entries(review.categoryRatings).forEach(([category, rating]) => {
        allCategories.add(category);
        if (!categorySums[category]) {
          categorySums[category] = { total: 0, count: 0 };
        }
        categorySums[category].total += rating;
        categorySums[category].count += 1;
      });
    }
  });

  // Calculate averages
  return Array.from(allCategories).map(category => ({
    category,
    average: categorySums[category].total / categorySums[category].count
  })).sort((a, b) => b.average - a.average);
}
