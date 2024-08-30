import L from "lodash";

export const ProblemType = Object.freeze({
  classification: "Classification",
  regression: "Regression",
});

export const prepareScatterPlotData = (data, xCol, yCol, problemType, targetCol, classes) => {
  if (problemType === ProblemType.classification) {
    return L.values(
      L.map(
        L.groupBy(data, (d) => d[targetCol]),
        (rows, clazz) => ({
          id: `Class: ${clazz}`,
          data: rows.map((row) => ({ x: row[xCol], y: row[yCol] })),
        })
      )
    );
  } else if (problemType === ProblemType.regression) {
    return [{ id: "all", data: data.map((d) => ({ x: d[xCol], y: d[yCol] })) }];
  }
};

export const prepareHistData = (data, xCol, problemType, targetCol) => {
  if (problemType === ProblemType.classification) {
    return L.values(
      L.map(
        L.groupBy(data, (d) => d[targetCol]),
        (rows, clazz) => ({
          id: `Class: ${clazz}`,
          data: L.sortBy(
            L.map(
              L.countBy(rows, (row) => row[xCol]),
              (count, val) => ({ x: parseFloat(val), y: count })
            ),
            (d) => d.x
          ),
        })
      )
    );
  } else if (problemType === ProblemType.regression) {
    return [
      {
        id: "all",
        data: L.sortBy(
          L.map(
            L.countBy(data, (d) => d[xCol]),
            (count, val) => ({ x: val, y: count })
          ),
          ["x"]
        ),
      },
    ];
  }
};

export const prepareHistogramData = (data, xCol, problemType, targetCol) => {
  const min = L.minBy(data, xCol)[xCol];
  const max = L.maxBy(data, xCol)[xCol];
  const binCount = 50;
  const binSize = (max - min) / binCount;

  let ranges = [];
  for (let i = 0; i < binCount; i++) {
    ranges.push({ start: min + i * binSize, end: min + (i + 1) * binSize });
  }

  let freqMapping = Object.fromEntries(ranges.map((r) => [r.start, 0]));
  data.forEach((d) => {
    const correctRange =
      L.find(ranges, (r) => d[xCol] >= r.start && d[xCol] < r.end) || ranges[binCount - 1];
    freqMapping[correctRange.start]++;
  });

  return Object.entries(freqMapping).map(([k, v]) => ({ id: Number(k).toFixed(2), freq: v }));
};

export const prepareDistPlotData = (data, xCol, yCol) => {
  const temp = L.mapValues(
    L.groupBy(data, (d) => d[yCol]),
    (val) =>
      L.mapValues(
        L.groupBy(val, (d) => d[xCol]),
        (v) => v.length
      )
  );

  return L.map(temp, (freqs, colVal) => ({ id: colVal, ...freqs }));
};

export const prepareFeatureScoreData = (axis1Values, axis2Values) => {
  return L.reverse(L.zip(axis2Values, axis1Values)).map(([x, y]) => ({
    id: x,
    score: Number(y).toFixed(2),
  }));
};

export const prepareHeatmapData = (correlationData) => {
  return L.map(correlationData, (corrOfCol1, col1) => ({
    id: col1,
    data: L.map(corrOfCol1, (corr, col2) => ({ x: col2, y: corr })),
  }));
};

export const prepareWaffleData = (data, targetCol) => {
  const len = data.length;
  return L.map(
    L.countBy(data, (d) => d[targetCol]),
    (count, val) => ({ id: val, label: `Class ${val}`, value: (count / len) * 100 })
  );
};

export const prepareViolinPlotData = (data, xCol, problemType, targetCol) => {
  if (problemType === ProblemType.classification) {
    const targetColValues = data.map((d) => d[targetCol]);
    return [
      {
        type: "violin",
        x: targetColValues,
        y: data.map((d) => d[xCol]),
        points: "none",
        box: {
          visible: true,
        },
        line: {
          color: "green",
        },
        meanline: {
          visible: true,
        },
        transforms: [
          {
            type: "groupby",
            groups: targetColValues,
            styles: [],
          },
        ],
      },
    ];
  } else if (problemType === ProblemType.regression) {
    return [
      {
        type: "violin",
        y: data.map((d) => d[xCol]),
        points: "none",
        box: {
          visible: true,
        },
        boxpoints: false,
        line: {
          color: "black",
        },
        // fillcolor: '#8dd3c7',
        opacity: 0.6,
        meanline: {
          visible: true,
        },
      },
    ];
  }
};
