import React from 'react'
import { calender, comment, dollar, expenseTitle, trash, edit } from '../../Utils/Icons'
import { dateFormat } from '../../Utils/dateFormat'

function ExpenseItem({ expenses,sortedIncomes, handleDeleteExpense, handleUpdateExpense }) {
  return (
    <div className='income-list'>
      <section className='inner-content'>
        <div>
          <div className='income-table'>
            <table>
              <tbody>
                {Array.isArray(expenses) && sortedIncomes.map((expense, index) => (
                  <tr key={index}>
                    <td className="expense-cell">
                      <div className="expense-title">{expenseTitle}Title : </div>
                      <span className="expense-value">{expense.title}</span>
                    </td>
                    <td className="expense-cell">
                      <div className="expense-title">{comment} Description : </div>
                      <span className="expense-value">{expense.description}</span>
                    </td>
                    <td className="expense-cell">
                      <div className="expense-title">{calender} Date : </div>  
                      <span className="expense-value">{dateFormat(expense.date)}</span>
                    </td>
                    <td className="expense-cell">
                      <div className="expense-title">{dollar} Amount : </div>  
                      <span className="expense-value">${expense.amount}</span>
                    </td>
                    <td>
                      <button className='update-button' onClick={() => handleUpdateExpense(expense._id)}>
                        {edit} Update
                      </button>
                    </td>
                    <td>
                      <button className='delete-button' onClick={() => handleDeleteExpense(expense._id)}>
                        {trash} Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ExpenseItem
