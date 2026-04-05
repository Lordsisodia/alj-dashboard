// CalendarPopup — Floating CTA popup with Cal.com integration and date pills.
// Includes the Cal.com embed initialization and a mini calendar widget.

'use client';

import { useEffect } from 'react';

function DatePill({
  dayOffset,
  isToday,
}: {
  dayOffset: number;
  isToday: boolean;
}) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  const dow = d.toLocaleDateString('en-US', { weekday: 'short' });
  const dom = d.getDate();

  return (
    <a
      data-cal-config='{"layout":"month_view"}'
      data-cal-link="team/foreplay/foreplay-demo-action-plan"
      data-cal-namespace="foreplay-demo-action-plan"
      href="#"
      className={`date-pill w-inline-block${isToday ? ' is-today' : ''}`}
    >
      <div className="dow">{dow}</div>
      <div className="dom">{dom}</div>
    </a>
  );
}

export default function CalendarPopup() {
  useEffect(() => {
    const Cal = (window as any).Cal;
    if (Cal) {
      Cal('init', 'foreplay-demo-action-plan', {
        origin: 'https://app.cal.com',
      });
      Cal.ns['foreplay-demo-action-plan']('ui', {
        theme: 'light',
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    }
  }, []);

  return (
    <footer className="u-footer" style={{ position: 'relative' }}>
      <div className="calendar-popup-wrapper">
        <div className="calendar-pop-up-wrap">
          {/* Trigger */}
          <div className="calendar-pop-up-trigger">
            <div className="calendar-pop-up-trigger-body">
              <div className="calendar-pop-up-headshot">
                <div className="calendar-pop-up-online" />
              </div>
              <div className="calendar-pop-up-text">
                <div className="text-solid-900">
                  <div className="text-label-s">Click Me!</div>
                </div>
                <div className="text-solid-400">
                  <div className="text-body-xs">
                    Free creative strategy action plan
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal */}
          <div className="calendar-pop-up-main pop-from-bl">
            <div className="calendar-pop-up-content">
              <div className="calendar-pop-up-header">
                <div className="calendar-pop-up-headshot">
                  <div className="calendar-pop-up-online" />
                </div>
                <div className="calendar-pop-up-text">
                  <div className="text-solid-900">
                    <div className="text-label-s">Zach Murray</div>
                  </div>
                  <div className="text-solid-400">
                    <div className="text-body-xs">Founder @ ISSO.co</div>
                  </div>
                </div>
                <a href="#" className="cal-pop-up-close w-inline-block">
                  <div className="icon-24">
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.92065 8.11835L16.4207 16.6183M16.4207 8.11835L7.92065 16.6183"
                        stroke="#5E6678"
                        strokeWidth="2.25"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </a>
              </div>

              <div className="calendar-pop-body">
                <div className="calendar-pop-up-text">
                  <div className="text-solid-900">
                    <div className="text-label-s">
                      Free Creative Strategy Action Plan
                    </div>
                  </div>
                  <div className="text-solid-400">
                    <div className="text-body-s">
                      Let&apos;s analyze your top competitors together. Get a
                      clear action plan to start scaling like the top 1%
                      advertisers.
                    </div>
                  </div>
                </div>

                <div id="datePills" className="datepills">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <DatePill key={i} dayOffset={i} isToday={i === 0} />
                  ))}
                </div>
              </div>

              <div className="calendar-pop-cta">
                <a
                  data-cal-config='{"layout":"month_view"}'
                  data-cal-link="team/foreplay/foreplay-demo-action-plan"
                  data-cal-namespace="foreplay-demo-action-plan"
                  href="#"
                  className="button-light button-primary w-inline-block"
                >
                  <div className="button-text-block">
                    <div className="text-heading-m">Book a Call</div>
                  </div>
                </a>
                <a
                  href="https://app.isso.co/sign-up"
                  className="button-light button-stroke w-inline-block"
                >
                  <div className="button-text-block">
                    <div className="text-heading-m">Start Free Trial</div>
                  </div>
                  <div className="button-icon-block icon-right">
                    <div className="icon-24">
                      <div className="svg">
                        <svg
                          viewBox="0 0 20 20"
                          width="100%"
                          height="100%"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g
                            style={{
                              transform: 'rotate(-90deg)',
                              transformOrigin: 'center',
                            }}
                          >
                            <path
                              fill="none"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              d="M13 8.5L10.5303 10.9697C10.2374 11.2626 9.76255 11.2626 9.46968 10.9697L7 8.5"
                            />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
