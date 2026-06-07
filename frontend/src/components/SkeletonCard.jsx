import API_BASE from '../config';
import './SkeletonCard.css';

function SkeletonCard() {
  void API_BASE;
  return (
    <div className="skeleton-card">
      <div className="skeleton-top">
        <div className="skeleton-shape skeleton-circle" />
        <div className="skeleton-lines">
          <div className="skeleton-shape skeleton-line wide" />
          <div className="skeleton-shape skeleton-line short" />
        </div>
      </div>
      <div className="skeleton-shape skeleton-line full" />
      <div className="skeleton-shape skeleton-line medium" />
      <div className="skeleton-bottom">
        <div className="skeleton-shape skeleton-pill" />
        <div className="skeleton-shape skeleton-pill small" />
      </div>
    </div>
  );
}

export default SkeletonCard;
