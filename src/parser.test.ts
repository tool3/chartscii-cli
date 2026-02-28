import { expect } from 'chai';
import * as parser from './parser';

describe('parser', () => {
  describe('parseJSON', () => {
    it('should parse array of numbers', () => {
      const result = parser.parseJSON('[1, 2, 3, 4, 5]');
      expect(result).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it('should parse array of objects', () => {
      const json = '[{"label": "A", "value": 10}, {"label": "B", "value": 20}]';
      const result = parser.parseJSON(json);
      expect(result).to.deep.equal([
        { label: 'A', value: 10 },
        { label: 'B', value: 20 }
      ]);
    });

    it('should parse mixed array', () => {
      const json = '[1, {"label": "B", "value": 2}, 3]';
      const result = parser.parseJSON(json);
      expect(result).to.deep.equal([1, { label: 'B', value: 2 }, 3]);
    });

    it('should throw on invalid JSON', () => {
      expect(() => parser.parseJSON('not json')).to.throw('Invalid JSON');
    });

    it('should throw on non-array JSON', () => {
      expect(() => parser.parseJSON('{"foo": "bar"}')).to.throw('JSON must be an array');
    });
  });

  describe('parseCSV', () => {
    it('should parse simple comma-separated values', () => {
      const result = parser.parseCSV('1,2,3,4,5');
      expect(result).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it('should parse label,value pairs', () => {
      const csv = 'Label A,10\nLabel B,20\nLabel C,30';
      const result = parser.parseCSV(csv);
      expect(result).to.deep.equal([
        { label: 'Label A', value: 10 },
        { label: 'Label B', value: 20 },
        { label: 'Label C', value: 30 }
      ]);
    });

    it('should parse single values per line', () => {
      const csv = '10\n20\n30';
      const result = parser.parseCSV(csv);
      expect(result).to.deep.equal([10, 20, 30]);
    });

    it('should handle whitespace', () => {
      const csv = ' 10 , 20 , 30 ';
      const result = parser.parseCSV(csv);
      expect(result).to.deep.equal([10, 20, 30]);
    });

    it('should skip empty lines', () => {
      const csv = '10\n\n20\n\n30';
      const result = parser.parseCSV(csv);
      expect(result).to.deep.equal([10, 20, 30]);
    });
  });

  describe('parseText', () => {
    it('should parse space-separated numbers', () => {
      const result = parser.parseText('1 2 3 4 5');
      expect(result).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it('should parse newline-separated numbers', () => {
      const result = parser.parseText('1\n2\n3\n4\n5');
      expect(result).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it('should handle mixed whitespace', () => {
      const result = parser.parseText('1  2\n3\t4   5');
      expect(result).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it('should handle decimals', () => {
      const result = parser.parseText('1.5 2.3 3.7');
      expect(result).to.deep.equal([1.5, 2.3, 3.7]);
    });

    it('should ignore non-numeric values', () => {
      const result = parser.parseText('1 foo 2 bar 3');
      expect(result).to.deep.equal([1, 2, 3]);
    });
  });

  describe('parseArgs', () => {
    it('should parse numeric arguments', () => {
      const result = parser.parseArgs([1, 2, 3, 4, 5]);
      expect(result).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it('should parse string numbers', () => {
      const result = parser.parseArgs(['1', '2', '3', '4', '5']);
      expect(result).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it('should parse object notation', () => {
      const result = parser.parseArgs(["label: 'foo', value: 10"]);
      expect(result).to.deep.equal([{ label: 'foo', value: 10 }]);
    });

    it('should handle mixed arguments', () => {
      const result = parser.parseArgs([1, '2', "label: 'bar', value: 3"]);
      expect(result.length).to.equal(3);
      expect(result[0]).to.equal(1);
      expect(result[1]).to.equal(2);
    });
  });

  describe('parse (auto-detect)', () => {
    it('should auto-detect JSON', () => {
      const result = parser.parse('[1, 2, 3]');
      expect(result).to.deep.equal([1, 2, 3]);
    });

    it('should auto-detect CSV', () => {
      const result = parser.parse('1,2,3');
      expect(result).to.deep.equal([1, 2, 3]);
    });

    it('should auto-detect plain text', () => {
      const result = parser.parse('1 2 3');
      expect(result).to.deep.equal([1, 2, 3]);
    });

    it('should throw on empty input', () => {
      expect(() => parser.parse('')).to.throw('Empty input');
    });

    it('should handle complex JSON objects', () => {
      const json = '[{"label": "Test", "value": 42, "color": "red"}]';
      const result = parser.parse(json);
      expect(result).to.deep.equal([{ label: 'Test', value: 42, color: 'red' }]);
    });
  });
});
