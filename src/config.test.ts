import { expect } from 'chai';
import * as config from './config';

describe('config', () => {
  describe('getDefaults', () => {
    it('should return sensible defaults', () => {
      const defaults = config.getDefaults();

      expect(defaults.orientation).to.equal('horizontal');
      expect(defaults.width).to.equal(80);
      expect(defaults.height).to.equal(20);
      expect(defaults.labels).to.be.true;
      expect(defaults.colorLabels).to.be.true;
      expect(defaults.sort).to.be.true;
      expect(defaults.char).to.equal('█');
      // fill is opt-in, not a default
      expect(defaults.fill).to.be.undefined;
    });

    it('should include structure defaults', () => {
      const defaults = config.getDefaults();

      expect(defaults.structure).to.exist;
      expect(defaults.structure?.x).to.equal('═');
      expect(defaults.structure?.y).to.equal('╢');
      expect(defaults.structure?.axis).to.equal('║');
      expect(defaults.structure?.bottomLeft).to.equal('╚');
    });
  });

  describe('buildOptions', () => {
    it('should start with defaults', () => {
      const opts = config.buildOptions({});

      expect(opts.width).to.equal(80);
      expect(opts.orientation).to.equal('horizontal');
    });

    it('should override defaults with options', () => {
      const opts = config.buildOptions({
        width: 120,
        height: 40,
        sort: false,
        percentage: true
      });

      expect(opts.width).to.equal(120);
      expect(opts.height).to.equal(40);
      expect(opts.sort).to.be.false;
      expect(opts.percentage).to.be.true;
    });

    it('should clean yargs options', () => {
      const opts = config.buildOptions({
        _: [1, 2, 3],
        $0: 'chartscii',
        'color-labels': false,
        'bar-size': 2
      } as any);

      expect(opts).to.not.have.property('_');
      expect(opts).to.not.have.property('$0');
      expect(opts.colorLabels).to.be.false;
      expect(opts.barSize).to.equal(2);
    });

    it('should handle structure options from yargs', () => {
      const opts = config.buildOptions({
        'structure-x': '─',
        'structure-y': '│',
        'structure-axis': '┃',
        'structure-bottom-left': '└'
      } as any);

      expect(opts.structure?.x).to.equal('─');
      expect(opts.structure?.y).to.equal('│');
      expect(opts.structure?.axis).to.equal('┃');
      expect(opts.structure?.bottomLeft).to.equal('└');
    });

    it('should preserve structure when merging', () => {
      const opts = config.buildOptions({
        structure: {
          x: '─'
        }
      } as any);

      // Should preserve other structure properties
      expect(opts.structure?.x).to.equal('─');
      expect(opts.structure?.y).to.equal('╢'); // default preserved
      expect(opts.structure?.axis).to.equal('║'); // default preserved
    });

    it('should handle empty options', () => {
      const opts = config.buildOptions({});
      expect(opts.width).to.equal(80); // defaults preserved
    });

    it('should handle partial structure', () => {
      const opts = config.buildOptions({
        structure: {
          x: '='
        }
      } as any);

      expect(opts.structure?.x).to.equal('=');
      expect(opts.structure?.y).to.equal('╢');
    });

    it('should handle zero values', () => {
      const opts = config.buildOptions({
        padding: 0,
        barSize: 0
      });

      expect(opts.padding).to.equal(0);
      expect(opts.barSize).to.equal(0);
    });
  });
});
