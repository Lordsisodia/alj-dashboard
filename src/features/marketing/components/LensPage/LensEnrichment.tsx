import Image from 'next/image';
import { EnrichmentTool } from './types';

interface Props {
  tools: EnrichmentTool[];
}

export default function LensEnrichment({ tools }: Props) {
  // First 3 tools on the left side of the rainbow circle, next 4 on the right
  const leftTools = tools.slice(0, 3);
  const rightTools = tools.slice(3);

  return (
    <div className="lens-enrichment">
      <div className="container">
        <div className="section-head">
          <div className="section-head-wrapper">
            <div className="section-head_subtitle">
              <div className="text-overline text-white-68">AI METADATA</div>
            </div>
            <h2 className="text-display-h3">Trade manual work for automated enrichment.</h2>
            <p className="text-body-m text-alpha-100">
              Stop being a slave to manual tagging and report building. Automatically enrich your advertising assets with AI
              metadata and advanced tag rules.
            </p>
          </div>
        </div>
      </div>

      <figure className="lens-enrichment-illustration">
        {/* Rainbow circle */}
        <div className="lens-enrichment-illustration-intersection">
          <div className="lens-enrichment-illustration-oval_shape">
            <div className="svg w-embed">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 520 520">
                <defs>
                  <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="0%" y2="1200%">
                    <stop offset="0%" stopColor="#E77F6E" />
                    <stop offset="3.33%" stopColor="#FFC852" />
                    <stop offset="6.66%" stopColor="#D2E382" />
                    <stop offset="10%" stopColor="#7CDDB5" />
                    <stop offset="13.33%" stopColor="#5DBCE5" />
                    <stop offset="16.66%" stopColor="#5D8FE5" />
                    <stop offset="20%" stopColor="#5DBCE5" />
                    <stop offset="23.33%" stopColor="#7CDDB5" />
                    <stop offset="26.66%" stopColor="#D2E382" />
                    <stop offset="30%" stopColor="#FFC852" />
                    <stop offset="33.33%" stopColor="#E77F6E" />
                    <stop offset="36.66%" stopColor="#FFC852" />
                    <stop offset="40%" stopColor="#D2E382" />
                    <stop offset="43.33%" stopColor="#7CDDB5" />
                    <stop offset="46.66%" stopColor="#5DBCE5" />
                    <stop offset="50%" stopColor="#5D8FE5" />
                    <stop offset="53.33%" stopColor="#5DBCE5" />
                    <stop offset="56.66%" stopColor="#7CDDB5" />
                    <stop offset="60%" stopColor="#D2E382" />
                    <stop offset="63.33%" stopColor="#FFC852" />
                    <stop offset="66.66%" stopColor="#E77F6E" />
                    <stop offset="70%" stopColor="#FFC852" />
                    <stop offset="73.33%" stopColor="#D2E382" />
                    <stop offset="76.66%" stopColor="#7CDDB5" />
                    <stop offset="80%" stopColor="#5DBCE5" />
                    <stop offset="83.33%" stopColor="#5D8FE5" />
                    <stop offset="86.66%" stopColor="#5DBCE5" />
                    <stop offset="90%" stopColor="#7CDDB5" />
                    <stop offset="93.33%" stopColor="#D2E382" />
                    <stop offset="96.66%" stopColor="#FFC852" />
                  </linearGradient>
                  <clipPath id="intersection-clip">
                    <path d="M260 485C338.219 440.605 391 356.476 391 260C391 163.524 338.219 79.395 260 35C181.781 79.395 129 163.524 129 260C129 356.476 181.781 440.605 260 485Z" />
                  </clipPath>
                </defs>
                <rect x="0" y="0" width="520" height="520" fill="url(#rainbow-gradient)" clipPath="url(#intersection-clip)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Left tooltips */}
        <div className="lens-enrichment-illustration-ray-2">
          <div className="lens-enrichment-illustration-fader" />
          <div className="lens-enrichment-tooltip_layer">
            {leftTools.map((tool, i) => (
              <div key={tool.name} className={`lens-integrations-tooltip-container is-${i + 1}`}>
                <div className="lens-enrichment-tooltip">
                  <div className="lens-enrichment-tooltip-wrapper">
                    <div className="lens-enrichment-tooltip-body">
                      <div className="div-block-327">
                        <Image src={tool.imageUrl} width={276} height={184} alt={tool.name} className="lens-enrichment-tooltip-image" />
                      </div>
                      <div className="div-block-328">
                        <div className="text-body-s text-alpha-50">{tool.description}</div>
                      </div>
                    </div>
                  </div>
                  <div className="lens-enrichment-tooltip-trigger">
                    <div className="lens-enrichment-tooltip-dot_container">
                      <div className="lens-enrichment-tooltip-ring">
                        <div className="lens-enrichment-tooltip-ring_inner" />
                      </div>
                      <div className="lens-enrichment-tooltip-dot" />
                    </div>
                    <div className="text-white">
                      <div className="text-tooltip">{tool.name}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right tooltips */}
        <div className="lens-enrichment-illustration-ray-2 is-inverted">
          <div className="lens-enrichment-illustration-fader" />
          <div className="lens-enrichment-tooltip_layer is-inverted is-lens">
            {rightTools.map((tool, i) => (
              <div key={tool.name} className={`lens-integrations-tooltip-container is-${i + 4}`}>
                <div className="lens-enrichment-tooltip">
                  <div className="lens-enrichment-tooltip-wrapper">
                    <div className="lens-enrichment-tooltip-body">
                      <div className="div-block-327">
                        <Image src={tool.imageUrl} width={276} height={184} alt={tool.name} className="lens-enrichment-tooltip-image" />
                      </div>
                      <div className="div-block-328">
                        <div className="text-body-s text-alpha-50">{tool.description}</div>
                      </div>
                    </div>
                  </div>
                  <div className="lens-enrichment-tooltip-trigger">
                    <div className="lens-enrichment-tooltip-dot_container">
                      <div className="lens-enrichment-tooltip-ring">
                        <div className="lens-enrichment-tooltip-ring_inner" />
                      </div>
                      <div className="lens-enrichment-tooltip-dot" />
                    </div>
                    <div className="text-white">
                      <div className="text-tooltip">{tool.name}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lens-enrichment-illustration-overlay">
          <div className="lens-enrichment-overlay_line" />
        </div>
      </figure>
    </div>
  );
}
