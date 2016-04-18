import TextRange from 'batarange';

import Text from 'app/Viewer/utils/Text';
import mockRangeSelection from 'app/utils/mockRangeSelection';
import wrapper from 'app/utils/wrapper';

describe('Text', () => {
  let text;

  beforeEach(() => {
    text = Text(document);
  });

  describe('selected()', () => {
    it('should return true if text selected', () => {
      mockRangeSelection('text_selected');
      expect(text.selected()).toBe(true);
    });
    it('should return false if no text selected', () => {
      mockRangeSelection('');
      expect(text.selected()).toBe(false);
    });
  });

  describe('getSelection', () => {
    it('should return a serialized selection', () => {
      spyOn(TextRange, 'serialize').and.returnValue('serializedRange');
      let range = mockRangeSelection('text');

      let serializedRange = text.getSelection();
      expect(serializedRange).toEqual('serializedRange');
      expect(TextRange.serialize).toHaveBeenCalledWith(range, document);
    });
  });

  describe('simulateSelection', () => {
    it('should wrap the range with a span.fake-selection', () => {
      spyOn(wrapper, 'wrap').and.returnValue('fakeSelection');
      spyOn(TextRange, 'restore').and.returnValue('restoredRange');
      spyOn(text, 'removeSelection');
      spyOn(text, 'removeSimulatedSelection');

      text.simulateSelection('range');

      let elementWrapper = document.createElement('span');
      elementWrapper.classList.add('fake-selection');

      expect(TextRange.restore).toHaveBeenCalledWith('range', document);
      expect(wrapper.wrap).toHaveBeenCalledWith(elementWrapper, 'restoredRange');
      expect(text.fakeSelection).toBe('fakeSelection');
      expect(text.removeSelection).toHaveBeenCalled();
      expect(text.removeSimulatedSelection).toHaveBeenCalled();
    });

    describe('when selection passed is null', () => {
      it('should remove current fakeSelection', () => {
        spyOn(text, 'removeSimulatedSelection');
        text.simulateSelection(null);

        expect(text.removeSimulatedSelection).toHaveBeenCalled();
      });
    });
  });

  describe('removeSimulatedSelection', () => {
    it('should unwrap fake selection and set fakeSelection to null', () => {
      let unwrap = jasmine.createSpy('unwrap');
      text.fakeSelection = {unwrap};
      text.removeSimulatedSelection();

      expect(unwrap).toHaveBeenCalled();
      expect(text.fakeSelection).toBe(null);
    });

    describe('when no fakeSelection', () => {
      it('should not throw an error', () => {
        expect(text.removeSimulatedSelection.bind(text)).not.toThrow();
      });
    });
  });

  describe('renderReferences', () => {
    let unwrap;

    let elementWrapper = (id) => {
      let element = document.createElement('a');
      element.classList.add('reference');
      element.setAttribute('x-id', id);
      return element;
    };

    beforeEach(() => {
      unwrap = jasmine.createSpy('unwrap');
      spyOn(wrapper, 'wrap').and.returnValue({unwrap});
      spyOn(TextRange, 'restore').and.returnValue('restoredRange');
    });

    it('should wrap a collection of references', () => {
      let references = [{_id: '1', sourceRange: 'sourceRange1'}, {_id: '2', sourceRange: 'sourceRange2'}];

      text.renderReferences(references);
      expect(TextRange.restore).toHaveBeenCalledWith('sourceRange1', document);
      expect(TextRange.restore).toHaveBeenCalledWith('sourceRange2', document);
      expect(wrapper.wrap).toHaveBeenCalledWith(elementWrapper('1'), 'restoredRange');
      expect(wrapper.wrap).toHaveBeenCalledWith(elementWrapper('2'), 'restoredRange');
    });

    it('should not render references already rendered', () => {
      let firstReferneces = [{_id: '1', sourceRange: 'sourceRange1'}, {_id: '2', sourceRange: 'sourceRange2'}];
      let secondReferences = [
        {_id: '1', sourceRange: 'sourceRange1'}, {_id: '2', sourceRange: 'sourceRange2'}, {_id: '3', sourceRange: 'sourceRange3'}
      ];
      text.renderReferences(firstReferneces);
      TextRange.restore.calls.reset();
      wrapper.wrap.calls.reset();
      text.renderReferences(secondReferences);

      expect(TextRange.restore.calls.count()).toBe(1);
      expect(wrapper.wrap.calls.count()).toBe(1);
      expect(TextRange.restore).toHaveBeenCalledWith('sourceRange3', document);
      expect(wrapper.wrap).toHaveBeenCalledWith(elementWrapper('3'), 'restoredRange');
    });

    it('should unwrap references that are passed', () => {
      let firstReferneces = [{_id: '1', sourceRange: 'sourceRange1'}, {_id: '2', sourceRange: 'sourceRange2'}];
      let secondReferences = [{_id: '2', sourceRange: 'sourceRange2'}, {_id: '3', sourceRange: 'sourceRange3'}];
      text.renderReferences(firstReferneces);
      text.renderReferences(secondReferences);

      expect(unwrap.calls.count()).toBe(1);
      expect(text.renderedReferences[1]).not.toBeDefined();
    });
  });

  describe('highlight', () => {
    let createElement = () => {
      return document.createElement('a');
    };

    beforeEach(() => {
      text.renderedReferences = {
        reference1: {
          nodes: [createElement(), createElement()]
        },
        reference2: {
          nodes: [createElement(), createElement(), createElement()]
        }
      };
    });

    it('should add class highlighted to all nodes of a reference', () => {
      text.highlight('reference2');

      expect(text.renderedReferences.reference2.nodes[0].className).toBe('highlighted');
      expect(text.renderedReferences.reference2.nodes[1].className).toBe('highlighted');
    });

    it('should toggle highlighting when new reference is passed', () => {
      text.highlight('reference2');
      text.highlight('reference1');

      expect(text.renderedReferences.reference2.nodes[0].className).toBe('');
      expect(text.renderedReferences.reference2.nodes[1].className).toBe('');
      expect(text.renderedReferences.reference1.nodes[0].className).toBe('highlighted');
      expect(text.renderedReferences.reference1.nodes[1].className).toBe('highlighted');
    });

    describe('when passing null', () => {
      it('should not throw an error', () => {
        expect(text.highlight.bind(text, null)).not.toThrow();
      });
    });
  });
});