import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { I18NLink, t } from 'app/I18N';
import { Icon } from 'UI';
import { processFilters, encodeSearch } from 'app/Library/actions/libraryActions';
import { helper as mapHelper } from 'app/Map';

export class LibraryModeToggleButtons extends Component {
  render() {
    const { numberOfMarkers, zoomLevel, zoomOut, zoomIn, showGeolocation, searchUrl } = this.props;
    const numberOfMarkersText = numberOfMarkers.toString().length > 3 ? '99+' : numberOfMarkers;

    return (
      <div className="list-view-mode">
        <div className={`list-view-mode-zoom list-view-buttons-zoom-${zoomLevel} buttons-group`}>
          <button className="btn btn-default zoom-out" onClick={zoomOut} type="button">
            <Icon icon="search-minus" />
            <span className="tab-link-tooltip">{t('System', 'Zoom out')}</span>
          </button>
          <button className="btn btn-default zoom-in" onClick={zoomIn} type="button">
            <Icon icon="search-plus" />
            <span className="tab-link-tooltip">{t('System', 'Zoom in')}</span>
          </button>
        </div>

        { showGeolocation && (
          <div className="list-view-mode-map buttons-group">
            <I18NLink to={`library${searchUrl}`} className="btn btn-default" activeClassName="is-active">
              <Icon icon="th" />
              <span className="tab-link-tooltip">{t('System', 'List view')}</span>
            </I18NLink>
            <I18NLink
              disabled={!numberOfMarkers}
              to={`library/map${searchUrl}`}
              className="btn btn-default"
              activeClassName="is-active"
            >
              <Icon icon="map-marker" />
              <span className="number-of-markers">{numberOfMarkersText}</span>
              <span className="tab-link-tooltip">{t('System', 'Map view')}</span>
            </I18NLink>
          </div>
        )}
      </div>
    );
  }
}

LibraryModeToggleButtons.propTypes = {
  searchUrl: PropTypes.string.isRequired,
  showGeolocation: PropTypes.bool.isRequired,
  zoomIn: PropTypes.func.isRequired,
  zoomOut: PropTypes.func.isRequired,
  zoomLevel: PropTypes.number.isRequired,
  numberOfMarkers: PropTypes.number.isRequired,
};

export function mapStateToProps(state, props) {
  const filters = state[props.storeKey].filters.toJS();
  const params = processFilters(state[props.storeKey].search, filters);
  const { templates } = state;
  const showGeolocation = Boolean(templates.find(_t => _t.get('properties').find(p => p.get('type') === 'geolocation')));
  const numberOfMarkers = mapHelper.getMarkers(state[props.storeKey].markers.get('rows'), state.templates).length;
  return {
    searchUrl: encodeSearch(params),
    showGeolocation,
    numberOfMarkers,
    zoomLevel: Object.keys(props).indexOf('zoomLevel') !== -1 ? props.zoomLevel : state[props.storeKey].ui.get('zoomLevel'),
  };
}

export default connect(mapStateToProps)(LibraryModeToggleButtons);
