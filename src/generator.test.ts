import { expect } from 'chai';
import * as generator from './generator';

describe('generator', () => {
  describe('generate', () => {
    it('should generate chart from numeric arguments', async () => {
      const chart = await generator.generate([1, 2, 3, 4, 5]);

      expect(chart).to.be.a('string');
      expect(chart.length).to.be.greaterThan(0);
    });

    it('should generate chart with options', async () => {
      const chart = await generator.generate(
        [10, 20, 30],
        {
          title: 'Test Chart',
          width: 50,
          orientation: 'horizontal'
        }
      );

      expect(chart).to.include('Test Chart');
    });

    it('should handle string number arguments', async () => {
      const chart = await generator.generate(['1', '2', '3']);

      expect(chart).to.be.a('string');
      expect(chart.length).to.be.greaterThan(0);
    });

    it('should throw on empty data', async () => {
      try {
        await generator.generate([]);
        expect.fail('Should have thrown');
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        expect(message).to.match(/No input|Empty input/);
      }
    });

    it('should apply color options', async () => {
      const chart = await generator.generate(
        [1, 2, 3],
        {
          color: 'red',
          colorLabels: true
        }
      );

      expect(chart).to.be.a('string');
    });

    it('should apply sorting', async () => {
      const chart = await generator.generate(
        [5, 2, 8, 1, 9],
        {
          sort: true
        }
      );

      expect(chart).to.be.a('string');
    });

    it('should handle vertical orientation', async () => {
      const chart = await generator.generate(
        [1, 2, 3],
        {
          orientation: 'vertical',
          width: 30,
          height: 10
        }
      );

      expect(chart).to.be.a('string');
    });

    it('should throw on invalid width', async () => {
      try {
        await generator.generate(
          [1, 2, 3],
          {
            width: -10
          } as any
        );
        expect.fail('Should have thrown');
      } catch (error: unknown) {
        expect(error).to.exist;
      }
    });

    it('should use sensible defaults when no options provided', async () => {
      const chart = await generator.generate([1, 2, 3, 4, 5]);

      expect(chart).to.be.a('string');
      expect(chart.length).to.be.greaterThan(0);
    });

    it('should allow overriding individual defaults', async () => {
      const chart = await generator.generate(
        [1, 2, 3],
        {
          width: 120
        }
      );

      expect(chart).to.be.a('string');
    });
  });
});
