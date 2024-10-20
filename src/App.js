import React from "react";
import "./App.css";
import NumberField from "./number-field";
import { ResponsiveLine } from "@nivo/line";

const calculateFutureValue = (principal, interest, monthlySaving, years) => {
  return Array.from(Array(years).keys()).reduce(
    (acc) => {
      const saved = (acc.prev ?? principal) + monthlySaving * 12;
      const interestValue = Math.round(saved * (interest / 100));
      const next = Math.round(saved + interestValue);
      return {
        prev: next,
        values: acc.values.concat(next),
        interests: acc.interests.concat(interestValue),
      };
    },
    {
      prev: null,
      values: [],
      interests: [],
    }
  );
};

function App({ yearNow, state, setState }) {
  const formatter = Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
  });
  const future = calculateFutureValue(
    state.saved,
    state.interest,
    state.monthlySavings,
    state.years
  );

  const inHundredYears = calculateFutureValue(
    state.saved,
    state.interest,
    state.monthlySavings,
    500
  ).values.map((value, index) => ({
    x: yearNow + index,
    y: value,
  }));

  console.log("future", future);

  const data = [
    {
      id: "Roční úrok",
      data: future.interests.map((value, index) => ({
        x: yearNow + index,
        y: value,
      })),
    },
    {
      id: "Našetřeno",
      data: future.values.map((value, index) => ({
        x: yearNow + index,
        y: value,
      })),
    },
  ];

  const endOfTheYearValue = future.values[future.values.length - 1] || 0;

  const endOfTheYearInterest = (endOfTheYearValue * state.interest) / 100 || 0;
  const monthlyEndOfTheYearInterest = endOfTheYearInterest / 12 || 0;

  return (
    <div className="app is-flexbox has-row-direction">
      <div className="calculator has-flex">
        <div className="form is-flexbox has-column-direction">
          <div className="form-row">
            <label>
              <span className="actual-label">Našetřeno:</span>
              <br />
              <NumberField
                defaultValue={state.saved}
                step={1000}
                onChange={(value) =>
                  setState((prev) => ({
                    ...prev,
                    saved: value,
                  }))
                }
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              <span className="actual-label">Kolik let spořím:</span>
              <br />
              <NumberField
                defaultValue={Math.max(state.years, 0)}
                min={0}
                onChange={(value) =>
                  setState((prev) => ({
                    ...prev,
                    years: Math.max(value, 0),
                  }))
                }
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              <span className="actual-label">Měsíčně spořím:</span>
              <br />
              <NumberField
                defaultValue={state.monthlySavings}
                step={100}
                onChange={(value) =>
                  setState((prev) => ({
                    ...prev,
                    monthlySavings: value,
                  }))
                }
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              <span className="actual-label">Úrok:</span>
              <br />
              <NumberField
                defaultValue={state.interest}
                onChange={(value) =>
                  setState((prev) => ({
                    ...prev,
                    interest: value,
                  }))
                }
              />
              %
            </label>
          </div>
          <div className="objectives">
            <div className="future-objectives">
              <div className="form-row">
                <label>
                  <span className="actual-label">Kolik chcete našetřit:</span>
                  <br />
                  <NumberField
                    defaultValue={state.target}
                    step={1000}
                    onChange={(value) =>
                      setState((prev) => ({
                        ...prev,
                        target: value || null,
                      }))
                    }
                  />
                </label>
                <div>
                  <strong>Našetříte v roce:</strong>
                  <br />
                  {inHundredYears.find((desc) => desc.y >= state.target)?.x ||
                    "Nenašetříte, zvyšte si úrok úspory nebo dobu šetření"}
                </div>
              </div>
              <div className="objective-predictions">
                <h2>Po {state.years} letech:</h2>
                <div>
                  <strong>Našetříte:</strong>
                  <br />
                  {formatter.format(
                    future.values[future.values.length - 1] || 0
                  )}
                </div>
                <div>
                  <strong>Roční úrok z našetřené částky:</strong>
                  <br />
                  {formatter.format(endOfTheYearInterest)}
                </div>
                <div>
                  <strong>Měsíční úrok z našetřené částky:</strong>
                  <br />
                  {formatter.format(monthlyEndOfTheYearInterest)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="chart has-flex">
        <div style={{ height: 600, width: "100%" }}>
          <ResponsiveLine
            data={data}
            yFormat={(v) => formatter.format(v)}
            margin={{ top: 50, right: 100, bottom: 50, left: 110 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Roky",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              format: (e) => formatter.format(e),
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendOffset: -85,
              legendPosition: "middle",
            }}
            colors={{ scheme: "set1" }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            enablePointLabel
            pointLabel={(e) => formatter.format(e.y)}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
