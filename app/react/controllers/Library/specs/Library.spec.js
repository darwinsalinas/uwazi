import React, { Component, PropTypes } from 'react'
import Library from '../Library';
import backend from 'fetch-mock'
import TestUtils from 'react-addons-test-utils'
import {APIURL} from '../../../config.js'
import {events} from '../../../utils/index'
import Provider from '../../App/Provider'

describe('LibraryController', () => {

  let documents = [{key:'secret documents', value:{}}, {key:'real batman id', value:{}}];
  let seearchDocuments = [{key:'doc1', value:{}}, {key:'doc2', value:{}}];
  let component;

  beforeEach(() => {
    backend.restore();
    backend
    .mock(APIURL+'documents/search', 'GET', {body: JSON.stringify(documents)})
    .mock(APIURL+'documents/search?searchTerm=searchTerm', 'GET', {body: JSON.stringify(seearchDocuments)})

    let params = {};
    TestUtils.renderIntoDocument(<Provider><Library params={params} ref={(ref) => component = ref} /></Provider>);
  });

  describe('static requestState()', () => {
    it('should request documents and templates', (done) => {
      Library.requestState()
      .then((response) => {
        expect(response.documents).toEqual(documents);
        done();
      })
      .catch(done.fail)
    });
  });

  describe('search()', () => {
    it('should request documents and templates', (done) => {
      component.searchField = {value:'searchTerm'};

      component.search({preventDefault:() => {}})
      .then(() => {
        expect(component.state.documents).toEqual(seearchDocuments);
        done();
      })
      .catch(done.fail)
    });
  });

});
