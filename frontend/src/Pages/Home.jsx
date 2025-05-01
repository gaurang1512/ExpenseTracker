import React from 'react'
import DoughnutChart from '../Components/Chart/Chart';
import ExpenseDetails from '../Components/ExpenseDetails/ExpenseDetails';
import LineChart from '../Components/Chart/LineChart';

function Home() {
  return(
    <div className='Home-Page'>
      <div className="details">
        <ExpenseDetails/>
      </div>
      <div className="Chart-section">
        <div className="doughnut-chart-container">
          <DoughnutChart/>
        </div>
        <div className="Line-Chart">
          <LineChart/>
        </div>
      </div>
    </div>
  );
}

export default Home

