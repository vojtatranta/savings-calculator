import React from 'react';
import './App.css';
import NumberField from './number-field'
import { ResponsiveLine } from '@nivo/line'

const calculateFutureValue = (principal, interest, monthlySaving, years) => {
  return Array.from(Array(years).keys()).reduce((acc) => {
    const decimalInterest =  (1 + (interest / 100))
    const saved = (acc.prev + (monthlySaving * 12))
    const interestValue = Math.round(saved * (interest / 100))
    const next = Math.round(saved * decimalInterest)
    return {
      prev: next,
      values: acc.values.concat(next),
      interests: acc.interests.concat(interestValue)
    }
  }, {
    prev: principal,
    values: [principal],
    interests: [0],
  })
}

function App({ yearNow, state, setState }) {
  const formatter = Intl.NumberFormat('cs-CZ', {  style: 'currency', currency: 'CZK'})
  const future = calculateFutureValue(state.saved, state.interest, state.monthlySavings, state.years || 0)

  const normalizedFuture = future.values
    .map((value, index) => ({
      x: yearNow + index,
      y: value,
    }))

  const data = [{
    id: 'Našetřeno',
    data: normalizedFuture,
  }]

  return (
    <div className="app is-flexbox has-row-direction">
      <div className='calculator has-flex'>
        <div className='form is-flexbox has-column-direction'>
          <div className='form-row'>
            <label><span className='actual-label'>Našetřeno:</span><br/>
              <NumberField
                defaultValue={state.saved}
                step={1000}
                onChange={value => setState(prev => ({
                  ...prev,
                  saved: value,
                }))}
              />
            </label>
          </div>
          <div className='form-row'>
            <label><span className='actual-label'>Kolik let spořím:</span><br/>
              <NumberField
                defaultValue={Math.max(state.years, 0)}
                min={0}
                onChange={value => setState(prev => ({
                  ...prev,
                  years: Math.max(value, 0),
                }))}
              />
            </label>
          </div>
          <div className='form-row'>
            <label><span className='actual-label'>Měsíčně spořím:</span><br/>
              <NumberField
                defaultValue={state.monthlySavings}
                step={100}
                onChange={value => setState(prev => ({
                  ...prev,
                  monthlySavings: value,
                }))}
              />
            </label>
          </div>
          <div className='form-row'>
            <label><span className='actual-label'>Úrok:</span><br/>
              <NumberField
                defaultValue={state.interest}
                onChange={value => setState(prev => ({
                  ...prev,
                  interest: value,
                }))}
              />%
            </label>
          </div>
          <div className='objectives'>
            <div className='form-row'>
              <label><span className='actual-label'>Kolik chcete našetřit:</span><br/>
                <NumberField
                  defaultValue={state.target}
                  step={1000}
                  onChange={value => setState(prev => ({
                    ...prev,
                    target: value || null,
                  }))}
                />
              </label>
              <div className='objective-predictions'>
                  <div>
                    <strong>Našetříte v roce:</strong><br/>
                    {
                      normalizedFuture.find(desc => desc.y >= state.target)?.x ||
                      'Nenašetříte, zvyšte si úrok úspory nebo dobu šetření'
                    }
                  </div>
                  <div>
                    <strong>Našetřená částka:</strong><br/>
                    {formatter.format(future.values[future.values.length - 1] || 0)}
                  </div>
                  <div>
                    <strong>Roční úrok z našetřené částky:</strong><br/>
                    {formatter.format(future.interests[future.interests.length - 1] || 0)}
                  </div>
                  <div>
                    <strong>Měsíční úrok z našetřené částky:</strong><br/>
                    {formatter.format(Math.round((future.interests[future.interests.length - 1] || 0) / 12))}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='chart has-flex'>
        <div style={{ height: 500, width: '100%' }}>
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 80 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Roky',
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Našetřeno',
            legendOffset: -65,
            legendPosition: 'middle'
          }}
          colors={{ scheme: 'set1' }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel='y'
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[{
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
                {
                    on: 'hover',
                    style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1
                    }
                }
            ]
          }]}
        />
        </div>
        </div>
    </div>
  );
}

export default App;
