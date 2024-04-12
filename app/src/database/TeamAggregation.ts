/**
 * This class is responsible for aggregating data for a team at a competition.
 * It does not make database calls, but rather, processes data retrieved from other APIs.
 */

class TeamAggregation {
  /**
   * This function calculates the average value of a given array.
   * @param array The array to calculate the average of.
   * @returns The average value of the array.
   */
  // from: https://stackoverflow.com/questions/7343890/standard-deviation-javascript
  static async getStandardDeviation(array: number[]) {
    if (array.length === 0 || array.length === 1) {
      console.log('get standard deviation called with empty array');
      return 0;
    }
    const n = array.length;
    const mean = this.getMean(array);
    return Math.sqrt(
      array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n,
    );
  }

  static getMean(array: number[]) {
    if (array.length === 0) {
      console.log('get mean called with empty array');
      return 0;
    }
    let sum = 0;

    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }

    return sum / array.length;
  }

  /**
   * This function calculates the median value of a given array.
   * @param reports an array of arrays of numbers to process
   * @param indices an array of indices to include in the calculation
   * @returns a sum of the values at the given indices
   */
  static createArrayFromIndices(reports: number[][], indices: number[]) {
    if (reports.length === 0) {
      console.warn('createArrayFromIndices called with empty reports array');
    }
    const matches: number[] = [];
    for (let i = 0; i < reports.length; i += 1) {
      let sum = 0;
      for (let j = 0; j < reports[i].length; j += 1) {
        if (indices.includes(j)) {
          sum += reports[i][j];
        }
      }
      matches.push(sum);
    }

    console.log('matches:', matches);

    return matches;
  }
}

export default TeamAggregation;
