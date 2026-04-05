// DirectoryFilters — sidebar with search input and filter checkbox groups (services, industries, countries).

import type { FilterGroup } from './types';

interface Props {
  filterGroups: FilterGroup[];
}

function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 5.99994H16M8 13.9999H12M6 9.99994H14" stroke="white" strokeOpacity="0.68" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FilterGroupSection({ group }: { group: FilterGroup }) {
  return (
    <div className="filter_block">
      <div className="filter_block_header">
        <div className="text-white">
          <div className="text-label-m">{group.title}</div>
        </div>
        <a href="#" className="filter_clear helper">Clear</a>
      </div>

      <div className="filter_list-wrapper w-dyn-list">
        <div role="list" className="filter_list w-dyn-items">
          {group.options.map((option) => (
            <div key={option.value} role="listitem" className="filter_item w-dyn-item">
              <label className="w-checkbox checkbox_field is-list-emptyfacet helper">
                {/* Hidden native checkbox */}
                <input
                  type="checkbox"
                  style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
                />
                {/* Custom visual checkbox */}
                <div className="w-checkbox-input w-checkbox-input--inputType-custom checkbox_input helper" />
                {/* Country flag (if present) */}
                {option.flagSrc && (
                  <img
                    src={option.flagSrc}
                    loading="lazy"
                    alt=""
                    className="agency-directory-location-flag sidebar"
                  />
                )}
                <span className="text-label-s w-form-label">{option.label}</span>
                <div className="filter_facet-count helper">0</div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DirectoryFilters({ filterGroups }: Props) {
  return (
    <div className="directory-filter-section">
      <div className="filter_form_block w-form">
        <form id="wf-form-filter" name="wf-form-filter" data-name="filter" method="get" className="filter_form">
          {/* Header */}
          <div className="filter_block_header">
            <div className="flex-gap-1">
              <div className="icon-20">
                <div className="w-embed">
                  <FilterIcon />
                </div>
              </div>
              <div className="text-white">
                <div className="text-label-m">Filters</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="filter_block">
            <input
              className="filter_search helper w-input"
              maxLength={256}
              name="field"
              data-name="Field"
              placeholder="Search here..."
              type="text"
              id="field"
              required
            />
          </div>

          {/* Filter groups */}
          {filterGroups.map((group) => (
            <FilterGroupSection key={group.field} group={group} />
          ))}
        </form>
      </div>
    </div>
  );
}
