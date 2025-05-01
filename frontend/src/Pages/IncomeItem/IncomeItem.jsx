import React, { useState, useEffect } from 'react';
import { calender, comment, dollar, expenseTitle, trash, edit } from '../../Utils/Icons';
import { dateFormat } from '../../Utils/dateFormat';
import { handleError, handleSucess } from '../../Utils/utils';
import { Link } from 'react-router-dom';

function IncomeItem({ incomes, sortedIncomes, handleDeleteIncome, handleUpdateIncome }) {
  

  return (
    <div className="income-item-section">

      
      <div className="income-list">
        <section className="inner-content">
          <div>
            <div className="income-table">
              <table>
                <tbody>
                  {Array.isArray(sortedIncomes) &&
                    sortedIncomes.map((income, index) => (
                      income ? (
                        <tr key={index}>
                          <td className="expense-cell">
                            <div className="expense-title">{expenseTitle}Title : </div>
                            <span className="expense-value">{income.title}</span>
                          </td>
                          <td className="expense-cell">
                            <div className="expense-title">{comment} Description : </div>
                            <span className="expense-value">{income.description}</span>
                          </td>
                          <td className="expense-cell">
                            <div className="expense-title">{calender} Date : </div>
                            <span className="expense-value">{dateFormat(income.date)}</span>
                          </td>
                          <td className="expense-cell">
                            <div className="expense-title">{dollar} Amount : </div>
                            <span className="expense-value">${income.amount}</span>
                          </td>

                          <td>
                            <button className="update-button" onClick={() => handleUpdateIncome(income._id)}>
                              {edit} Update
                            </button>
                          </td>

                          <td>
                            <button className="delete-button" onClick={() => handleDeleteIncome(income._id)}>
                              {trash} Delete
                            </button>
                          </td>
                        </tr>
                      ) : null
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default IncomeItem;
