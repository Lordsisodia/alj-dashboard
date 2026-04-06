// WebinarsReplayList - renders a list of webinar replay items.

import type { WebinarReplay } from './data/webinars';

interface Props {
  replays: WebinarReplay[];
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
        <path d="M5 10L10 5L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" d="M6.66 4.8v.9h10.8V3.9H6.66v.9Zm12.6 1.8h-.9v1.8h1.8V6.6h-.9Zm0 1.8h-.9v9h1.8v-9h-.9Zm-1.8 10.8v-.9H6.66v1.8h10.8v-.9Zm-12.6-1.8h.9v-9h-1.8v9h.9Zm0-9h.9V6.6h-1.8v1.8h.9Zm0 0v.9h14.4V7.5H4.86v.9Zm1.8 10.8v-.9a.9.9 0 0 1-.9-.9h-1.8a2.7 2.7 0 0 0 2.7 2.7v-.9Zm12.6-1.8h-.9c0 .5-.4.9-.9.9v1.8c1.5 0 2.7-1.2 2.7-2.7h-.9Zm-1.8-12.6v.9c.5 0 .9.4.9.9h1.8c0-1.5-1.2-2.7-2.7-2.7v.9Zm-10.8 0v-.9a2.7 2.7 0 0 0-2.7 2.7h1.8c0-.5.4-.9.9-.9v-.9Z" />
    </svg>
  );
}

export default function WebinarsReplayList({ replays }: Props) {
  return (
    <div role="list" className="fireside-replay-list w-dyn-items">
      {replays.map((replay, idx) => (
        <div key={idx} role="listitem" className="fireside-replay-item w-dyn-item">
          {/* Thumbnail */}
          <img
            className="fireside-replay-thumbnail"
            src={replay.thumbnail}
            width={162}
            height={92}
            alt=""
            loading="lazy"
          />

          {/* Content */}
          <div className="fireside-replay-list-content">
            {/* Author + date */}
            <div className="fireside-event-details-wrapper event-details-left flex-row">
              <div className="fireside-event-detail-item">
                <div
                  className="fireside-event-author-headshot"
                  style={{ backgroundImage: `url('${replay.authorHeadshot}')` }}
                />
                <div className="text-alpha-50">
                  <div className="text-label-s">{replay.authorName}</div>
                </div>
              </div>
              {replay.date && (
                <div className="fireside-event-detail-item">
                  <div className="icon-24 w-embed"><CalendarIcon /></div>
                  <div className="text-alpha-50">
                    <div className="text-label-s">{replay.date}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="text-white">
              <div className="text-label-m line-clamp-2">{replay.title}</div>
            </div>
          </div>

          {/* Watch button */}
          <div className="fireside-replay-list-button">
            <a href={replay.href} className="button-dark button-secondary w-inline-block">
              <div className="button-text-block">
                <div className="text-heading-m">Watch</div>
              </div>
              <div className="button-icon-block icon-right">
                <div className="icon-24">
                  <div className="svg w-embed"><ChevronIcon /></div>
                </div>
              </div>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
